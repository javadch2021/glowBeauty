import { Collection } from "mongodb";
import { connectToDatabase, COLLECTIONS } from "../mongodb.server";
import {
  ActivityItem,
  ActivityDocument,
  documentToActivity,
  activityToDocument,
} from "../models";

export class ActivityService {
  private async getCollection(): Promise<Collection<ActivityDocument>> {
    const db = await connectToDatabase();
    return db.collection<ActivityDocument>(COLLECTIONS.ACTIVITY);
  }

  /**
   * Get all activity items
   */
  async getAll(): Promise<ActivityItem[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection.find({}).sort({ id: -1 }).toArray(); // Latest first
      return documents.map(documentToActivity);
    } catch (error) {
      console.error("Error fetching all activity items:", error);
      throw new Error("Failed to fetch activity items");
    }
  }

  /**
   * Get recent activity items with limit
   */
  async getRecent(limit: number = 10): Promise<ActivityItem[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection
        .find({})
        .sort({ id: -1 })
        .limit(limit)
        .toArray();
      return documents.map(documentToActivity);
    } catch (error) {
      console.error("Error fetching recent activity items:", error);
      throw new Error("Failed to fetch recent activity items");
    }
  }

  /**
   * Get activity items by type
   */
  async getByType(type: ActivityItem["type"]): Promise<ActivityItem[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection
        .find({ type })
        .sort({ id: -1 })
        .toArray();
      return documents.map(documentToActivity);
    } catch (error) {
      console.error(`Error fetching activity items by type ${type}:`, error);
      throw new Error("Failed to fetch activity items by type");
    }
  }

  /**
   * Create a new activity item
   */
  async create(activityData: Omit<ActivityItem, "id">): Promise<ActivityItem> {
    try {
      const collection = await this.getCollection();

      // Get the next available ID
      const lastActivity = await collection.findOne({}, { sort: { id: -1 } });
      const nextId = lastActivity ? lastActivity.id + 1 : 1;

      const newActivity: ActivityItem = {
        ...activityData,
        id: nextId,
      };

      const document = {
        ...activityToDocument(newActivity),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(document);

      if (!result.acknowledged) {
        throw new Error("Failed to insert activity item");
      }

      console.log(`ActivityService - Created activity item with ID ${nextId}`);
      return newActivity;
    } catch (error) {
      console.error("Error creating activity item:", error);
      throw new Error("Failed to create activity item");
    }
  }

  /**
   * Log order activity
   */
  async logOrderActivity(
    orderId: number,
    customerName: string,
    action: string
  ): Promise<void> {
    try {
      const message = `${action} #${orderId} from ${customerName}`;
      await this.create({
        type: "order",
        message,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error logging order activity:", error);
      // Don't throw error for activity logging to avoid breaking main operations
    }
  }

  /**
   * Log customer activity
   */
  async logCustomerActivity(
    customerName: string,
    action: string
  ): Promise<void> {
    try {
      const message = `${action}: ${customerName}`;
      await this.create({
        type: "customer",
        message,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error logging customer activity:", error);
      // Don't throw error for activity logging to avoid breaking main operations
    }
  }

  /**
   * Log product activity
   */
  async logProductActivity(productName: string, action: string): Promise<void> {
    try {
      const message = `Product '${productName}' ${action}`;
      await this.create({
        type: "product",
        message,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error logging product activity:", error);
      // Don't throw error for activity logging to avoid breaking main operations
    }
  }

  /**
   * Delete old activity items (keep only recent ones)
   */
  async cleanup(keepCount: number = 100): Promise<number> {
    try {
      const collection = await this.getCollection();

      // Get the ID of the item at the keepCount position
      const itemsToKeep = await collection
        .find({})
        .sort({ id: -1 })
        .limit(keepCount)
        .toArray();

      if (itemsToKeep.length === keepCount) {
        const oldestToKeepId = itemsToKeep[itemsToKeep.length - 1].id;
        const result = await collection.deleteMany({
          id: { $lt: oldestToKeepId },
        });

        console.log(
          `ActivityService - Cleaned up ${result.deletedCount} old activity items`
        );
        return result.deletedCount;
      }

      return 0;
    } catch (error) {
      console.error("Error cleaning up activity items:", error);
      throw new Error("Failed to cleanup activity items");
    }
  }

  /**
   * Get activity count
   */
  async getCount(): Promise<number> {
    try {
      const collection = await this.getCollection();
      return await collection.countDocuments();
    } catch (error) {
      console.error("Error getting activity count:", error);
      throw new Error("Failed to get activity count");
    }
  }

  /**
   * Get activity items with pagination
   */
  async getPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    activities: ActivityItem[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const collection = await this.getCollection();
      const skip = (page - 1) * limit;

      const [documents, total] = await Promise.all([
        collection.find({}).sort({ id: -1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments(),
      ]);

      const activities = documents.map(documentToActivity);
      const totalPages = Math.ceil(total / limit);

      return {
        activities,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching paginated activity items:", error);
      throw new Error("Failed to fetch paginated activity items");
    }
  }

  /**
   * Delete all activity items
   */
  async deleteAll(): Promise<number> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteMany({});
      console.log(
        `ActivityService - Deleted all ${result.deletedCount} activity items`
      );
      return result.deletedCount;
    } catch (error) {
      console.error("Error deleting all activity items:", error);
      throw new Error("Failed to delete all activity items");
    }
  }
}

// Export singleton instance
export const activityService = new ActivityService();

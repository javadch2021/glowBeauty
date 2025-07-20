import { Collection } from "mongodb";
import { connectToDatabase, COLLECTIONS } from "../mongodb.server";
import {
  Order,
  OrderDocument,
  documentToOrder,
  orderToDocument,
} from "../models";

export class OrderService {
  private async getCollection(): Promise<Collection<OrderDocument>> {
    const db = await connectToDatabase();
    return db.collection<OrderDocument>(COLLECTIONS.ORDERS);
  }

  /**
   * Get all orders
   */
  async getAll(): Promise<Order[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection.find({}).sort({ id: -1 }).toArray(); // Latest first
      return documents.map(documentToOrder);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw new Error("Failed to fetch orders");
    }
  }

  /**
   * Get order by ID
   */
  async getById(id: number): Promise<Order | null> {
    try {
      const collection = await this.getCollection();
      const document = await collection.findOne({ id });
      return document ? documentToOrder(document) : null;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw new Error("Failed to fetch order");
    }
  }

  /**
   * Get orders by customer ID
   */
  async getByCustomerId(customerId: number): Promise<Order[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection
        .find({ customerId })
        .sort({ id: -1 })
        .toArray();
      return documents.map(documentToOrder);
    } catch (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error);
      throw new Error("Failed to fetch orders by customer");
    }
  }

  /**
   * Get orders by status
   */
  async getByStatus(status: Order["status"]): Promise<Order[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection
        .find({ status })
        .sort({ id: -1 })
        .toArray();
      return documents.map(documentToOrder);
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw new Error("Failed to fetch orders by status");
    }
  }

  /**
   * Search orders by customer name or email
   */
  async search(query: string): Promise<Order[]> {
    try {
      const collection = await this.getCollection();
      const searchRegex = new RegExp(query, "i"); // Case-insensitive search
      const documents = await collection
        .find({
          $or: [
            { customerName: { $regex: searchRegex } },
            { customerEmail: { $regex: searchRegex } },
          ],
        })
        .sort({ id: -1 })
        .toArray();
      return documents.map(documentToOrder);
    } catch (error) {
      console.error(`Error searching orders with query "${query}":`, error);
      throw new Error("Failed to search orders");
    }
  }

  /**
   * Create a new order
   */
  async create(orderData: Omit<Order, "id">): Promise<Order> {
    try {
      const collection = await this.getCollection();

      // Get the next available ID
      const lastOrder = await collection.findOne({}, { sort: { id: -1 } });
      const nextId = lastOrder ? lastOrder.id + 1 : 1001; // Start from 1001 for orders

      const newOrder: Order = {
        ...orderData,
        id: nextId,
      };

      const document = {
        ...orderToDocument(newOrder),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(document);

      if (!result.acknowledged) {
        throw new Error("Failed to insert order");
      }

      console.log(`OrderService - Created order with ID ${nextId}`);
      return newOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  }

  /**
   * Update an existing order
   */
  async update(order: Order): Promise<Order> {
    try {
      const collection = await this.getCollection();

      const document = {
        ...orderToDocument(order),
        updatedAt: new Date(),
      };

      const result = await collection.updateOne(
        { id: order.id },
        { $set: document }
      );

      if (result.matchedCount === 0) {
        throw new Error(`Order with ID ${order.id} not found`);
      }

      console.log(`OrderService - Updated order with ID ${order.id}`);
      return order;
    } catch (error) {
      console.error(`Error updating order with ID ${order.id}:`, error);
      throw new Error("Failed to update order");
    }
  }

  /**
   * Update order status
   */
  async updateStatus(
    id: number,
    status: Order["status"],
    trackingNumber?: string
  ): Promise<Order> {
    try {
      const collection = await this.getCollection();

      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      const result = await collection.findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: "after" }
      );

      if (!result) {
        throw new Error(`Order with ID ${id} not found`);
      }

      console.log(`OrderService - Updated order ${id} status to ${status}`);
      return documentToOrder(result);
    } catch (error) {
      console.error(`Error updating order status for ID ${id}:`, error);
      throw new Error("Failed to update order status");
    }
  }

  /**
   * Delete an order by ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne({ id });

      const deleted = result.deletedCount > 0;
      if (deleted) {
        console.log(`OrderService - Deleted order with ID ${id}`);
      } else {
        console.log(
          `OrderService - Order with ID ${id} not found for deletion`
        );
      }

      return deleted;
    } catch (error) {
      console.error(`Error deleting order with ID ${id}:`, error);
      throw new Error("Failed to delete order");
    }
  }

  /**
   * Get order count
   */
  async getCount(): Promise<number> {
    try {
      const collection = await this.getCollection();
      return await collection.countDocuments();
    } catch (error) {
      console.error("Error getting order count:", error);
      throw new Error("Failed to get order count");
    }
  }

  /**
   * Get order count by status
   */
  async getCountByStatus(): Promise<Record<string, number>> {
    try {
      const collection = await this.getCollection();
      const pipeline = [
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ];

      const results = await collection.aggregate(pipeline).toArray();
      const statusCounts: Record<string, number> = {};

      results.forEach((result) => {
        statusCounts[result._id] = result.count;
      });

      return statusCounts;
    } catch (error) {
      console.error("Error getting order count by status:", error);
      throw new Error("Failed to get order count by status");
    }
  }

  /**
   * Get orders with pagination
   */
  async getPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    orders: Order[];
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

      const orders = documents.map(documentToOrder);
      const totalPages = Math.ceil(total / limit);

      return {
        orders,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching paginated orders:", error);
      throw new Error("Failed to fetch paginated orders");
    }
  }

  /**
   * Get total revenue
   */
  async getTotalRevenue(): Promise<number> {
    try {
      const collection = await this.getCollection();
      const pipeline = [
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total" },
          },
        },
      ];

      const results = await collection.aggregate(pipeline).toArray();
      return results.length > 0 ? results[0].totalRevenue : 0;
    } catch (error) {
      console.error("Error calculating total revenue:", error);
      throw new Error("Failed to calculate total revenue");
    }
  }

  /**
   * Get revenue by date range
   */
  async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number> {
    try {
      const collection = await this.getCollection();
      const pipeline = [
        {
          $match: {
            orderDate: {
              $gte: startDate.toISOString(),
              $lte: endDate.toISOString(),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total" },
          },
        },
      ];

      const results = await collection.aggregate(pipeline).toArray();
      return results.length > 0 ? results[0].totalRevenue : 0;
    } catch (error) {
      console.error("Error calculating revenue by date range:", error);
      throw new Error("Failed to calculate revenue by date range");
    }
  }

  /**
   * Check if order exists
   */
  async exists(id: number): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const count = await collection.countDocuments({ id });
      return count > 0;
    } catch (error) {
      console.error(`Error checking if order ${id} exists:`, error);
      throw new Error("Failed to check order existence");
    }
  }
}

// Export singleton instance
export const orderService = new OrderService();

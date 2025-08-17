import { connectToDatabase, COLLECTIONS } from "./mongodb.server";
import {
  productService,
  customerService,
  orderService,
  activityService,
} from "./services.server";

/**
 * Seed the database with initial data
 */
export async function seedDatabase(): Promise<void> {
  try {
    console.log("Starting database seeding...");

    // Connect to database
    const db = await connectToDatabase();

    // Check if data already exists
    const productCount = await productService.getCount();
    const customerCount = await customerService.getCount();
    const orderCount = await orderService.getCount();

    if (productCount > 0 || customerCount > 0 || orderCount > 0) {
      console.log("Database already contains data. Skipping seeding.");
      console.log(
        `Current counts - Products: ${productCount}, Customers: ${customerCount}, Orders: ${orderCount}`
      );
      return;
    }

    console.log("Database is empty. Starting seeding process...");

    // Seed basic products (minimal required data)
    console.log("Seeding basic products...");
    const basicProducts = [
      {
        name: "Sample Product",
        description: "A sample product for demonstration",
        price: 19.99,
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
        category: "general",
      },
    ];

    for (const product of basicProducts) {
      await productService.create(product);
    }
    console.log(`✓ Seeded ${basicProducts.length} basic products`);

    console.log("✅ Database seeding completed successfully!");

    // Log final counts
    const finalProductCount = await productService.getCount();
    const finalCustomerCount = await customerService.getCount();
    const finalOrderCount = await orderService.getCount();

    console.log("Final counts:");
    console.log(`  Products: ${finalProductCount}`);
    console.log(`  Customers: ${finalCustomerCount}`);
    console.log(`  Orders: ${finalOrderCount}`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw new Error(
      `Database seeding failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase(): Promise<void> {
  try {
    console.log("Clearing database...");

    const db = await connectToDatabase();

    // Clear all collections
    await Promise.all([
      db.collection(COLLECTIONS.PRODUCTS).deleteMany({}),
      db.collection(COLLECTIONS.CUSTOMERS).deleteMany({}),
      db.collection(COLLECTIONS.ORDERS).deleteMany({}),
      db.collection(COLLECTIONS.ACTIVITY).deleteMany({}),
    ]);

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw new Error(
      `Database clearing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Reset database (clear and reseed)
 */
export async function resetDatabase(): Promise<void> {
  try {
    console.log("Resetting database...");
    await clearDatabase();
    await seedDatabase();
    console.log("✅ Database reset completed successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
    throw new Error(
      `Database reset failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Check database status
 */
export async function checkDatabaseStatus(): Promise<{
  connected: boolean;
  productCount: number;
  customerCount: number;
  orderCount: number;
  activityCount: number;
}> {
  try {
    await connectToDatabase();

    const [productCount, customerCount, orderCount, activityCount] =
      await Promise.all([
        productService.getCount(),
        customerService.getCount(),
        orderService.getCount(),
        activityService.getCount(),
      ]);

    return {
      connected: true,
      productCount,
      customerCount,
      orderCount,
      activityCount,
    };
  } catch (error) {
    console.error("Error checking database status:", error);
    return {
      connected: false,
      productCount: 0,
      customerCount: 0,
      orderCount: 0,
      activityCount: 0,
    };
  }
}

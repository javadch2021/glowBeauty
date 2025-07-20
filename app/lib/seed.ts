import { connectToDatabase, COLLECTIONS } from "./mongodb.server";
import {
  productService,
  customerService,
  orderService,
  activityService,
} from "./services.server";
import {
  mockProducts,
  mockCustomers,
  mockOrders,
  mockRecentActivity,
} from "./data/seedData";

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

    // Seed products
    console.log("Seeding products...");
    for (const product of mockProducts) {
      await productService.create({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
    console.log(`✓ Seeded ${mockProducts.length} products`);

    // Seed customers
    console.log("Seeding customers...");
    for (const customer of mockCustomers) {
      await customerService.create({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        joinDate: customer.joinDate,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
      });
    }
    console.log(`✓ Seeded ${mockCustomers.length} customers`);

    // Seed orders
    console.log("Seeding orders...");
    for (const order of mockOrders) {
      await orderService.create({
        customerId: order.customerId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderDate: order.orderDate,
        status: order.status,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        total: order.total,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        trackingNumber: order.trackingNumber,
      });
    }
    console.log(`✓ Seeded ${mockOrders.length} orders`);

    // Seed activity
    console.log("Seeding activity...");
    for (const activity of mockRecentActivity) {
      await activityService.create({
        type: activity.type,
        message: activity.message,
        time: activity.time,
      });
    }
    console.log(`✓ Seeded ${mockRecentActivity.length} activity items`);

    console.log("✅ Database seeding completed successfully!");

    // Log final counts
    const finalProductCount = await productService.getCount();
    const finalCustomerCount = await customerService.getCount();
    const finalOrderCount = await orderService.getCount();
    const finalActivityCount = await activityService.getCount();

    console.log("Final counts:");
    console.log(`  Products: ${finalProductCount}`);
    console.log(`  Customers: ${finalCustomerCount}`);
    console.log(`  Orders: ${finalOrderCount}`);
    console.log(`  Activity items: ${finalActivityCount}`);
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

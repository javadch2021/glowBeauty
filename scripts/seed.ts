#!/usr/bin/env tsx

import {
  seedDatabase,
  clearDatabase,
  resetDatabase,
  checkDatabaseStatus,
} from "../app/lib/seed";
import { closeConnection } from "../app/lib/mongodb.server";

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case "seed":
        console.log("🌱 Seeding database...");
        await seedDatabase();
        break;

      case "clear":
        console.log("🧹 Clearing database...");
        await clearDatabase();
        break;

      case "reset":
        console.log("🔄 Resetting database...");
        await resetDatabase();
        break;

      case "status":
        console.log("📊 Checking database status...");
        const status = await checkDatabaseStatus();
        console.log("Database Status:");
        console.log(`  Connected: ${status.connected ? "✅" : "❌"}`);
        console.log(`  Products: ${status.productCount}`);
        console.log(`  Customers: ${status.customerCount}`);
        console.log(`  Orders: ${status.orderCount}`);
        console.log(`  Activity: ${status.activityCount}`);
        break;

      default:
        console.log("Usage: npm run seed [command]");
        console.log("Commands:");
        console.log("  seed   - Seed database with initial data");
        console.log("  clear  - Clear all data from database");
        console.log("  reset  - Clear and reseed database");
        console.log("  status - Check database status");
        process.exit(1);
    }

    console.log("✅ Operation completed successfully!");
  } catch (error) {
    console.error("❌ Operation failed:", error);
    process.exit(1);
  } finally {
    await closeConnection();
    process.exit(0);
  }
}

main();

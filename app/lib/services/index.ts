// Export all services
export { ProductService, productService } from "./ProductService";
export { CustomerService, customerService } from "./CustomerService";
export { OrderService, orderService } from "./OrderService";
export { ActivityService, activityService } from "./ActivityService";

// Export all models and types
export * from "../models";

// Export utility functions from analytics
export {
  calculateProductStats,
  calculateCustomerStats,
  calculateOrderStats,
  generateAnalyticsData,
} from "../utils/analytics";

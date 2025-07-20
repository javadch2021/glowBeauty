import { Product, Customer, Order, AnalyticsData } from "~/lib/models";

// Helper functions to calculate statistics
export const calculateProductStats = (products: Product[]) => {
  const totalProducts = products.length;
  const averagePrice = totalProducts > 0 
    ? products.reduce((sum, product) => sum + product.price, 0) / totalProducts 
    : 0;
  const categories = new Set(products.map(product => product.category)).size;

  return {
    totalProducts,
    averagePrice: Math.round(averagePrice * 100) / 100,
    categories,
  };
};

export const calculateCustomerStats = (customers: Customer[]) => {
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const averageOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return {
    totalCustomers,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
  };
};

export const calculateOrderStats = (orders: Order[]) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate status distribution
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalOrders,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    statusCounts,
  };
};

export const generateAnalyticsData = (
  orders: Order[],
  products: Product[]
): AnalyticsData => {
  // Sales by month (last 6 months)
  const salesByMonth = [
    { month: "January 2024", sales: 45000, orders: 120 },
    { month: "February 2024", sales: 52000, orders: 135 },
    { month: "March 2024", sales: 48000, orders: 128 },
    { month: "April 2024", sales: 61000, orders: 142 },
    { month: "May 2024", sales: 55000, orders: 138 },
    { month: "June 2024", sales: 58000, orders: 145 },
  ];

  // Top products (mock data for now)
  const topProducts = [
    { name: "Hydrating Facial Serum", sales: 15000, quantity: 500 },
    { name: "Glow Highlighter", sales: 12000, quantity: 480 },
    { name: "Revitalizing Eye Cream", sales: 10500, quantity: 300 },
    { name: "Lip Gloss Trio", sales: 8000, quantity: 400 },
    { name: "Clarifying Face Wash", sales: 7500, quantity: 395 },
  ];

  // Orders by status
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalOrders = orders.length;
  const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0,
  }));

  // Revenue growth (mock data)
  const revenueGrowth = [
    { period: "Q1 2024", revenue: 145000, growth: 12 },
    { period: "Q2 2024", revenue: 174000, growth: 20 },
    { period: "Q3 2024", revenue: 161000, growth: -7 },
    { period: "Q4 2024", revenue: 189000, growth: 17 },
  ];

  return {
    salesByMonth,
    topProducts,
    ordersByStatus,
    revenueGrowth,
  };
};

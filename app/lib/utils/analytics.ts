import { Product, Customer, Order, AnalyticsData } from "~/lib/models";

// Helper functions to calculate statistics
export const calculateProductStats = (products: Product[]) => {
  const totalProducts = products.length;
  const averagePrice =
    totalProducts > 0
      ? products.reduce((sum, product) => sum + product.price, 0) /
        totalProducts
      : 0;
  const categories = new Set(products.map((product) => product.category)).size;

  return {
    totalProducts,
    averagePrice: Math.round(averagePrice * 100) / 100,
    categories,
  };
};

export const calculateCustomerStats = (customers: Customer[]) => {
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );
  const averageOrderValue =
    totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

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
  // Generate sales by month based on actual order data (last 6 months)
  const salesByMonth = generateSalesByMonth(orders);

  // Generate top products based on actual order data
  const topProducts = generateTopProducts(orders, products);

  // Orders by status based on actual data
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalOrders = orders.length;
  const ordersByStatus = Object.entries(statusCounts).map(
    ([status, count]) => ({
      status,
      count,
      percentage: totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0,
    })
  );

  // Generate revenue growth based on actual data
  const revenueGrowth = generateRevenueGrowth(orders);

  return {
    salesByMonth,
    topProducts,
    ordersByStatus,
    revenueGrowth,
  };
};

// Helper function to generate sales by month from actual order data
function generateSalesByMonth(orders: Order[]) {
  const months = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthName = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // Filter orders for this month
    const monthOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      );
    });

    const sales = monthOrders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = monthOrders.length;

    months.push({
      month: monthName,
      sales: Math.round(sales * 100) / 100,
      orders: orderCount,
    });
  }

  return months;
}

// Helper function to generate top products from actual order data
function generateTopProducts(orders: Order[], products: Product[]) {
  // Create a map to track product sales
  const productSales = new Map<
    number,
    { name: string; sales: number; quantity: number }
  >();

  // Initialize all products with zero sales
  products.forEach((product) => {
    productSales.set(product.id, {
      name: product.name,
      sales: 0,
      quantity: 0,
    });
  });

  // Calculate actual sales from orders
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = productSales.get(item.productId);
      if (existing) {
        existing.sales += item.total;
        existing.quantity += item.quantity;
      }
    });
  });

  // Convert to array and sort by sales
  const topProducts = Array.from(productSales.values())
    .filter((product) => product.sales > 0) // Only show products with sales
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5) // Top 5 products
    .map((product) => ({
      ...product,
      sales: Math.round(product.sales * 100) / 100,
    }));

  return topProducts;
}

// Helper function to generate revenue growth from actual data
function generateRevenueGrowth(orders: Order[]) {
  const quarters = [];
  const currentDate = new Date();

  for (let i = 3; i >= 0; i--) {
    const year = currentDate.getFullYear();
    const quarter = Math.floor(currentDate.getMonth() / 3) + 1 - i;

    if (quarter <= 0) {
      // Handle previous year
      const prevYear = year - 1;
      const prevQuarter = quarter + 4;
      const quarterName = `Q${prevQuarter} ${prevYear}`;

      // Filter orders for this quarter
      const quarterOrders = orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        const orderQuarter = Math.floor(orderDate.getMonth() / 3) + 1;
        return (
          orderDate.getFullYear() === prevYear && orderQuarter === prevQuarter
        );
      });

      const revenue = quarterOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );

      quarters.push({
        period: quarterName,
        revenue: Math.round(revenue * 100) / 100,
        growth: 0, // Can't calculate growth for historical data without more context
      });
    } else {
      const quarterName = `Q${quarter} ${year}`;

      // Filter orders for this quarter
      const quarterOrders = orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        const orderQuarter = Math.floor(orderDate.getMonth() / 3) + 1;
        return orderDate.getFullYear() === year && orderQuarter === quarter;
      });

      const revenue = quarterOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );

      // Calculate growth if we have previous quarter data
      let growth = 0;
      if (quarters.length > 0) {
        const prevRevenue = quarters[quarters.length - 1].revenue;
        growth =
          prevRevenue > 0
            ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100)
            : 0;
      }

      quarters.push({
        period: quarterName,
        revenue: Math.round(revenue * 100) / 100,
        growth,
      });
    }
  }

  return quarters;
}

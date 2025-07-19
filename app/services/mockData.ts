import {
  Product,
  Customer,
  Order,
  OrderItem,
} from "~/components/forms/Landing";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Hydrating Facial Serum",
    description:
      "Deep moisturizing formula with hyaluronic acid for all skin types",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
    category: "skincare",
  },
  {
    id: 2,
    name: "Glow Highlighter",
    description:
      "Iridescent shimmer highlighter for radiant skin with buildable coverage",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
    category: "makeup",
  },
  {
    id: 3,
    name: "Revitalizing Eye Cream",
    description:
      "Reduces puffiness and dark circles with caffeine extract and peptides",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop",
    category: "skincare",
  },
  {
    id: 4,
    name: "Lip Gloss Trio",
    description:
      "Three shades of high-shine lip gloss for every mood and occasion",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop",
    category: "makeup",
  },
  {
    id: 5,
    name: "Clarifying Face Wash",
    description:
      "Gentle cleanser for acne-prone skin with salicylic acid and tea tree oil",
    price: 18.99,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop",
    category: "skincare",
  },
  {
    id: 6,
    name: "Nail Polish Set",
    description: "Six vibrant long-lasting nail polish shades in trendy colors",
    price: 22.99,
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=300&fit=crop",
    category: "nails",
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA 12345",
    joinDate: "2023-01-15",
    totalOrders: 12,
    totalSpent: 1247.89,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Somewhere, USA 67890",
    joinDate: "2023-02-20",
    totalOrders: 8,
    totalSpent: 892.45,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine Rd, Elsewhere, USA 54321",
    joinDate: "2023-03-10",
    totalOrders: 15,
    totalSpent: 2156.78,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 321-0987",
    address: "321 Elm St, Nowhere, USA 98765",
    joinDate: "2023-04-05",
    totalOrders: 6,
    totalSpent: 567.23,
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+1 (555) 654-3210",
    address: "654 Maple Dr, Anywhere, USA 13579",
    joinDate: "2023-05-12",
    totalOrders: 9,
    totalSpent: 1034.56,
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 789-0123",
    address: "987 Cedar Ln, Someplace, USA 24680",
    joinDate: "2023-06-18",
    totalOrders: 4,
    totalSpent: 345.67,
  },
  {
    id: 7,
    name: "Chris Anderson",
    email: "chris.anderson@example.com",
    phone: "+1 (555) 012-3456",
    address: "012 Birch Ct, Everytown, USA 86420",
    joinDate: "2023-07-22",
    totalOrders: 11,
    totalSpent: 1456.89,
  },
  {
    id: 8,
    name: "Lisa Martinez",
    email: "lisa.martinez@example.com",
    phone: "+1 (555) 345-6789",
    address: "345 Spruce Way, Hometown, USA 97531",
    joinDate: "2023-08-30",
    totalOrders: 7,
    totalSpent: 723.45,
  },
  {
    id: 9,
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    phone: "+1 (555) 678-9012",
    address: "678 Willow St, Newtown, USA 11223",
    joinDate: "2023-09-14",
    totalOrders: 5,
    totalSpent: 456.78,
  },
  {
    id: 10,
    name: "Amanda White",
    email: "amanda.white@example.com",
    phone: "+1 (555) 901-2345",
    address: "901 Ash Ave, Oldtown, USA 44556",
    joinDate: "2023-10-08",
    totalOrders: 13,
    totalSpent: 1789.23,
  },
];

export interface ActivityItem {
  id: number;
  type: "order" | "customer" | "product";
  message: string;
  time: string;
}

export const mockRecentActivity: ActivityItem[] = [
  {
    id: 1,
    type: "order",
    message: "New order #1234 from John Doe",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "customer",
    message: "New customer registration: Jane Smith",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "product",
    message: "Product 'Wireless Headphones' updated",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "order",
    message: "Order #1233 marked as delivered",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "customer",
    message: "Customer Mike Johnson updated profile",
    time: "3 hours ago",
  },
  {
    id: 6,
    type: "product",
    message: "New product 'Coffee Maker' added",
    time: "4 hours ago",
  },
  {
    id: 7,
    type: "order",
    message: "Order #1232 payment confirmed",
    time: "5 hours ago",
  },
  {
    id: 8,
    type: "customer",
    message: "Customer Sarah Wilson placed large order",
    time: "6 hours ago",
  },
];

// Helper functions to calculate statistics
export const calculateProductStats = (products: Product[]) => {
  const totalProducts = products.length;
  const averagePrice =
    products.reduce((sum, product) => sum + product.price, 0) / totalProducts;
  const categories = new Set(products.map((p) => p.category)).size;

  return {
    totalProducts,
    averagePrice,
    categories,
  };
};

export const calculateCustomerStats = (customers: Customer[]) => {
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );
  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.totalOrders,
    0
  );
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const averageCustomerValue =
    totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return {
    totalCustomers,
    totalRevenue,
    totalOrders,
    averageOrderValue,
    averageCustomerValue,
  };
};

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: 1001,
    customerId: 1,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    orderDate: "2024-01-15T10:30:00Z",
    status: "delivered",
    items: [
      {
        id: 1,
        productId: 1,
        productName: "Hydrating Facial Serum",
        productImage:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
        quantity: 2,
        price: 29.99,
        total: 59.98,
      },
      {
        id: 2,
        productId: 3,
        productName: "Revitalizing Eye Cream",
        productImage:
          "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop",
        quantity: 1,
        price: 34.99,
        total: 34.99,
      },
    ],
    subtotal: 94.97,
    tax: 7.6,
    shipping: 9.99,
    total: 112.56,
    shippingAddress: "123 Main St, Anytown, USA 12345",
    paymentMethod: "Credit Card",
    trackingNumber: "TRK123456789",
  },
  {
    id: 1002,
    customerId: 2,
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    orderDate: "2024-01-14T14:20:00Z",
    status: "shipped",
    items: [
      {
        id: 3,
        productId: 2,
        productName: "Glow Highlighter",
        productImage:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
        quantity: 1,
        price: 24.99,
        total: 24.99,
      },
      {
        id: 4,
        productId: 4,
        productName: "Lip Gloss Trio",
        productImage: "https://placehold.co/300x300?text=Lip+Gloss",
        quantity: 2,
        price: 19.99,
        total: 39.98,
      },
    ],
    subtotal: 64.97,
    tax: 5.2,
    shipping: 7.99,
    total: 78.16,
    shippingAddress: "456 Oak Ave, Somewhere, USA 67890",
    paymentMethod: "PayPal",
    trackingNumber: "TRK987654321",
  },
  {
    id: 1003,
    customerId: 3,
    customerName: "Mike Johnson",
    customerEmail: "mike.johnson@example.com",
    orderDate: "2024-01-13T09:15:00Z",
    status: "processing",
    items: [
      {
        id: 5,
        productId: 5,
        productName: "Clarifying Face Wash",
        productImage: "https://placehold.co/300x300?text=Face+Wash",
        quantity: 2,
        price: 18.99,
        total: 37.98,
      },
      {
        id: 6,
        productId: 6,
        productName: "Nail Polish Set",
        productImage: "https://placehold.co/300x300?text=Nail+Polish",
        quantity: 1,
        price: 22.99,
        total: 22.99,
      },
    ],
    subtotal: 60.97,
    tax: 4.88,
    shipping: 5.99,
    total: 71.84,
    shippingAddress: "789 Pine Rd, Elsewhere, USA 54321",
    paymentMethod: "Credit Card",
  },
  {
    id: 1004,
    customerId: 4,
    customerName: "Sarah Wilson",
    customerEmail: "sarah.wilson@example.com",
    orderDate: "2024-01-12T16:45:00Z",
    status: "pending",
    items: [
      {
        id: 7,
        productId: 3,
        productName: "Revitalizing Eye Cream",
        productImage: "https://placehold.co/300x300?text=Eye+Cream",
        quantity: 1,
        price: 34.99,
        total: 34.99,
      },
    ],
    subtotal: 34.99,
    tax: 2.8,
    shipping: 5.99,
    total: 43.78,
    shippingAddress: "321 Elm St, Nowhere, USA 98765",
    paymentMethod: "Credit Card",
  },
  {
    id: 1005,
    customerId: 5,
    customerName: "David Brown",
    customerEmail: "david.brown@example.com",
    orderDate: "2024-01-11T11:30:00Z",
    status: "delivered",
    items: [
      {
        id: 8,
        productId: 1,
        productName: "Hydrating Facial Serum",
        productImage: "https://placehold.co/300x300?text=Serum",
        quantity: 1,
        price: 29.99,
        total: 29.99,
      },
      {
        id: 9,
        productId: 2,
        productName: "Glow Highlighter",
        productImage: "https://placehold.co/300x300?text=Highlighter",
        quantity: 1,
        price: 24.99,
        total: 24.99,
      },
    ],
    subtotal: 54.98,
    tax: 4.4,
    shipping: 7.99,
    total: 67.37,
    shippingAddress: "654 Maple Dr, Anywhere, USA 13579",
    paymentMethod: "Debit Card",
    trackingNumber: "TRK456789123",
  },
];

// Helper functions for order statistics
export const calculateOrderStats = (orders: Order[]) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentOrders = orders
    .sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    )
    .slice(0, 10);

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    statusCounts,
    recentOrders,
  };
};

// Analytics data for charts
export interface AnalyticsData {
  salesByMonth: { month: string; sales: number; orders: number }[];
  topProducts: { name: string; sales: number; quantity: number }[];
  ordersByStatus: { status: string; count: number; percentage: number }[];
  revenueGrowth: { period: string; revenue: number; growth: number }[];
}

export const generateAnalyticsData = (
  orders: Order[],
  products: Product[]
): AnalyticsData => {
  // Sales by month (last 6 months)
  const salesByMonth = [
    { month: "Aug 2023", sales: 8450, orders: 42 },
    { month: "Sep 2023", sales: 9200, orders: 48 },
    { month: "Oct 2023", sales: 7800, orders: 38 },
    { month: "Nov 2023", sales: 11200, orders: 56 },
    { month: "Dec 2023", sales: 13500, orders: 67 },
    { month: "Jan 2024", sales: 10800, orders: 52 },
  ];

  // Top products by sales
  const productSales = orders
    .flatMap((order) => order.items)
    .reduce((acc, item) => {
      const existing = acc.find((p) => p.name === item.productName);
      if (existing) {
        existing.sales += item.total;
        existing.quantity += item.quantity;
      } else {
        acc.push({
          name: item.productName,
          sales: item.total,
          quantity: item.quantity,
        });
      }
      return acc;
    }, [] as { name: string; sales: number; quantity: number }[]);

  const topProducts = productSales
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Orders by status
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalOrdersCount = orders.length;
  const ordersByStatus = Object.entries(statusCounts).map(
    ([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: Math.round((count / totalOrdersCount) * 100),
    })
  );

  // Revenue growth
  const revenueGrowth = [
    { period: "Q3 2023", revenue: 25450, growth: 8.5 },
    { period: "Q4 2023", revenue: 32200, growth: 26.5 },
    { period: "Q1 2024", revenue: 28800, growth: -10.6 },
  ];

  return {
    salesByMonth,
    topProducts,
    ordersByStatus,
    revenueGrowth,
  };
};

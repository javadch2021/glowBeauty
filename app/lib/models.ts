import { ObjectId } from "mongodb";

// Base interface for MongoDB documents
export interface BaseDocument {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Product interfaces
export interface ProductDocument extends BaseDocument {
  id: number; // Keep the original numeric ID for compatibility
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Customer interfaces
export interface CustomerDocument extends BaseDocument {
  id: number; // Keep the original numeric ID for compatibility
  name: string;
  email: string;
  password: string; // Hashed password
  phone?: string;
  address?: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  refreshToken?: string;
  cartItems?: CartItemDocument[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
}

// Authentication interfaces
export interface AuthCustomer {
  id: number;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Cart interfaces for authenticated users
export interface CartItemDocument {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  addedAt: Date;
}

export interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  addedAt: Date;
}

// Order item interfaces
export interface OrderItemDocument {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

// Order interfaces
export interface OrderDocument extends BaseDocument {
  id: number; // Keep the original numeric ID for compatibility
  customerId: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItemDocument[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

// Activity interfaces
export interface ActivityDocument extends BaseDocument {
  id: number;
  type: "order" | "customer" | "product";
  message: string;
  time: string;
}

export interface ActivityItem {
  id: number;
  type: "order" | "customer" | "product";
  message: string;
  time: string;
}

// Analytics interfaces
export interface AnalyticsData {
  salesByMonth: { month: string; sales: number; orders: number }[];
  topProducts: { name: string; sales: number; quantity: number }[];
  ordersByStatus: { status: string; count: number; percentage: number }[];
  revenueGrowth: { period: string; revenue: number; growth: number }[];
}

// Helper functions to convert between Document and regular interfaces
export function documentToProduct(doc: ProductDocument): Product {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    image: doc.image,
    category: doc.category,
  };
}

export function productToDocument(
  product: Product
): Omit<ProductDocument, "_id" | "createdAt" | "updatedAt"> {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
  };
}

export function documentToCustomer(doc: CustomerDocument): Customer {
  return {
    id: doc.id,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    address: doc.address,
    joinDate: doc.joinDate,
    totalOrders: doc.totalOrders,
    totalSpent: doc.totalSpent,
    isEmailVerified: doc.isEmailVerified,
    lastLoginAt: doc.lastLoginAt,
  };
}

export function customerToDocument(
  customer: Customer
): Omit<
  CustomerDocument,
  "_id" | "createdAt" | "updatedAt" | "password" | "refreshToken" | "cartItems"
> {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    joinDate: customer.joinDate,
    totalOrders: customer.totalOrders,
    totalSpent: customer.totalSpent,
    isEmailVerified: customer.isEmailVerified,
    lastLoginAt: customer.lastLoginAt,
  };
}

export function documentToAuthCustomer(doc: CustomerDocument): AuthCustomer {
  return {
    id: doc.id,
    name: doc.name,
    email: doc.email,
    isEmailVerified: doc.isEmailVerified,
  };
}

export function documentToOrder(doc: OrderDocument): Order {
  return {
    id: doc.id,
    customerId: doc.customerId,
    customerName: doc.customerName,
    customerEmail: doc.customerEmail,
    orderDate: doc.orderDate,
    status: doc.status,
    items: doc.items,
    subtotal: doc.subtotal,
    tax: doc.tax,
    shipping: doc.shipping,
    total: doc.total,
    shippingAddress: doc.shippingAddress,
    paymentMethod: doc.paymentMethod,
    trackingNumber: doc.trackingNumber,
  };
}

export function orderToDocument(
  order: Order
): Omit<OrderDocument, "_id" | "createdAt" | "updatedAt"> {
  return {
    id: order.id,
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
  };
}

export function documentToActivity(doc: ActivityDocument): ActivityItem {
  return {
    id: doc.id,
    type: doc.type,
    message: doc.message,
    time: doc.time,
  };
}

export function activityToDocument(
  activity: ActivityItem
): Omit<ActivityDocument, "_id" | "createdAt" | "updatedAt"> {
  return {
    id: activity.id,
    type: activity.type,
    message: activity.message,
    time: activity.time,
  };
}

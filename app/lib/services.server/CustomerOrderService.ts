import { Order, OrderItem, Customer } from "~/lib/models";
import { orderService } from "./OrderService";
import { cartService } from "./CartService";
import { customerService } from "./CustomerService";

export class CustomerOrderService {
  /**
   * Create order from cart items
   */
  async createOrderFromCart(customerId: number): Promise<Order> {
    try {
      // Get customer details
      const customer = await customerService.getById(customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }

      // Get cart items
      const cartItems = await cartService.getCart(customerId);
      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Convert cart items to order items
      const orderItems: OrderItem[] = cartItems.map((item, index) => ({
        id: index + 1,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }));

      // Calculate totals
      const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
      const total = subtotal + tax + shipping;

      // Create order data
      const orderData: Omit<Order, "id"> = {
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        orderDate: new Date().toISOString(),
        status: "pending",
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: customer.address || "No address provided",
        paymentMethod: "Credit Card", // Default for testing
      };

      // Create the order
      const newOrder = await orderService.create(orderData);

      // Clear the cart after successful order creation
      await cartService.clearCart(customerId);

      // Update customer statistics
      await customerService.updateStats(customerId, {
        totalOrders: customer.totalOrders + 1,
        totalSpent: customer.totalSpent + total,
      });

      return newOrder;
    } catch (error) {
      console.error("Error creating order from cart:", error);
      throw error;
    }
  }

  /**
   * Get customer orders
   */
  async getCustomerOrders(customerId: number): Promise<Order[]> {
    try {
      return await orderService.getByCustomerId(customerId);
    } catch (error) {
      console.error("Error getting customer orders:", error);
      throw error;
    }
  }

  /**
   * Get single order by ID (with customer verification)
   */
  async getCustomerOrder(customerId: number, orderId: number): Promise<Order | null> {
    try {
      const order = await orderService.getById(orderId);
      
      // Verify the order belongs to the customer
      if (order && order.customerId === customerId) {
        return order;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting customer order:", error);
      throw error;
    }
  }
}

export const customerOrderService = new CustomerOrderService();

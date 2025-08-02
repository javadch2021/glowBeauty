import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { customerOrderService } from "~/lib/services.server/CustomerOrderService";
import { getAuthenticatedCustomer } from "~/lib/auth.middleware";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Get customer from session
    const { customer } = await getAuthenticatedCustomer(request);
    if (!customer) {
      return json({ error: "Authentication required" }, { status: 401 });
    }

    console.log("Customer Orders API - Customer:", customer.id, customer.name);

    // Get customer orders
    const orders = await customerOrderService.getCustomerOrders(customer.id);

    console.log("Customer Orders API - Found orders:", orders.length);

    return json({
      success: true,
      orders: orders.map((order) => ({
        id: order.id,
        orderDate: order.orderDate,
        status: order.status,
        total: order.total,
        items: order.items,
        trackingNumber: order.trackingNumber,
      })),
    });
  } catch (error) {
    console.error("Customer Orders API - Error:", error);

    return json(
      {
        error: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}

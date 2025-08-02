import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { customerOrderService } from "~/lib/services.server/CustomerOrderService";
import { getAuthenticatedCustomer } from "~/lib/auth.middleware";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get customer from session
    const { customer } = await getAuthenticatedCustomer(request);
    if (!customer) {
      return json({ error: "Authentication required" }, { status: 401 });
    }

    console.log("Checkout API - Customer:", customer.id, customer.name);

    // Create order from cart
    const order = await customerOrderService.createOrderFromCart(customer.id);

    console.log("Checkout API - Order created:", order.id);

    return json({
      success: true,
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        orderDate: order.orderDate,
        items: order.items,
      },
    });
  } catch (error) {
    console.error("Checkout API - Error:", error);

    if (error instanceof Error) {
      return json(
        {
          error: error.message,
        },
        { status: 400 }
      );
    }

    return json(
      {
        error: "Failed to process checkout",
      },
      { status: 500 }
    );
  }
}

export async function loader() {
  return json({ error: "Method not allowed" }, { status: 405 });
}

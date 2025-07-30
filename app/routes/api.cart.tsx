import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { cartService } from "~/lib/services.server";
import { getAuthenticatedCustomer } from "~/lib/auth.middleware";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("API Cart Loader - Called with URL:", request.url);
  try {
    const { customer } = await getAuthenticatedCustomer(request);

    console.log(
      "API Cart Loader - Customer:",
      customer ? `ID: ${customer.id}` : "Not authenticated"
    );

    if (!customer) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await cartService.getCart(customer.id);
    const cartCount = await cartService.getCartCount(customer.id);

    console.log("API Cart Loader - Cart data:", {
      cartLength: cart.length,
      cartCount,
    });

    return Response.json({ cart, cartCount });
  } catch (error) {
    console.error("API Cart Loader - Error loading cart:", error);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("🚀 API Cart Action - ENTRY POINT - Method:", request.method);
  console.log("🚀 API Cart Action - URL:", request.url);
  console.log(
    "🚀 API Cart Action - Headers:",
    Object.fromEntries(request.headers.entries())
  );
  try {
    const { customer } = await getAuthenticatedCustomer(request);

    console.log(
      "API Cart - Customer:",
      customer ? `ID: ${customer.id}` : "Not authenticated"
    );

    if (!customer) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const action = formData.get("action") as string;

    console.log("API Cart - Action:", action);
    console.log("API Cart - FormData entries:", Array.from(formData.entries()));

    try {
      switch (action) {
        case "add": {
          const productId = parseInt(formData.get("productId") as string);
          const productName = formData.get("productName") as string;
          const productImage = formData.get("productImage") as string;
          const price = parseFloat(formData.get("price") as string);
          const quantity = parseInt(formData.get("quantity") as string) || 1;

          console.log("API Cart - Add case - Parsed data:", {
            customerId: customer.id,
            productId,
            productName,
            productImage,
            price,
            quantity,
          });

          const cartItem = await cartService.addToCart(
            customer.id,
            productId,
            productName,
            productImage,
            price,
            quantity
          );

          console.log("API Cart - Add case - CartService result:", cartItem);

          return Response.json({ success: true, cartItem });
        }

        case "update": {
          const productId = parseInt(formData.get("productId") as string);
          const quantity = parseInt(formData.get("quantity") as string);

          const success = await cartService.updateQuantity(
            customer.id,
            productId,
            quantity
          );

          return Response.json({ success });
        }

        case "remove": {
          const productId = parseInt(formData.get("productId") as string);
          const success = await cartService.removeFromCart(
            customer.id,
            productId
          );
          return Response.json({ success });
        }

        case "clear": {
          const success = await cartService.clearCart(customer.id);
          return Response.json({ success });
        }

        default:
          return Response.json({ error: "Invalid action" }, { status: 400 });
      }
    } catch (error) {
      console.error("Cart action error:", error);
      return Response.json(
        { error: "Failed to perform cart action" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

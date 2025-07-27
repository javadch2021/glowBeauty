import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { customerAuthService } from "~/lib/services.server/CustomerAuthService";
import { clearAuthCookies } from "~/lib/cookies.server";
import { getAuthenticatedCustomer } from "~/lib/auth.middleware";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { customer } = await getAuthenticatedCustomer(request);

    if (customer) {
      // Logout customer (clear refresh token from database)
      await customerAuthService.logout(customer.id);
    }

    // Clear authentication cookies
    const headers = await clearAuthCookies();

    return redirect("/", { headers });
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, clear cookies and redirect
    const headers = await clearAuthCookies();
    return redirect("/", { headers });
  }
}

// This route doesn't render anything - it's API only
export default function LogoutRoute() {
  return null;
}

import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { customerAuthService } from "~/lib/services.server/CustomerAuthService";
import { createAuthCookies } from "~/lib/cookies.server";
import { redirectIfAuthenticated } from "~/lib/auth.middleware";

export async function loader({ request }: { request: Request }) {
  // Redirect if already authenticated
  await redirectIfAuthenticated(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Redirect if already authenticated
    await redirectIfAuthenticated(request);

    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = formData.get("redirectTo") as string;

    // Validate required fields
    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Login customer
    const result = await customerAuthService.login({
      email,
      password,
    });

    if (result.success && result.accessToken && result.refreshToken) {
      // Create authentication cookies
      const headers = await createAuthCookies(
        result.accessToken,
        result.refreshToken
      );

      // Determine redirect destination
      const destination = redirectTo && redirectTo !== "/" ? redirectTo : "/";

      return redirect(destination, { headers });
    } else {
      return Response.json(
        { success: false, message: result.message },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { success: false, message: "An error occurred during login" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// This route doesn't render anything - it's API only
export default function LoginRoute() {
  return null;
}

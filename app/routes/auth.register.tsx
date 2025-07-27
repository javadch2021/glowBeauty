import { type ActionFunctionArgs } from "@remix-run/node";
import { customerAuthService } from "~/lib/services.server/CustomerAuthService";
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
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate required fields
    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Register customer
    const result = await customerAuthService.register({
      name,
      email,
      password,
    });

    if (result.success) {
      return Response.json(
        {
          success: true,
          message: result.message,
          customer: result.customer,
        },
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      // Determine appropriate status code based on error message
      let statusCode = 400; // Default to bad request

      if (result.message.includes("email already exists")) {
        statusCode = 409; // Conflict
      } else if (result.message.includes("Password must")) {
        statusCode = 400; // Bad request for validation errors
      } else if (result.message.includes("valid email")) {
        statusCode = 400; // Bad request for invalid email
      }

      return Response.json(
        { success: false, message: result.message },
        {
          status: statusCode,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { success: false, message: "An error occurred during registration" },
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
export default function RegisterRoute() {
  return null;
}

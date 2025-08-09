import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAuthenticatedCustomer } from "~/lib/auth.middleware";
import { customerService } from "~/lib/services.server";
import type { Customer } from "~/lib/models";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Check if customer is authenticated
    const { customer } = await getAuthenticatedCustomer(request);

    if (!customer) {
      return json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    if (request.method !== "PUT") {
      return json(
        { success: false, error: "Method not allowed" },
        { status: 405 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    // Validation
    if (!name || !email) {
      return json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email is being changed and if it conflicts with another customer
    if (email !== customer.email) {
      const emailExists = await customerService.emailExists(email, customer.id);
      if (emailExists) {
        return json(
          { success: false, error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Update customer data
    const updatedCustomer = {
      ...customer,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      address: address?.trim() || "",
    } as Customer;

    await customerService.update(updatedCustomer);

    return json({
      success: true,
      customer: updatedCustomer,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
};

import React, { createContext, useContext, ReactNode } from "react";
import { AuthCustomer } from "~/lib/models";

interface CustomerAuthContextType {
  customer: AuthCustomer | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(
  undefined
);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error(
      "useCustomerAuth must be used within a CustomerAuthProvider"
    );
  }
  return context;
};

interface CustomerAuthProviderProps {
  children: ReactNode;
  customer: AuthCustomer | null;
}

export const CustomerAuthProvider: React.FC<CustomerAuthProviderProps> = ({
  children,
  customer,
}) => {
  console.log("CustomerAuthProvider - Customer data:", customer);
  const isAuthenticated = customer !== null;
  console.log("CustomerAuthProvider - isAuthenticated:", isAuthenticated);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch("/auth/login", {
        method: "POST",
        body: formData,
        redirect: "manual", // Don't follow redirects automatically
      });

      console.log("Login response status:", response.status);
      console.log("Login response ok:", response.ok);
      console.log("Login response type:", response.type);
      console.log("Login response redirected:", response.redirected);

      // Handle successful login - check for redirect response
      if (response.type === "opaqueredirect" || response.status === 302) {
        // Login successful, redirect manually
        console.log("Login successful - opaque redirect detected");
        // Use a small delay to ensure the success message is shown
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
        return { success: true, message: "Login successful! Redirecting..." };
      }

      // Handle other success responses
      if (response.status === 200 || response.ok) {
        return { success: true, message: "Login successful" };
      }

      // Handle error responses
      if (response.status === 401) {
        // Unauthorized - invalid credentials
        return {
          success: false,
          message:
            "Invalid email or password. Please check your credentials and try again.",
        };
      } else if (response.status === 400) {
        // Bad request - missing fields
        return {
          success: false,
          message: "Please enter both email and password.",
        };
      } else if (response.status === 429) {
        // Too many requests
        return {
          success: false,
          message:
            "Too many login attempts. Please wait a moment and try again.",
        };
      } else {
        // Other errors
        return {
          success: false,
          message:
            "Login failed. Please check your internet connection and try again.",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch("/auth/register", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        // Registration successful (201 Created)
        return {
          success: true,
          message: "Account created successfully! Please log in to continue.",
        };
      } else if (response.status === 400) {
        // Bad request - try to get specific error details
        try {
          const text = await response.text();
          // Try to extract error message from HTML response
          const errorMatch = text.match(/"message":"([^"]+)"/);
          if (errorMatch) {
            const errorMessage = errorMatch[1].replace(/\\"/g, '"');
            return {
              success: false,
              message: errorMessage,
            };
          }
        } catch (e) {
          // If we can't parse the error, provide helpful guidance
        }

        // Provide helpful guidance for common validation errors
        return {
          success: false,
          message:
            "Password must be at least 8 characters with uppercase, lowercase, number, and special character (!@#$%^&*)",
        };
      } else if (response.status === 409) {
        // Conflict - email already exists
        return {
          success: false,
          message:
            "An account with this email already exists. Please try logging in instead.",
        };
      } else {
        // Other error
        return {
          success: false,
          message:
            "Registration failed. Please check your internet connection and try again.",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const formData = new FormData();

      const response = await fetch("/auth/logout", {
        method: "POST",
        body: formData,
      });

      // Redirect will happen automatically from the server
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        // Fallback: reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: reload the page
      window.location.reload();
    }
  };

  const value = {
    customer,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

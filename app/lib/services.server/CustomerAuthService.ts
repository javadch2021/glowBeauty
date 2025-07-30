import { Collection } from "mongodb";
import { connectToDatabase, COLLECTIONS } from "../mongodb.server";
import {
  CustomerDocument,
  AuthCustomer,
  LoginCredentials,
  RegisterData,
  documentToAuthCustomer,
} from "../models";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  validatePassword,
  validateEmail,
  sanitizeInput,
} from "../auth.server";

export class CustomerAuthService {
  private async getCollection(): Promise<Collection<CustomerDocument>> {
    const db = await connectToDatabase();
    return db.collection<CustomerDocument>(COLLECTIONS.CUSTOMERS);
  }

  /**
   * Register a new customer
   */
  async register(
    data: RegisterData
  ): Promise<{ success: boolean; message: string; customer?: AuthCustomer }> {
    try {
      const collection = await this.getCollection();

      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email.toLowerCase()),
        password: data.password,
      };

      // Validate inputs
      if (!sanitizedData.name || sanitizedData.name.length < 2) {
        return {
          success: false,
          message: "Name must be at least 2 characters long",
        };
      }

      if (!validateEmail(sanitizedData.email)) {
        return {
          success: false,
          message: "Please enter a valid email address",
        };
      }

      const passwordValidation = validatePassword(sanitizedData.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: passwordValidation.errors.join(", "),
        };
      }

      // Check if email already exists
      const existingCustomer = await collection.findOne({
        email: sanitizedData.email,
      });

      if (existingCustomer) {
        return {
          success: false,
          message: "An account with this email already exists",
        };
      }

      // Hash password
      const hashedPassword = await hashPassword(sanitizedData.password);

      // Get next ID
      const lastCustomer = await collection.findOne({}, { sort: { id: -1 } });
      const nextId = lastCustomer ? lastCustomer.id + 1 : 1;

      // Create customer document
      const customerDoc: Omit<CustomerDocument, "_id"> = {
        id: nextId,
        name: sanitizedData.name,
        email: sanitizedData.email,
        password: hashedPassword,
        joinDate: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
        isEmailVerified: false,
        cartItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert customer
      const result = await collection.insertOne(customerDoc);

      if (result.insertedId) {
        const customer = documentToAuthCustomer(
          customerDoc as CustomerDocument
        );
        return {
          success: true,
          message: "Account created successfully! Please log in to continue.",
          customer,
        };
      } else {
        return {
          success: false,
          message: "Failed to create account. Please try again.",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "An error occurred during registration. Please try again.",
      };
    }
  }

  /**
   * Login customer
   */
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    message: string;
    customer?: AuthCustomer;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      const collection = await this.getCollection();

      // Sanitize inputs
      const sanitizedCredentials = {
        email: sanitizeInput(credentials.email.toLowerCase()),
        password: credentials.password,
      };

      // Validate inputs
      if (!validateEmail(sanitizedCredentials.email)) {
        return {
          success: false,
          message: "Please enter a valid email address",
        };
      }

      if (!sanitizedCredentials.password) {
        return { success: false, message: "Password is required" };
      }

      // Find customer
      const customerDoc = await collection.findOne({
        email: sanitizedCredentials.email,
      });

      if (!customerDoc) {
        return { success: false, message: "Invalid email or password" };
      }

      // Verify password
      const isPasswordValid = await verifyPassword(
        sanitizedCredentials.password,
        customerDoc.password
      );

      if (!isPasswordValid) {
        return { success: false, message: "Invalid email or password" };
      }

      // Generate tokens
      const customer = documentToAuthCustomer(customerDoc);
      const accessToken = generateAccessToken(customer);
      const refreshToken = generateRefreshToken(customer);

      // Update last login and refresh token
      await collection.updateOne(
        { id: customerDoc.id },
        {
          $set: {
            lastLoginAt: new Date(),
            refreshToken: refreshToken,
            updatedAt: new Date(),
          },
        }
      );

      return {
        success: true,
        message: "Login successful",
        customer,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "An error occurred during login. Please try again.",
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{
    success: boolean;
    message: string;
    accessToken?: string;
    newRefreshToken?: string;
  }> {
    try {
      const collection = await this.getCollection();

      // Find customer with this refresh token
      const customerDoc = await collection.findOne({
        refreshToken: refreshToken,
      });

      if (!customerDoc) {
        return { success: false, message: "Invalid refresh token" };
      }

      // Generate new tokens
      const customer = documentToAuthCustomer(customerDoc);
      const newAccessToken = generateAccessToken(customer);
      const newRefreshToken = generateRefreshToken(customer);

      // Update refresh token in database
      await collection.updateOne(
        { id: customerDoc.id },
        {
          $set: {
            refreshToken: newRefreshToken,
            updatedAt: new Date(),
          },
        }
      );

      return {
        success: true,
        message: "Token refreshed successfully",
        accessToken: newAccessToken,
        newRefreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return { success: false, message: "Failed to refresh token" };
    }
  }

  /**
   * Logout customer
   */
  async logout(
    customerId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const collection = await this.getCollection();

      // Clear refresh token
      await collection.updateOne(
        { id: customerId },
        {
          $unset: { refreshToken: "" },
          $set: { updatedAt: new Date() },
        }
      );

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: "Failed to logout" };
    }
  }

  /**
   * Get customer by ID for authentication
   */
  async getCustomerById(customerId: number): Promise<AuthCustomer | null> {
    try {
      const collection = await this.getCollection();
      const customerDoc = await collection.findOne({ id: customerId });

      if (!customerDoc) {
        return null;
      }

      return documentToAuthCustomer(customerDoc);
    } catch (error) {
      console.error("Get customer error:", error);
      return null;
    }
  }
}

// Export singleton instance
export const customerAuthService = new CustomerAuthService();

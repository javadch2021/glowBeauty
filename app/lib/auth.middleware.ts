import { redirect } from "@remix-run/node";
import { AuthCustomer } from "./models";
import { verifyAccessToken, verifyRefreshToken } from "./auth.server";
import {
  getAccessToken,
  getRefreshToken,
  createAuthCookies,
} from "./cookies.server";
import { customerAuthService } from "./services.server/CustomerAuthService";

export interface AuthResult {
  customer: AuthCustomer | null;
  headers?: Headers;
}

/**
 * Get authenticated customer from request
 * Handles token refresh automatically
 */
export async function getAuthenticatedCustomer(
  request: Request
): Promise<AuthResult> {
  try {
    // Try to get access token
    const accessToken = await getAccessToken(request);

    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload) {
        // Access token is valid, get customer
        const customer = await customerAuthService.getCustomerById(
          payload.customerId
        );
        if (customer) {
          return { customer };
        }
      }
    }

    // Access token is invalid or expired, try refresh token
    const refreshToken = await getRefreshToken(request);

    if (refreshToken) {
      const refreshPayload = verifyRefreshToken(refreshToken);
      if (refreshPayload) {
        // Refresh token is valid, generate new tokens
        const refreshResult = await customerAuthService.refreshToken(
          refreshToken
        );

        if (
          refreshResult.success &&
          refreshResult.accessToken &&
          refreshResult.newRefreshToken
        ) {
          const customer = await customerAuthService.getCustomerById(
            refreshPayload.customerId
          );
          if (customer) {
            // Create new cookies with refreshed tokens
            const headers = await createAuthCookies(
              refreshResult.accessToken,
              refreshResult.newRefreshToken
            );

            return { customer, headers };
          }
        }
      }
    }

    // No valid tokens found
    return { customer: null };
  } catch (error) {
    console.error("Authentication error:", error);
    return { customer: null };
  }
}

/**
 * Require authentication for a route
 * Redirects to login if not authenticated
 */
export async function requireAuth(
  request: Request,
  redirectTo?: string
): Promise<AuthCustomer> {
  const { customer, headers } = await getAuthenticatedCustomer(request);

  if (!customer) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams();

    if (redirectTo) {
      searchParams.set("redirectTo", redirectTo);
    } else {
      searchParams.set("redirectTo", url.pathname + url.search);
    }

    throw redirect(`/?login=true&${searchParams.toString()}`, { headers });
  }

  return customer;
}

/**
 * Optional authentication for a route
 * Returns customer if authenticated, null otherwise
 */
export async function optionalAuth(request: Request): Promise<AuthResult> {
  return getAuthenticatedCustomer(request);
}

/**
 * Redirect if already authenticated
 */
export async function redirectIfAuthenticated(
  request: Request,
  redirectTo: string = "/"
): Promise<void> {
  const { customer } = await getAuthenticatedCustomer(request);

  if (customer) {
    throw redirect(redirectTo);
  }
}

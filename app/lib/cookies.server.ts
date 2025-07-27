import { createCookie } from "@remix-run/node";

// Cookie configuration
const isProduction = process.env.NODE_ENV === "production";

export const accessTokenCookie = createCookie("access_token", {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  maxAge: 15 * 60, // 15 minutes
  path: "/",
});

export const refreshTokenCookie = createCookie("refresh_token", {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: "/",
});

/**
 * Create authentication cookies
 */
export async function createAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<Headers> {
  const accessCookie = await accessTokenCookie.serialize(accessToken);
  const refreshCookie = await refreshTokenCookie.serialize(refreshToken);

  const headers = new Headers();
  headers.append("Set-Cookie", accessCookie);
  headers.append("Set-Cookie", refreshCookie);

  return headers;
}

/**
 * Clear authentication cookies
 */
export async function clearAuthCookies(): Promise<Headers> {
  const accessCookie = await accessTokenCookie.serialize("", { maxAge: 0 });
  const refreshCookie = await refreshTokenCookie.serialize("", { maxAge: 0 });

  const headers = new Headers();
  headers.append("Set-Cookie", accessCookie);
  headers.append("Set-Cookie", refreshCookie);

  return headers;
}

/**
 * Get access token from request
 */
export async function getAccessToken(request: Request): Promise<string | null> {
  const cookieHeader = request.headers.get("Cookie");
  return await accessTokenCookie.parse(cookieHeader);
}

/**
 * Get refresh token from request
 */
export async function getRefreshToken(
  request: Request
): Promise<string | null> {
  const cookieHeader = request.headers.get("Cookie");
  return await refreshTokenCookie.parse(cookieHeader);
}

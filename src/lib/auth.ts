import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE = "admin_token";

function tokenFor(password: string): string {
  const secret = process.env.ADMIN_SECRET ?? "portoexpert-dev-secret";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function isAuthorized(request: Request): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return false;
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE}=`))
    ?.slice(AUTH_COOKIE.length + 1);

  const expected = tokenFor(expectedPassword);
  if (!token || token.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function createAuthCookie(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const token = tokenFor(password);
  return `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
}

export function clearAuthCookie(): string {
  return `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
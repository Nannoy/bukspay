// VULN: A07 - Weak JWT secret hardcoded, no expiry enforced
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// VULN: A02 - hardcoded weak secret in source code
export const JWT_SECRET = "bukspay_secret_123";

export interface TokenPayload {
  userId: number;
  username: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  // VULN: A07 - tokens never expire
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    // VULN: A02 - httpOnly:false means JS can read the token
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

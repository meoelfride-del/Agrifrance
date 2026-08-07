import { createHash, randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { env } from "../config.js";
import type { AuthUser } from "../types.js";

const accessKey = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshKey = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export const opaqueToken = () => randomBytes(48).toString("base64url");

export async function createAccessToken(user: AuthUser) {
  return new SignJWT({ email: user.email, role: user.role, companyId: user.companyId })
    .setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime(env.ACCESS_TOKEN_TTL).sign(accessKey);
}

export async function verifyAccessToken(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, accessKey, { algorithms: ["HS256"] });
  return { id: String(payload.sub), email: String(payload.email), role: payload.role as AuthUser["role"], companyId: payload.companyId ? String(payload.companyId) : null };
}

export async function signRefreshReference(sessionId: string, rawToken: string) {
  return new SignJWT({ token: rawToken }).setProtectedHeader({ alg: "HS256" }).setSubject(sessionId).setIssuedAt().setExpirationTime(`${env.REFRESH_TOKEN_TTL_DAYS}d`).sign(refreshKey);
}

export async function verifyRefreshReference(token: string) {
  const { payload } = await jwtVerify(token, refreshKey, { algorithms: ["HS256"] });
  return { sessionId: String(payload.sub), rawToken: String(payload.token) };
}

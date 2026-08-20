import { Router } from "express";
import argon2 from "argon2";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { authenticator } from "otplib";
import { query } from "../database/db.js";
import { env, isProduction } from "../config.js";
import { createAccessToken, opaqueToken, signRefreshReference, tokenHash, verifyRefreshReference } from "../security/tokens.js";
import { requireCsrf } from "../security/middleware.js";
import type { AuthUser, Role } from "../types.js";

export const authRouter = Router();
const credentials = z.object({ email: z.string().email().transform(v => v.toLowerCase()), password: z.string().min(12).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/), otp: z.string().length(6).optional() });
const cookie = { httpOnly: true, secure: isProduction, sameSite: (isProduction ? "none" : "strict") as "none"|"strict", domain: env.COOKIE_DOMAIN || undefined, path: "/" };

async function issueSession(res: import("express").Response, user: AuthUser, meta: { ip?: string; agent?: string }) {
  const raw = opaqueToken();
  const expires = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86400000);
  const result = await query<{ id: string }>("INSERT INTO sessions (user_id,token_hash,expires_at,ip_address,user_agent) VALUES ($1,$2,$3,$4,$5) RETURNING id", [user.id, tokenHash(raw), expires, meta.ip, meta.agent]);
  const access = await createAccessToken(user);
  const refresh = await signRefreshReference(result.rows[0]!.id, raw);
  res.cookie("access_token", access, { ...cookie, maxAge: 15 * 60 * 1000 });
  res.cookie("refresh_token", refresh, { ...cookie, maxAge: env.REFRESH_TOKEN_TTL_DAYS * 86400000 });
  const csrfToken = randomBytes(24).toString("hex");
  res.cookie("csrf_token", csrfToken, { ...cookie, httpOnly: false, maxAge: env.REFRESH_TOKEN_TTL_DAYS * 86400000 });
  return csrfToken;
}

authRouter.post("/register", async (req, res, next) => { try {
  const data = credentials.extend({ name: z.string().min(2).max(120) }).parse(req.body);
  const hash = await argon2.hash(data.password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 3, parallelism: 1 });
  const result = await query<{ id: string }>("INSERT INTO users (email,name,password_hash,role) VALUES ($1,$2,$3,'AGRICULTURIST_EMPLOYEE') RETURNING id", [data.email, data.name, hash]);
  res.status(201).json({ id: result.rows[0]!.id, message: "Compte créé. Validation professionnelle en attente." });
} catch (e) {
  if (typeof e === "object" && e !== null && "code" in e && e.code === "23505") return res.status(409).json({ error:"Un compte utilise déjà cette adresse e-mail." });
  next(e);
}});

authRouter.post("/login", async (req, res, next) => { try {
  const data = credentials.parse(req.body);
  const result = await query<{ id:string;email:string;password_hash:string;role:Role;company_id:string|null;mfa_secret:string|null }>("SELECT id,email,password_hash,role,company_id,mfa_secret FROM users WHERE email=$1 AND is_active=true", [data.email]);
  const row = result.rows[0];
  if (!row || !(await argon2.verify(row.password_hash, data.password))) return res.status(401).json({ error: "Identifiants invalides" });
  if (["COMPANY_MANAGER","DEALER_ADMIN","SUPER_ADMIN"].includes(row.role) && row.mfa_secret && (!data.otp || !authenticator.check(data.otp, row.mfa_secret))) return res.status(401).json({ error: "Code MFA requis ou invalide", mfaRequired: true });
  const user = { id: row.id, email: row.email, role: row.role, companyId: row.company_id };
  const csrfToken = await issueSession(res, user, { ip: req.ip, agent: req.get("user-agent") });
  await query("INSERT INTO audit_logs (user_id,event,ip_address) VALUES ($1,'LOGIN_SUCCESS',$2)", [row.id, req.ip]);
  res.json({ user, csrfToken });
} catch (e) { next(e); }});

authRouter.post("/refresh", requireCsrf, async (req, res, next) => { try {
  const ref = await verifyRefreshReference(req.cookies?.refresh_token ?? "");
  const result = await query<{ user_id:string;email:string;role:Role;company_id:string|null;token_hash:string }>(`SELECT s.user_id,u.email,u.role,u.company_id,s.token_hash FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=$1 AND s.revoked_at IS NULL AND s.expires_at>now()`, [ref.sessionId]);
  const row=result.rows[0]; if (!row || row.token_hash !== tokenHash(ref.rawToken)) return res.status(401).json({ error:"Session invalide" });
  await query("UPDATE sessions SET revoked_at=now() WHERE id=$1", [ref.sessionId]);
  const user = { id:row.user_id,email:row.email,role:row.role,companyId:row.company_id };
  const csrfToken = await issueSession(res, user, { ip:req.ip,agent:req.get("user-agent") });
  res.json({ user, csrfToken });
} catch(e){ next(e); }});

authRouter.post("/logout", requireCsrf, async (req,res) => {
  try {
    const ref = await verifyRefreshReference(req.cookies?.refresh_token ?? "");
    await query("UPDATE sessions SET revoked_at=now() WHERE id=$1 AND revoked_at IS NULL", [ref.sessionId]);
  } catch { /* Une déconnexion reste idempotente, même si la session a expiré. */ }
  res.clearCookie("access_token",cookie);
  res.clearCookie("refresh_token",cookie);
  res.clearCookie("csrf_token",{...cookie,httpOnly:false});
  res.status(204).end();
});

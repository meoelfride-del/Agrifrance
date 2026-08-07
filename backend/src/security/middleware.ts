import type { NextFunction, Response } from "express";
import { verifyAccessToken } from "./tokens.js";
import type { AuthRequest, Role } from "../types.js";

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.access_token as string | undefined;
    if (!token) return res.status(401).json({ error: "Authentification requise" });
    req.user = await verifyAccessToken(token);
    next();
  } catch { return res.status(401).json({ error: "Session invalide ou expirée" }); }
}

export const authorize = (...allowed: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !allowed.includes(req.user.role)) return res.status(403).json({ error: "Permission insuffisante" });
  next();
};

export function requireCsrf(req: AuthRequest, res: Response, next: NextFunction) {
  const cookie = req.cookies?.csrf_token;
  const header = req.header("x-csrf-token");
  if (!cookie || !header || cookie !== header) return res.status(403).json({ error: "Jeton CSRF invalide" });
  next();
}

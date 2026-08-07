import type { Request } from "express";

export const roles = ["VISITOR", "AGRICULTURIST_EMPLOYEE", "COMPANY_MANAGER", "DEALER_ADMIN", "SUPER_ADMIN"] as const;
export type Role = typeof roles[number];
export interface AuthUser { id: string; email: string; role: Role; companyId: string | null; }
export interface AuthRequest extends Request { user?: AuthUser; }

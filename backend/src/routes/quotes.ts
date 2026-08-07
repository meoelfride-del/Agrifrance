import { Router } from "express";
import { z } from "zod";
import { query } from "../database/db.js";
import { authenticate, authorize, requireCsrf } from "../security/middleware.js";
import type { AuthRequest } from "../types.js";

export const quoteRouter=Router();
const quoteSchema=z.object({ productSlug:z.string().regex(/^[a-z0-9-]+$/), companyName:z.string().min(2).max(160), contactName:z.string().min(2).max(120), email:z.string().email(), phone:z.string().min(7).max(30), surfaceHectares:z.number().nonnegative().max(100000), message:z.string().max(3000).default(""), configuration:z.record(z.string(),z.string()).default({}) });
quoteRouter.post("/",authenticate,requireCsrf,async(req:AuthRequest,res,next)=>{try{ const d=quoteSchema.parse(req.body); const result=await query<{id:string;reference:string}>(`INSERT INTO quotes (user_id,company_id,product_slug,company_name,contact_name,email,phone,surface_hectares,message,configuration,currency) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'EUR') RETURNING id,reference`,[req.user!.id,req.user!.companyId,d.productSlug,d.companyName,d.contactName,d.email,d.phone,d.surfaceHectares,d.message,JSON.stringify(d.configuration)]); res.status(201).json(result.rows[0]); }catch(e){next(e);} });
quoteRouter.get("/",authenticate,authorize("COMPANY_MANAGER","DEALER_ADMIN","SUPER_ADMIN"),async(req:AuthRequest,res,next)=>{try{ const result=await query("SELECT id,reference,status,total_cents,currency,created_at FROM quotes WHERE company_id=$1 ORDER BY created_at DESC LIMIT 100",[req.user!.companyId]);res.json(result.rows);}catch(e){next(e);} });

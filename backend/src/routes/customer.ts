import { Router } from "express";
import { z } from "zod";
import { query } from "../database/db.js";
import { authenticate } from "../security/middleware.js";
import { createQuotePdf, type QuotePdfData } from "../services/quote-pdf.js";
import type { AuthRequest } from "../types.js";

export const customerRouter=Router();customerRouter.use(authenticate);
customerRouter.get("/overview",async(req:AuthRequest,res,next)=>{try{const user=req.user!;const [orders,quotes]=await Promise.all([
  query(`SELECT o.id,o.status,o.currency,o.subtotal_cents,o.shipping_cents,o.total_cents,o.created_at,
    COALESCE(json_agg(DISTINCT jsonb_build_object('name',oi.product_name,'quantity',oi.quantity,'unit_price_cents',oi.unit_price_cents)) FILTER(WHERE oi.id IS NOT NULL),'[]') items,
    COALESCE(json_agg(DISTINCT jsonb_build_object('status',p.status,'amount_cents',p.amount_cents,'provider',p.provider,'created_at',p.created_at)) FILTER(WHERE p.id IS NOT NULL),'[]') payments,
    CASE WHEN d.id IS NULL THEN NULL ELSE json_build_object('status',d.status,'carrier',d.carrier,'tracking_number',d.tracking_number,'estimated_at',d.estimated_at,'delivered_at',d.delivered_at) END delivery
    FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id LEFT JOIN payments p ON p.order_id=o.id LEFT JOIN deliveries d ON d.order_id=o.id WHERE o.user_id=$1 GROUP BY o.id,d.id ORDER BY o.created_at DESC`,[user.id]),
  query("SELECT id,reference,product_slug,status,total_cents,currency,created_at FROM quotes WHERE user_id=$1 OR lower(email)=lower($2) ORDER BY created_at DESC",[user.id,user.email])
]);res.json({orders:orders.rows,quotes:quotes.rows});}catch(error){next(error);}});
customerRouter.get("/quotes/:reference/pdf",async(req:AuthRequest,res,next)=>{try{const reference=z.string().max(32).parse(req.params.reference);const result=await query<QuotePdfData>("SELECT * FROM quotes WHERE reference=$1 AND (user_id=$2 OR lower(email)=lower($3))",[reference,req.user!.id,req.user!.email]);const quote=result.rows[0];if(!quote)return res.status(404).json({error:"Devis introuvable"});const pdf=await createQuotePdf(quote);res.setHeader("content-type","application/pdf");res.setHeader("content-disposition",`attachment; filename=devis-${reference}.pdf`);res.setHeader("content-length",pdf.length);res.send(pdf);}catch(error){next(error);}});

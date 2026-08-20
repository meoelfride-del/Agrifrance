import { Router } from "express";
import { z } from "zod";
import { query } from "../database/db.js";
import { authenticate, authorize, requireCsrf } from "../security/middleware.js";

export const adminRouter = Router();
adminRouter.use(authenticate, authorize("DEALER_ADMIN", "SUPER_ADMIN"));

adminRouter.get("/summary", async (_req,res,next) => { try {
  const result = await query(`SELECT
    (SELECT count(*)::int FROM products WHERE is_active=true) products,
    (SELECT count(*)::int FROM carts WHERE status='active') active_carts,
    (SELECT count(*)::int FROM orders) orders,
    (SELECT count(*)::int FROM payments WHERE status IN ('paid','succeeded','completed')) paid_deposits,
    (SELECT COALESCE(sum(amount_cents),0)::bigint FROM payments WHERE status IN ('paid','succeeded','completed')) paid_amount_cents,
    (SELECT count(*)::int FROM quotes WHERE status='submitted') pending_quotes`);
  res.json(result.rows[0]);
} catch(error){ next(error); } });

adminRouter.get("/products", async (_req,res,next) => { try {
  const result=await query("SELECT id,name,slug,brand,price_cents,currency,engine_power_hp,transmission_type,condition,stock_status,is_active,created_at,updated_at FROM products ORDER BY updated_at DESC,name");
  res.json({items:result.rows});
} catch(error){next(error);} });

const productInput=z.object({name:z.string().min(2).max(160),slug:z.string().regex(/^[a-z0-9-]+$/),brand:z.string().min(2).max(100),priceCents:z.number().int().nonnegative().nullable(),enginePowerHp:z.number().int().nonnegative(),transmissionType:z.string().min(1).max(80),condition:z.enum(["new","used"]),stockStatus:z.string().min(1).max(30)});
adminRouter.post("/products",requireCsrf,async(req,res,next)=>{try{const d=productInput.parse(req.body);const result=await query("INSERT INTO products(name,slug,brand,price_cents,engine_power_hp,transmission_type,condition,stock_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",[d.name,d.slug,d.brand,d.priceCents,d.enginePowerHp,d.transmissionType,d.condition,d.stockStatus]);res.status(201).json(result.rows[0]);}catch(error){next(error);}});
adminRouter.put("/products/:id",requireCsrf,async(req,res,next)=>{try{const id=z.string().uuid().parse(req.params.id);const d=productInput.parse(req.body);const result=await query("UPDATE products SET name=$2,slug=$3,brand=$4,price_cents=$5,engine_power_hp=$6,transmission_type=$7,condition=$8,stock_status=$9,is_active=true,archived_at=NULL,updated_at=now() WHERE id=$1 RETURNING *",[id,d.name,d.slug,d.brand,d.priceCents,d.enginePowerHp,d.transmissionType,d.condition,d.stockStatus]);if(!result.rows[0])return res.status(404).json({error:"Produit introuvable"});res.json(result.rows[0]);}catch(error){next(error);}});
adminRouter.delete("/products/:id",requireCsrf,async(req,res,next)=>{try{const id=z.string().uuid().parse(req.params.id);const result=await query("UPDATE products SET is_active=false,archived_at=now(),updated_at=now() WHERE id=$1 RETURNING id",[id]);if(!result.rows[0])return res.status(404).json({error:"Produit introuvable"});res.status(204).end();}catch(error){next(error);}});

adminRouter.get("/carts",async(_req,res,next)=>{try{const result=await query(`SELECT c.id,c.status,c.updated_at,u.email,
  COALESCE(json_agg(json_build_object('product_id',ci.product_id,'name',p.name,'quantity',ci.quantity,'price_cents',p.price_cents)) FILTER (WHERE ci.product_id IS NOT NULL),'[]') items
  FROM carts c LEFT JOIN users u ON u.id=c.user_id LEFT JOIN cart_items ci ON ci.cart_id=c.id LEFT JOIN products p ON p.id=ci.product_id
  GROUP BY c.id,u.email ORDER BY c.updated_at DESC LIMIT 200`);res.json({items:result.rows});}catch(error){next(error);}});
adminRouter.get("/orders",async(_req,res,next)=>{try{const result=await query(`SELECT o.id,o.status,o.currency,o.subtotal_cents,o.shipping_cents,o.total_cents,o.created_at,u.email,
  COALESCE(json_agg(json_build_object('name',oi.product_name,'quantity',oi.quantity,'unit_price_cents',oi.unit_price_cents)) FILTER (WHERE oi.id IS NOT NULL),'[]') items
  FROM orders o LEFT JOIN users u ON u.id=o.user_id LEFT JOIN order_items oi ON oi.order_id=o.id
  GROUP BY o.id,u.email ORDER BY o.created_at DESC LIMIT 200`);res.json({items:result.rows});}catch(error){next(error);}});
adminRouter.patch("/orders/:id",requireCsrf,async(req,res,next)=>{try{const id=z.string().uuid().parse(req.params.id);const status=z.enum(["pending","confirmed","processing","shipped","delivered","cancelled"]).parse(req.body.status);const result=await query("UPDATE orders SET status=$2 WHERE id=$1 RETURNING id,status",[id,status]);if(!result.rows[0])return res.status(404).json({error:"Commande introuvable"});res.json(result.rows[0]);}catch(error){next(error);}});
adminRouter.get("/payments",async(_req,res,next)=>{try{const result=await query(`SELECT p.id,p.order_id,p.provider,p.provider_reference,p.status,p.amount_cents,p.currency,p.created_at,u.email
  FROM payments p LEFT JOIN orders o ON o.id=p.order_id LEFT JOIN users u ON u.id=o.user_id ORDER BY p.created_at DESC LIMIT 200`);res.json({items:result.rows});}catch(error){next(error);}});

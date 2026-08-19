import { Router } from "express";
import { z } from "zod";
import { query } from "../database/db.js";
import { authenticate, authorize } from "../security/middleware.js";
import type { AuthRequest } from "../types.js";

export const catalogRouter = Router();

const filters = z.object({
  q: z.string().trim().max(120).optional(),
  brand: z.string().trim().max(100).optional(),
  category: z.string().trim().max(140).optional(),
  powerMin: z.coerce.number().int().min(0).default(0),
  powerMax: z.coerce.number().int().max(2000).default(2000),
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
  transmission: z.string().max(80).optional(),
  condition: z.enum(["new", "used"]).optional(),
  available: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "power_desc"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(24),
});

catalogRouter.get("/", async (req, res, next) => { try {
  const f = filters.parse(req.query);
  const values: unknown[] = [f.powerMin, f.powerMax];
  const where = ["p.is_active=true", "p.archived_at IS NULL", "p.engine_power_hp BETWEEN $1 AND $2"];
  const add = (sql: string, value: unknown) => { values.push(value); where.push(sql.replace("?", `$${values.length}`)); };
  if (f.q) { values.push(f.q); where.push(`(p.name ILIKE '%'||$${values.length}||'%' OR p.brand ILIKE '%'||$${values.length}||'%')`); }
  if (f.brand) add("p.brand=?", f.brand);
  if (f.category) add("c.slug=?", f.category);
  if (f.priceMin !== undefined) add("p.price_cents>=?", f.priceMin);
  if (f.priceMax !== undefined) add("p.price_cents<=?", f.priceMax);
  if (f.transmission) add("p.transmission_type=?", f.transmission);
  if (f.condition) add("p.condition=?", f.condition);
  if (f.available) where.push("p.stock_status='available'");
  const order = { newest:"p.created_at DESC", price_asc:"p.price_cents ASC NULLS LAST", price_desc:"p.price_cents DESC NULLS LAST", power_desc:"p.engine_power_hp DESC" }[f.sort];
  const offset = (f.page - 1) * f.limit;
  values.push(f.limit, offset);
  const sql = `SELECT p.id,p.name,p.slug,p.brand,p.price_cents,p.currency,p.tax_included,p.price_source,p.price_checked_at,p.engine_power_hp,p.transmission_type,p.condition,p.stock_status,c.slug AS category_slug,COUNT(*) OVER()::int AS total FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE ${where.join(" AND ")} ORDER BY ${order} LIMIT $${values.length - 1} OFFSET $${values.length}`;
  const result = await query(sql, values);
  const total = Number(result.rows[0]?.total ?? 0);
  res.json({ items: result.rows.map(({ total: rowTotal, ...item }) => { void rowTotal; return item; }), pagination: { page:f.page, limit:f.limit, total, pages:Math.ceil(total / f.limit) } });
} catch (error) { next(error); } });

catalogRouter.get("/:slug", async (req,res,next) => { try {
  const slug=z.string().regex(/^[a-z0-9-]+$/).parse(req.params.slug);
  const result=await query("SELECT * FROM products WHERE slug=$1 AND is_active=true AND archived_at IS NULL",[slug]);
  if(!result.rows[0]) return res.status(404).json({error:"Produit introuvable"});
  res.json(result.rows[0]);
} catch(error) { next(error); } });

const adminProduct = z.object({ name:z.string().min(2).max(160), slug:z.string().regex(/^[a-z0-9-]+$/), brand:z.string().min(2).max(100), priceCents:z.number().int().nonnegative().nullable(), enginePowerHp:z.number().int().nonnegative(), transmissionType:z.string().max(80), condition:z.enum(["new","used"]), stockStatus:z.string().max(30), priceSource:z.string().url().nullable(), priceCheckedAt:z.string().datetime().nullable() });
catalogRouter.post("/", authenticate, authorize("DEALER_ADMIN","SUPER_ADMIN"), async (req:AuthRequest,res,next) => { try {
  const d=adminProduct.parse(req.body);
  const result=await query("INSERT INTO products (name,slug,brand,price_cents,engine_power_hp,transmission_type,condition,stock_status,price_source,price_checked_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",[d.name,d.slug,d.brand,d.priceCents,d.enginePowerHp,d.transmissionType,d.condition,d.stockStatus,d.priceSource,d.priceCheckedAt]);
  res.status(201).json(result.rows[0]);
} catch(error) { next(error); } });

catalogRouter.patch("/:id/archive", authenticate, authorize("DEALER_ADMIN","SUPER_ADMIN"), async (req:AuthRequest,res,next) => { try {
  const id=z.string().uuid().parse(req.params.id);
  const result=await query("UPDATE products SET archived_at=now(),is_active=false,updated_at=now() WHERE id=$1 RETURNING id",[id]);
  if(!result.rows[0]) return res.status(404).json({error:"Produit introuvable"});
  res.json(result.rows[0]);
} catch(error) { next(error); } });

export const partsRouter = Router();
partsRouter.get("/", async(req,res,next)=>{try{ const category=z.string().max(80).optional().parse(req.query.category); const values:unknown[]=[]; let sql="SELECT reference,name,compatibility,price_cents,currency,stock_status,stock_quantity,category FROM spare_parts WHERE is_active=true"; if(category){values.push(category);sql+=` AND category=$${values.length}`;} sql+=" ORDER BY category,name"; const result=await query(sql,values); res.json({currency:"EUR",items:result.rows}); }catch(e){next(e);} });

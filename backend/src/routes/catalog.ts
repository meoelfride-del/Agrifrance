import { Router } from "express";
import { z } from "zod";
import { query } from "../database/db.js";

export const catalogRouter = Router();
const filters = z.object({ powerMin:z.coerce.number().int().min(0).default(0), powerMax:z.coerce.number().int().max(1000).default(1000), transmission:z.string().max(50).optional(), condition:z.enum(["new","used"]).optional(), limit:z.coerce.number().int().min(1).max(50).default(24) });
catalogRouter.get("/", async (req,res,next)=>{ try {
  const f=filters.parse(req.query); const values:unknown[]=[f.powerMin,f.powerMax];
  let sql="SELECT id,name,slug,brand,price_cents,engine_power_hp,transmission_type,condition,stock_status FROM products WHERE is_active=true AND engine_power_hp BETWEEN $1 AND $2";
  if(f.transmission){ values.push(f.transmission); sql+=` AND transmission_type=$${values.length}`; }
  if(f.condition){ values.push(f.condition); sql+=` AND condition=$${values.length}`; }
  values.push(f.limit); sql+=` ORDER BY engine_power_hp DESC LIMIT $${values.length}`;
  const result=await query(sql,values); res.json({currency:"EUR",items:result.rows});
} catch(e){next(e);} });
catalogRouter.get("/:slug", async(req,res,next)=>{try{ const slug=z.string().regex(/^[a-z0-9-]+$/).parse(req.params.slug); const result=await query("SELECT * FROM products WHERE slug=$1 AND is_active=true",[slug]); if(!result.rows[0]) return res.status(404).json({error:"Produit introuvable"}); res.json(result.rows[0]); }catch(e){next(e);} });

export const partsRouter = Router();
partsRouter.get("/", async(req,res,next)=>{try{ const category=z.string().max(80).optional().parse(req.query.category); const values:unknown[]=[]; let sql="SELECT reference,name,compatibility,price_cents,currency,stock_status,stock_quantity,category FROM spare_parts WHERE is_active=true"; if(category){values.push(category);sql+=` AND category=$${values.length}`;} sql+=" ORDER BY category,name"; const result=await query(sql,values); res.json({currency:"EUR",items:result.rows}); }catch(e){next(e);} });

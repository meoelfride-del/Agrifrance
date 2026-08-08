import type { MetadataRoute } from "next";
import { products } from "@/src/data/products";
export default function sitemap():MetadataRoute.Sitemap{const base="https://agrifrance.vercel.app";const pages=["","/catalog","/parts","/quote-request","/legal/privacy","/legal/terms","/legal/cookies"].map((path)=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:path===""?1:.7}));return[...pages,...products.map((product)=>({url:`${base}/produits/${product.categorySlug}/${product.slug}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.6}))];}

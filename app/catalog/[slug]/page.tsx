import { notFound, redirect } from "next/navigation";
import { productBySlug } from "@/src/data/products";
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const product=productBySlug(slug);if(!product)notFound();redirect(`/produits/${product.categorySlug}/${product.slug}`);}

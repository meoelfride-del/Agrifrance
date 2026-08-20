import { notFound, redirect } from "next/navigation";
import { getProduct } from "@/src/services/api";
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const product=await getProduct(slug);if(!product)notFound();redirect(`/produits/${product.categorySlug}/${product.slug}`);}

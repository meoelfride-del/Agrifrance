import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/src/views/ProductPage";
import { getProduct, getProducts } from "@/src/services/api";
type Props={params:Promise<{category:string;slug:string}>};
export async function generateStaticParams(){return (await getProducts()).map((product)=>({category:product.categorySlug,slug:product.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const{category,slug}=await params;const product=await getProduct(slug);if(!product||product.categorySlug!==category)return{};const url=`/produits/${category}/${slug}`;return{title:product.nom,description:product.descriptionCourte,alternates:{canonical:url},openGraph:{title:product.nom,description:product.descriptionCourte,url,images:[{url:product.images[0]!.src,alt:product.images[0]!.alt}]},twitter:{card:"summary_large_image",title:product.nom,description:product.descriptionCourte,images:[product.images[0]!.src]}};}
export default async function Page({params}:Props){const{category,slug}=await params;const product=await getProduct(slug);if(!product||product.categorySlug!==category)notFound();return <ProductPage product={product}/>;}

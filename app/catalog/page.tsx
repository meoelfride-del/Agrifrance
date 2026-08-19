import type { Metadata } from "next";
import { CatalogPage } from "@/src/views/CatalogPage";
export const metadata:Metadata={title:"Catalogue de machines agricoles",description:"Parcourez 300 tracteurs, moissonneuses, ensileuses, semoirs et équipements agricoles.",alternates:{canonical:"/catalog"}};
export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category = "" } = await searchParams;
  return <CatalogPage initialCategory={category === "tracteurs" ? category : ""}/>;
}

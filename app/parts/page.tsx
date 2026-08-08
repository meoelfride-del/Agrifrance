import type { Metadata } from "next";
import { CatalogPage } from "@/src/views/CatalogPage";
export const metadata:Metadata={title:"Pièces et accessoires agricoles",description:"Pièces, consommables et accessoires compatibles pour maintenir votre parc agricole."};
export default function Page(){return <CatalogPage initialCategory="pieces-accessoires"/>;}

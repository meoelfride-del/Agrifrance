import type { Metadata } from "next";
import { PartsPage } from "@/src/views/PartsPage";
import { getSpareParts } from "@/src/services/api";
export const metadata:Metadata={title:"Pièces et accessoires agricoles",description:"Pièces, consommables et accessoires compatibles pour maintenir votre parc agricole."};
export default async function Page(){return <PartsPage parts={await getSpareParts()}/>;}

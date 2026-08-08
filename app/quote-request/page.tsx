import type { Metadata } from "next";
import { Suspense } from "react";
import { QuotePage } from "@/src/views/QuotePage";
export const metadata:Metadata={title:"Demander un devis gratuit",description:"Recevez une offre personnalisée pour votre machine agricole sous un jour ouvré."};
export default function Page(){return <Suspense fallback={<main className="page-loading">Chargement…</main>}><QuotePage/></Suspense>;}

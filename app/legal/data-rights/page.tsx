import type { Metadata } from "next";
import { LegalPage } from "@/src/views/LegalPage";
export const metadata:Metadata={title:"Exercer vos droits sur les données"};
export default function Page(){return <LegalPage type="rights"/>;}

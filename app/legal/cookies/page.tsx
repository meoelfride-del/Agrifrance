import type { Metadata } from "next";
import { LegalPage } from "@/src/views/LegalPage";
export const metadata:Metadata={title:"Politique relative aux cookies"};
export default function Page(){return <LegalPage type="cookies"/>;}

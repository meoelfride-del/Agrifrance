import type { Metadata } from "next";
import { LegalPage } from "@/src/views/LegalPage";
export const metadata:Metadata={title:"Mentions légales"};
export default function Page(){return <LegalPage type="notices"/>;}

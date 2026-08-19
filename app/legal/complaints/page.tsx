import type { Metadata } from "next";
import { LegalPage } from "@/src/views/LegalPage";
export const metadata:Metadata={title:"Réclamations et droit de plainte"};
export default function Page(){return <LegalPage type="complaints"/>;}

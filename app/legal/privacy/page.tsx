import type { Metadata } from "next";
import { LegalPage } from "@/src/views/LegalPage";
export const metadata:Metadata={title:"Politique de confidentialité"};
export default function Page(){return <LegalPage type="privacy"/>;}

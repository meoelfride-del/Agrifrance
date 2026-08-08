import type { Metadata } from "next";
import { LegalPage } from "@/src/views/LegalPage";
export const metadata:Metadata={title:"Conditions générales"};
export default function Page(){return <LegalPage type="terms"/>;}

import type { Metadata } from "next";
import { ConfiguratorPage } from "@/src/views/ConfiguratorPage";
export const metadata:Metadata={title:"Configurateur de tracteur"};
export default function Page(){return <ConfiguratorPage/>;}

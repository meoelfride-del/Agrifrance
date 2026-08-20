import type { Metadata } from "next";
import { AdminDashboard } from "@/src/views/AdminDashboard";

export const metadata:Metadata={title:"Tableau de bord",robots:{index:false,follow:false}};
export default function Page(){return <AdminDashboard/>;}

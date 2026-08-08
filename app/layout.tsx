import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { AppProviders } from "@/src/components/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agrifrance.vercel.app"),
  title: { default: "AgriFrance Machines | Matériel agricole professionnel", template: "%s | AgriFrance" },
  description: "300 machines agricoles, équipements et pièces avec devis personnalisé, livraison organisée et service après-vente.",
  alternates: { canonical: "/" },
  openGraph: { type:"website",locale:"fr_FR",siteName:"AgriFrance Machines",title:"AgriFrance Machines",description:"Machines agricoles professionnelles, devis gratuit et accompagnement terrain.",images:[{url:"/tractor-hero.webp",width:1600,height:900,alt:"Tracteur agricole AgriFrance"}] },
  twitter: { card:"summary_large_image",title:"AgriFrance Machines",description:"Machines agricoles professionnelles et devis personnalisé.",images:["/tractor-hero.webp"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storedLanguage = (await cookies()).get("agrifrance-language")?.value;
  const language = (["fr","en","es","de","pt"].includes(storedLanguage ?? "") ? storedLanguage : "fr") as "fr"|"en"|"es"|"de"|"pt";
  return (
    <html lang={language}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders language={language}>{children}</AppProviders>
      </body>
    </html>
  );
}

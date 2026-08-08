"use client";

import { AppShell } from "@/src/components/AppShell";

const content = {
  privacy: ["Politique de confidentialité","AgriFrance collecte uniquement les informations nécessaires au traitement des demandes de devis et de commande. Vous pouvez demander l’accès, la correction ou la suppression de vos données à contact@agrifrance.bj."],
  terms: ["Conditions générales","Les prix affichés sont indicatifs et hors taxes. Une commande devient ferme après validation du devis, des modalités de livraison et du paiement convenu."],
  cookies: ["Politique relative aux cookies","Le site utilise le stockage local pour mémoriser votre langue et votre panier. Aucun mécanisme publicitaire trompeur ni faux compteur n’est utilisé."],
} as const;
export function LegalPage({ type }: { type:keyof typeof content }) { const [title,text] = content[type]; return <AppShell><article className="legal-page"><h1>{title}</h1><p>{text}</p><h2>Contact</h2><p>AgriFrance Machines · Cotonou, Bénin · contact@agrifrance.bj</p></article></AppShell>; }

"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/src/components/AppShell";
import { ProductGrid } from "@/src/components/ProductGrid";
import { featuredProducts, promotionalProducts, products } from "@/src/data/products";

export function HomePage() {
  const { t } = useTranslation();
  return <AppShell><section className="commerce-hero"><Image src="/tractor-hero.webp" alt="Tracteur agricole AgriFrance au travail, visuel de démonstration" fill priority sizes="100vw"/><div className="commerce-hero-overlay"/><div className="commerce-hero-content"><span>{t("home.eyebrow")}</span><h1>{t("home.title")}</h1><p>{t("home.subtitle")}</p><div><Link className="button button-primary" href="/catalog">{t("home.primary")}</Link><Link className="button button-light" href="/quote-request">{t("home.secondary")}</Link></div><ul><li>300 {t("common.available").toLowerCase()}</li><li>10 catégories</li><li>SAV 6j/7</li></ul></div></section>
    <HomeCollection title={t("home.popular")} subtitle={t("home.whyText")} products={featuredProducts}/>
    <HomeCollection title={t("home.promotions")} subtitle={t("common.indicative")} products={promotionalProducts}/>
    <HomeCollection title={t("home.newProducts")} subtitle={t("product.placeholder")} products={products.filter((item) => item.annee === 2026).slice(0,8)}/>
    <section className="trust-section"><div className="section-intro"><span>AGRIFRANCE</span><h2>{t("home.why")}</h2><p>{t("home.whyText")}</p></div><div className="trust-grid"><Trust icon="🚚" title={t("home.delivery")} text={t("home.deliveryText")}/><Trust icon="✓" title={t("home.warranty")} text={t("home.warrantyText")}/><Trust icon="🛠" title={t("home.support")} text={t("home.supportText")}/></div></section>
    <section className="testimonials-section"><div className="section-intro"><span>EXPÉRIENCES RÉELLES</span><h2>{t("home.testimonials")}</h2></div><div className="testimonial-grid"><blockquote>“{t("home.testimonial1")}”<cite>— Coopérative partenaire, Borgou</cite></blockquote><blockquote>“{t("home.testimonial2")}”<cite>— Exploitation partenaire, Atlantique</cite></blockquote></div></section>
    <section className="faq-section"><div className="section-intro"><span>FAQ</span><h2>{t("home.faq")}</h2></div><div>{[1,2,3].map((index) => <details key={index}><summary>{t(`home.faq${index}`)}</summary><p>{t(`home.answer${index}`)}</p></details>)}</div></section>
    <section className="quick-quote-banner"><div><span>RÉPONSE SOUS 1 JOUR OUVRÉ</span><h2>{t("quote.title")}</h2><p>{t("quote.subtitle")}</p></div><Link className="button button-primary" href="/quote-request">{t("common.quote")}</Link></section>
  </AppShell>;
}

function HomeCollection({ title, subtitle, products }: { title:string; subtitle:string; products:typeof featuredProducts }) {
  return <section className="commerce-section"><div className="section-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><Link href="/catalog">Voir tout →</Link></div><ProductGrid products={products.slice(0,4)}/></section>;
}
function Trust({ icon,title,text }:{icon:string;title:string;text:string}) { return <article><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>; }

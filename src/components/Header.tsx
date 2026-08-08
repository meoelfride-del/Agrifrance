"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/src/context/CartContext";
import { LanguageSelector } from "./LanguageSelector";

export function Header() {
  const { t } = useTranslation();
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);
  return <>
    <div className="site-topbar"><span>{t("home.eyebrow")}</span><a href="tel:+2290197000000">+229 01 97 00 00 00</a></div>
    <header className="site-header">
      <Link href="/" className="site-brand" onClick={close}><span>AF</span><b>AGRIFRANCE<small>MACHINES & SERVICES</small></b></Link>
      <button className="mobile-menu-button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-controls="main-navigation"><span className="sr-only">Menu</span>☰</button>
      <nav id="main-navigation" className={mobileOpen ? "main-nav open" : "main-nav"}>
        <Link href="/" onClick={close}>{t("nav.home")}</Link>
        <Link href="/catalog" onClick={close}>{t("nav.catalog")}</Link>
        <Link href="/parts" onClick={close}>{t("nav.parts")}</Link>
        <Link href="/quote-request" onClick={close}>{t("nav.quote")}</Link>
        <LanguageSelector compact />
      </nav>
      <div className="header-tools"><LanguageSelector/><button className="cart-trigger" onClick={() => setOpen(true)} aria-label={`${t("cart.title")} (${count})`}>🛒<span>{count}</span></button><Link className="header-cta" href="/quote-request">{t("nav.quote")}</Link></div>
    </header>
  </>;
}

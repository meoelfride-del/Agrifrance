"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return <footer className="site-footer"><div className="footer-columns">
    <div><Link href="/" className="site-brand light"><span>AF</span><b>AGRIFRANCE<small>MACHINES & SERVICES</small></b></Link><p>{t("footer.tagline")}</p></div>
    <div><h3>{t("footer.services")}</h3><Link href="/catalog">{t("nav.catalog")}</Link><Link href="/parts">{t("nav.parts")}</Link><Link href="/quote-request">{t("nav.quote")}</Link></div>
    <div><h3>{t("nav.legal")}</h3><Link href="/legal/privacy">{t("footer.privacy")}</Link><Link href="/legal/terms">{t("footer.terms")}</Link><Link href="/legal/cookies">{t("footer.cookies")}</Link></div>
    <div><h3>{t("footer.contact")}</h3><a href="tel:+2290197000000">+229 01 97 00 00 00</a><a href="mailto:contact@agrifrance.bj">contact@agrifrance.bj</a><span>Cotonou, Bénin</span></div>
  </div><div className="footer-bottom">© 2026 AgriFrance. {t("footer.rights")}</div></footer>;
}

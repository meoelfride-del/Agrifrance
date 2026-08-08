"use client";

import { useSearchParams } from "next/navigation";
import { AppShell } from "@/src/components/AppShell";
import { QuoteForm } from "@/src/components/QuoteForm";
import { useTranslation } from "react-i18next";

export function QuotePage() {
  const { t } = useTranslation();
  const params = useSearchParams();
  return <AppShell><section className="quote-page-new"><div className="quote-intro"><span>DEVIS SANS ENGAGEMENT</span><h1>{t("quote.title")}</h1><p>{t("quote.subtitle")}</p><ul><li>✓ {t("home.delivery")}</li><li>✓ {t("home.warranty")}</li><li>✓ {t("home.support")}</li></ul></div><QuoteForm initialProduct={params.get("product") ?? ""}/></section></AppShell>;
}

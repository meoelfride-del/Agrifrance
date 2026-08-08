"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { whatsappUrl } from "@/src/utils/format";

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return <><a className="skip-link" href="#main-content">Aller au contenu</a><Header/><main id="main-content">{children}</main><Footer/><CartDrawer/><a className="floating-whatsapp" href={whatsappUrl("Bonjour AgriFrance, je souhaite parler à un conseiller.")} target="_blank" rel="noreferrer" aria-label={t("common.whatsapp")}>WA</a></>;
}

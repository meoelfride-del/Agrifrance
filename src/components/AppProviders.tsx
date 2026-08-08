"use client";

import { useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { createAppI18n, type SupportedLanguage } from "@/src/services/i18n";
import { CartProvider } from "@/src/context/CartContext";

export function AppProviders({ children, language }: { children: ReactNode; language:SupportedLanguage }) {
  const [i18n] = useState(() => createAppI18n(language));
  return <I18nextProvider i18n={i18n}><CartProvider>{children}</CartProvider></I18nextProvider>;
}

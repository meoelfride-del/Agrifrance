"use client";

import { useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { createAppI18n, type SupportedLanguage } from "@/src/services/i18n";
import { CartProvider } from "@/src/context/CartContext";
import { PreferenceProvider } from "@/src/context/PreferenceContext";
import { ProductCatalogProvider } from "@/src/context/ProductCatalogContext";
import type { Product } from "@/src/types/product";

export function AppProviders({ children, language, products }: { children: ReactNode; language:SupportedLanguage; products:Product[] }) {
  const [i18n] = useState(() => createAppI18n(language));
  return <I18nextProvider i18n={i18n}><ProductCatalogProvider products={products}><PreferenceProvider><CartProvider>{children}</CartProvider></PreferenceProvider></ProductCatalogProvider></I18nextProvider>;
}

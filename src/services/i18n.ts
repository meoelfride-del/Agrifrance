"use client";

import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "@/src/locales/fr/translation.json";
import en from "@/src/locales/en/translation.json";
import es from "@/src/locales/es/translation.json";
import de from "@/src/locales/de/translation.json";
import pt from "@/src/locales/pt/translation.json";

export const supportedLanguages = ["fr", "en", "es", "de", "pt"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const productImageNotices = {
  fr: "Photographie non contractuelle : la configuration livrée est confirmée dans le devis.",
  en: "Non-contractual photograph: the delivered configuration is confirmed in the quote.",
  es: "Fotografía no contractual: la configuración entregada se confirma en el presupuesto.",
  de: "Unverbindliche Abbildung: Die gelieferte Konfiguration wird im Angebot bestätigt.",
  pt: "Fotografia não contratual: a configuração entregue é confirmada no orçamento.",
} satisfies Record<SupportedLanguage, string>;

const translations = { fr, en, es, de, pt };
const resources = Object.fromEntries(
  supportedLanguages.map((code) => [code, {
    translation: {
      ...translations[code],
      product: { ...translations[code].product, placeholder: productImageNotices[code] },
    },
  }]),
);

export function createAppI18n(language: SupportedLanguage) {
  const instance = createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
    returnNull: false, initAsync: false,
  });
  return instance;
}

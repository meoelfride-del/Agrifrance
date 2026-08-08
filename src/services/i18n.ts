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

export function createAppI18n(language: SupportedLanguage) {
  const instance = createInstance();
  void instance.use(initReactI18next).init({
    resources: { fr: { translation: fr }, en: { translation: en }, es: { translation: es }, de: { translation: de }, pt: { translation: pt } },
    lng: language,
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
    returnNull: false, initAsync: false,
  });
  return instance;
}

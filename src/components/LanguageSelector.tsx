"use client";

import { useTranslation } from "react-i18next";
import { supportedLanguages, type SupportedLanguage } from "@/src/services/i18n";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const change = (language: SupportedLanguage) => {
    localStorage.setItem("agrifrance-language", language);
    document.cookie = `agrifrance-language=${language}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = language;
    void i18n.changeLanguage(language);
  };
  return <label className={compact ? "language-selector compact" : "language-selector"}>
    <span>{t("language.label")}</span>
    <select value={i18n.resolvedLanguage?.slice(0, 2) ?? "fr"} onChange={(event) => change(event.target.value as SupportedLanguage)} aria-label={t("language.label")}>
      {supportedLanguages.map((language) => <option value={language} key={language}>{t(`language.${language}`)}</option>)}
    </select>
  </label>;
}

"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect } from "react";

export default function LangUpdater() {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

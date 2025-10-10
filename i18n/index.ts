import { I18n, TranslateOptions } from "i18n-js";
import { getLocales, Locale, locale } from "expo-localization";
import enUS from "@/i18n/locales/en-US.json";
import ptBR from "@/i18n/locales/pt-BR.json";

const isLocaleArrayValid = (locales: Locale[]) => {
  return (
    Array.isArray(locales) && locales.length > 0 && locales[0]?.languageTag
  );
};

const getDeviceLocaleTag = (): string => {
  const locales = typeof getLocales === "function" ? getLocales() : [];

  if (isLocaleArrayValid(locales)) {
    return locales[0].languageTag;
  }

  // Fallback for older SDKs
  return (locale as string) || "en-US";
};

export const i18n = new I18n({
  "en-US": enUS,
  "pt-BR": ptBR,
  en: enUS,
  pt: ptBR,
});

i18n.enableFallback = true;
i18n.defaultLocale = "en-US";
i18n.locale = getDeviceLocaleTag();

export const t = (key: string, options?: TranslateOptions) =>
  i18n.t(key, options);

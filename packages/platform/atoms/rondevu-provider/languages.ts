import type enTranslations from "@rondevu/i18n/locales/en/common.json";
import type trTranslations from "@rondevu/i18n/locales/tr/common.json";

export type enTranslationKeys = keyof typeof enTranslations;
export type trTranslationKeys = keyof typeof trTranslations;
export type translationKeys = enTranslationKeys | trTranslationKeys;

export const EN = "en";
export const TR = "tr";

const RONDEVU_PROVIDER_LANGUAGES = [EN, TR] as const;
export type RondevuProviderLanguagesType = (typeof RONDEVU_PROVIDER_LANGUAGES)[number];

type i18nEnProps = {
  labels?: Partial<Record<enTranslationKeys, string>>;
  language?: "en";
};

type i18nTrProps = {
  labels?: Partial<Record<trTranslationKeys, string>>;
  language?: "tr";
};

export type i18nProps = i18nEnProps | i18nTrProps;

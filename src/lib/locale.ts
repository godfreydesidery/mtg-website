import { lang } from "next/root-params";
import { defaultLocale, dictionaries, isLocale, type Locale } from "./i18n";

/** Current language (from the /sw or /en part of the address) and its text. Server Components only. */
export async function getI18n(): Promise<{ locale: Locale; t: (typeof dictionaries)[Locale] }> {
  const value = await lang();
  const locale = isLocale(value) ? value : defaultLocale;
  return { locale, t: dictionaries[locale] };
}

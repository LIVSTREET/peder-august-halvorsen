import { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getLocaleFromPath,
  getPathWithoutLocale,
  withLocalePath,
  type Locale,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  pathWithoutLocale: string;
  withLocalePath: (path: string) => string;
  /** URL (path + search + hash) for å bytte til andre språk. */
  switchLocaleUrl: () => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { pathname, search, hash } = useLocation();
  const locale = getLocaleFromPath(pathname);
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const withLocalePathForCurrent = (path: string) =>
    withLocalePath(path, locale);

  const switchLocaleUrl = (): string => {
    const next: Locale = locale === "en" ? "no" : "en";
    const path = next === "en"
      ? withLocalePath(pathWithoutLocale, "en")
      : pathWithoutLocale || "/";
    return path + search + hash;
  };

  const value: LocaleContextValue = {
    locale,
    pathWithoutLocale,
    withLocalePath: withLocalePathForCurrent,
    switchLocaleUrl,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}

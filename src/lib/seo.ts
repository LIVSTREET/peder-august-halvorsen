export const SITE_NAME = "Studio P.A. Halvorsen";
export const SITE_TAGLINE_NO = "Moderne digitalt håndverk";
export const SITE_TAGLINE_EN = "Modern digital craft";
export const PERSON_NAME = "Peder August Halvorsen";
export const CONTACT_EMAIL = "mail@studiopah.no";
/** Klikkbar tel:-lenke. */
export const CONTACT_PHONE = "+4745251280";
/** Visningsformat for telefonnummer. */
export const CONTACT_PHONE_DISPLAY = "45 25 12 80";
/** Lover svartid på offentlige sider. */
export const RESPONSE_TIME_NO = "Svar innen 24 timer på hverdager";
export const RESPONSE_TIME_EN = "Reply within 24 hours on weekdays";

export const LEGAL_NAME = "Peder August Halvorsen";
export const ORG_NUMBER = "927309114";
export const COMPANY_FORM = "ENK";
export const IS_VAT_REGISTERED = false;

export function getBaseUrl(): string {
  if (import.meta.env.VITE_SITE_URL) return import.meta.env.VITE_SITE_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function getCanonicalUrl(pathname: string): string {
  const base = getBaseUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base.replace(/\/$/, "")}${path}`;
}

/** Gir full URL for en path (uten locale). Brukes til hreflang. */
export function getLocaleCanonical(pathWithoutLocale: string, locale: "no" | "en"): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const path = pathWithoutLocale === "/" ? "" : pathWithoutLocale.startsWith("/") ? pathWithoutLocale : `/${pathWithoutLocale}`;
  if (locale === "en") return `${base}/en${path || ""}`;
  return `${base}${path || "/"}`;
}

export function truncate(text: string, max = 157): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/[#*_~`>\[\]()!]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

export function formatOrgNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 9) return raw;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function formatLegalOrgLine(_locale: "no" | "en"): string {
  return `NO ${formatOrgNumber(ORG_NUMBER)}`;
}

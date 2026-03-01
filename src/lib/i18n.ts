export type Locale = "no" | "en";

export const DEFAULT_LOCALE: Locale = "no";
export const LOCALE_PREFIX = "/en";

/** pathname = /en/tjenester -> "en"; /tjenester -> "no" */
export function getLocaleFromPath(pathname: string): Locale {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (normalized === LOCALE_PREFIX || normalized.startsWith(`${LOCALE_PREFIX}/`)) return "en";
  return "no";
}

/** pathname uten locale-prefix: /en/tjenester -> /tjenester, /en -> / */
export function getPathWithoutLocale(pathname: string): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p === LOCALE_PREFIX) return "/";
  if (p.startsWith(`${LOCALE_PREFIX}/`)) return p.slice(LOCALE_PREFIX.length) || "/";
  return p;
}

/** path med locale: withLocalePath("/tjenester", "en") -> "/en/tjenester"; "no" -> "/tjenester" */
export function withLocalePath(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return LOCALE_PREFIX + (clean || "");
  return clean || "/";
}

/** For site_copy-style: velg no eller en med fallback. */
export function tKey(
  no: string | null | undefined,
  en: string | null | undefined,
  locale: Locale
): string {
  if (locale === "en" && en != null && en !== "") return en;
  return no ?? "";
}

/** For DB-rader med field_no / field_en (eller field som no-fallback). */
export function tField(
  row: Record<string, unknown>,
  field: string,
  locale: Locale
): string {
  const enKey = `${field}_en`;
  const noKey = `${field}_no`;
  const baseKey = field;

  if (locale === "en") {
    const enVal = row[enKey];
    if (enVal != null && String(enVal).trim() !== "") return String(enVal);
  }
  const noVal = row[noKey];
  if (noVal != null && String(noVal).trim() !== "") return String(noVal);
  const baseVal = row[baseKey];
  return baseVal != null ? String(baseVal) : "";
}

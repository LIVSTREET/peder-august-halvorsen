export const SITE_NAME = "Alt jeg skaper";
export const PERSON_NAME = "Peder August Halvorsen";

export function getBaseUrl(): string {
  if (import.meta.env.VITE_SITE_URL) return import.meta.env.VITE_SITE_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function getCanonicalUrl(pathname: string): string {
  const base = getBaseUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
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

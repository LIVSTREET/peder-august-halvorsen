export function toExternalUrl(url: string): string {
  const trimmedUrl = url.trim();

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

const PROJECT_URL_FALLBACKS: Record<string, string> = {
  bilgarasjeno: "https://bilgarasje.no",
};

export function getProjectExternalUrl(
  url: string | null | undefined,
  slug: string,
): string | null {
  if (url?.trim()) {
    return toExternalUrl(url);
  }

  return PROJECT_URL_FALLBACKS[slug] ?? null;
}

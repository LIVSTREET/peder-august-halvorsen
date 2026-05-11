export const PROJECT_PRESENTATIONS = ["landscape", "portrait"] as const;
export type ProjectPresentation = (typeof PROJECT_PRESENTATIONS)[number];

const PORTRAIT_ALIASES = new Set(["portrait", "mobile", "app"]);

export function normalizePresentation(
  raw: string | null | undefined,
): ProjectPresentation {
  const v = (raw ?? "landscape").trim().toLowerCase();
  if (PORTRAIT_ALIASES.has(v)) return "portrait";
  return "landscape";
}

export function isPortraitPresentation(
  raw: string | null | undefined,
): boolean {
  return normalizePresentation(raw) === "portrait";
}
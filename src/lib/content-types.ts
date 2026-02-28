export const CONTENT_TYPES = [
  { value: "work", label: "Arbeid" },
  { value: "build", label: "Nå bygger jeg" },
  { value: "archive", label: "Arkiv" },
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number]["value"];

export const CONTENT_STATUSES = [
  { value: "draft", label: "Utkast" },
  { value: "published", label: "Publisert" },
] as const;

export const CONTENT_TYPE_ROUTES: Record<ContentType, { list: string; path: string }> = {
  work: { list: "/arbeid", path: "/arbeid" },
  build: { list: "/na-bygger-jeg", path: "/na-bygger-jeg" },
  archive: { list: "/arkiv", path: "/arkiv" },
};

export const TYPE_LABEL: Record<string, string> = {
  work: "Arbeid",
  build: "Nå bygger jeg",
  archive: "Arkiv",
};

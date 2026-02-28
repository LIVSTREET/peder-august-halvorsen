export const LEAD_STATUSES = [
  { value: "new", label: "Ny" },
  { value: "contacted", label: "Kontaktet" },
  { value: "warm", label: "Varm" },
  { value: "won", label: "Vunnet" },
  { value: "lost", label: "Tapt" },
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]["value"];

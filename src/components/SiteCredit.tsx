import type { Locale } from "@/lib/i18n";

const CREDIT = {
  no: { text: "Nettside levert av PAH Studio", url: "https://pederaugusthalvorsen.no" },
  en: { text: "Website built by PAH Studio", url: "https://pederaugusthalvorsen.no/en" },
} as const;

export function SiteCredit({ locale = "no" }: { locale?: Locale }) {
  const { text, url } = CREDIT[locale];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      aria-label={locale === "no" ? "Nettside levert av PAH Studio" : "Website built by PAH Studio"}
    >
      {text}
    </a>
  );
}

import { useLocale } from "@/contexts/LocaleContext";
import { tKey } from "@/lib/i18n";

export function HeroTechFooter() {
  const { locale } = useLocale();
  const items =
    locale === "en"
      ? ["Websites", "SEO", "Admin systems", "AI", "Automation"]
      : ["Nettsider", "SEO", "Adminsystem", "AI", "Automatisering"];
  const tagline = tKey(
    "Bygget for lokale bedrifter og moderne gründere.",
    "Built for local businesses and modern founders.",
    locale
  );

  return (
    <div className="border-t border-border/40 px-6 md:px-10 py-5 md:py-6 flex flex-col items-center text-center gap-2">
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] md:text-sm font-mono uppercase tracking-[0.18em] text-foreground/80">
        {items.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span>{label}</span>
            {i < items.length - 1 && <span className="text-primary/70">•</span>}
          </li>
        ))}
      </ul>
      <p className="text-xs md:text-sm font-body italic text-muted-foreground">
        {tagline}
      </p>
    </div>
  );
}
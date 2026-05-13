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
    <div className="border-t border-border/40 px-4 md:px-10 py-5 md:py-5 flex flex-col items-center text-center gap-3 md:gap-2">
      <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:gap-0 text-[10px] md:text-[13px] font-mono uppercase tracking-[0.18em] md:tracking-[0.22em] text-foreground/85">
        {items.map((label, i) => (
          <li key={label} className="flex items-center">
            <span className="px-2.5 md:px-4 py-1 md:py-0.5 rounded-full border border-border/50 md:border-0 bg-card/30 md:bg-transparent">
              {label}
            </span>
            {i < items.length - 1 && (
              <span aria-hidden="true" className="hidden md:inline text-primary/60 select-none">·</span>
            )}
          </li>
        ))}
      </ul>
      <p className="text-[11px] md:text-xs font-body italic text-muted-foreground/90 tracking-wide max-w-[28ch] md:max-w-none leading-snug">
        {tagline}
      </p>
    </div>
  );
}
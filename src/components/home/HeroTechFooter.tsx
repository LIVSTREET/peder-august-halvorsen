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
    <div className="border-t border-border/40 px-4 md:px-10 py-4 md:py-5 flex flex-col items-center text-center gap-2.5 md:gap-2">
      <ul className="flex flex-wrap items-center justify-center text-[10px] md:text-[13px] font-mono uppercase tracking-[0.2em] md:tracking-[0.22em] text-foreground/85">
        {items.map((label, i) => (
          <li key={label} className="flex items-center">
            <span className="px-2 md:px-4 py-0.5">{label}</span>
            {i < items.length - 1 && (
              <span aria-hidden="true" className="text-primary/60 select-none">·</span>
            )}
          </li>
        ))}
      </ul>
      <p className="text-[11px] md:text-xs font-body italic text-muted-foreground/90 tracking-wide max-w-[32ch] md:max-w-none leading-snug">
        {tagline}
      </p>
    </div>
  );
}
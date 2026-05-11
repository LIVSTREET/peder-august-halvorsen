import { SiteCredit } from "@/components/SiteCredit";
import { useLocale } from "@/contexts/LocaleContext";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/seo";

export default function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="border-t border-border mt-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-display font-bold text-lg text-foreground">
              {SITE_NAME}<span className="text-primary">.</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === "en"
                ? "Modern digital craft. Websites and digital systems for small businesses."
                : "Moderne digitalt håndverk. Nettsider og digitale systemer for små bedrifter."}
            </p>
          </div>
          <div>
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3">
              {locale === "en" ? "Contact" : "Kontakt"}
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-foreground hover:text-primary transition-colors">
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-xs text-muted-foreground/50 italic leading-relaxed">
              "I walk by faith, and not by sight"
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground/40 flex items-center gap-2">
            © {new Date().getFullYear()} · <SiteCredit locale={locale} /> · <a href="/dashboard" className="hover:text-muted-foreground/60 transition-colors">◆</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

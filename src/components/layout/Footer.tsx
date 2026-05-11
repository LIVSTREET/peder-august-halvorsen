import { SiteCredit } from "@/components/SiteCredit";
import { useLocale } from "@/contexts/LocaleContext";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/seo";
import { Link } from "react-router-dom";

export default function Footer() {
  const { locale, withLocalePath } = useLocale();

  const more = [
    { to: "/skriver", labelNo: "Skriver", labelEn: "Writing" },
    { to: "/arkiv", labelNo: "Arkiv", labelEn: "Archive" },
    { to: "/musikk", labelNo: "Musikk", labelEn: "Music" },
  ];
  const primary = [
    { to: "/tjenester", labelNo: "Tjenester", labelEn: "Services" },
    { to: "/prosjekter", labelNo: "Arbeid", labelEn: "Work" },
    { to: "/brief", labelNo: "Brief", labelEn: "Brief" },
    { to: "/prat", labelNo: "Prat", labelEn: "Chat" },
  ];

  return (
    <footer className="border-t border-border mt-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              {locale === "en" ? "Studio" : "Studio"}
            </p>
            <ul className="space-y-2">
              {primary.map((l) => (
                <li key={l.to}>
                  <Link to={withLocalePath(l.to)} className="text-sm text-foreground hover:text-primary transition-colors">
                    {locale === "en" ? l.labelEn : l.labelNo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3">
              {locale === "en" ? "More" : "Mer"}
            </p>
            <ul className="space-y-2">
              {more.map((l) => (
                <li key={l.to}>
                  <Link to={withLocalePath(l.to)} className="text-sm text-foreground hover:text-primary transition-colors">
                    {locale === "en" ? l.labelEn : l.labelNo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3">
              {locale === "en" ? "Contact" : "Kontakt"}
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-foreground hover:text-primary transition-colors">
              {CONTACT_EMAIL}
            </a>
            <p className="mt-2 text-xs text-muted-foreground/70 italic">
              {locale === "en" ? "Reply within 24h on weekdays" : "Svar innen 24 t på hverdager"}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-muted-foreground/40 flex items-center gap-2">
            © {new Date().getFullYear()} · <SiteCredit locale={locale} /> · <a href="/dashboard" className="hover:text-muted-foreground/60 transition-colors">◆</a>
          </p>
          <p className="text-xs text-muted-foreground/40 italic leading-relaxed">
            "I walk by faith, and not by sight"
          </p>
        </div>
      </div>
    </footer>
  );
}

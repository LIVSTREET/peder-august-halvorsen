import { SiteCredit } from "@/components/SiteCredit";
import { useLocale } from "@/contexts/LocaleContext";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY, SITE_NAME } from "@/lib/seo";
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
    { to: "/brief", labelNo: "Forespørsel", labelEn: "Request" },
    { to: "/prat", labelNo: "Prat", labelEn: "Chat" },
  ];

  return (
    <footer className="mt-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <div className="container max-w-[1280px] px-3 md:px-8 pt-3 pb-6 md:pt-2 md:pb-20">
        <div
          data-header-theme="dark"
          className="relative overflow-hidden rounded-[22px] md:rounded-[36px] border border-white/5 px-5 md:px-12 py-7 md:py-16"
          style={{
            backgroundColor: "#151311",
            boxShadow:
              "0 100px 180px -30px rgba(0,0,0,0.55), 0 50px 90px -20px rgba(0,0,0,0.4), 0 20px 40px -10px rgba(0,0,0,0.35), 0 0 140px rgba(120,70,30,0.08), 0 1px 0 hsl(30 30% 90% / 0.04) inset",
          }}
        >
        <div className="mb-6 pb-6 md:mb-12 md:pb-12 border-b border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
          <div className="max-w-md">
            <p className="font-display text-xl md:text-3xl font-extrabold tracking-tight text-foreground">
              {locale === "en" ? "Have a project in mind?" : "Har du noe på gang?"}
            </p>
            <p className="mt-1.5 text-[13px] md:text-sm text-muted-foreground">
              {locale === "en"
                ? "Send a short project request or book a no-commitment chat."
                : "Send en kort forespørsel eller book en uforpliktende prat."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Link
              to={withLocalePath("/brief")}
              className="inline-flex items-center whitespace-nowrap px-4 md:px-5 py-2 md:py-2.5 min-h-[40px] md:min-h-[44px] font-body text-[12px] md:text-sm font-medium tracking-wide uppercase border bg-primary text-primary-foreground border-primary hover:brightness-110 transition-all"
            >
              {locale === "en" ? "Send request" : "Send forespørsel"}
            </Link>
            <Link
              to={withLocalePath("/prat")}
              className="inline-flex items-center whitespace-nowrap px-4 md:px-5 py-2 md:py-2.5 min-h-[40px] md:min-h-[44px] font-body text-[12px] md:text-sm font-medium tracking-wide uppercase border bg-transparent text-foreground border-foreground/30 hover:border-primary hover:text-primary transition-all"
            >
              {locale === "en" ? "Book a chat" : "Book en prat"}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display font-bold text-base md:text-lg text-foreground">
              {SITE_NAME}<span className="text-primary">.</span>
            </p>
            <p className="mt-1.5 text-[13px] md:text-sm text-muted-foreground">
              {locale === "en"
                ? "Modern digital craft. Websites and digital systems for small businesses."
                : "Moderne digitalt håndverk. Nettsider og digitale systemer for små bedrifter."}
            </p>
          </div>
          <div>
            <p className="text-[11px] md:text-sm font-mono text-muted-foreground uppercase tracking-wider mb-2 md:mb-3">
              {locale === "en" ? "Studio" : "Studio"}
            </p>
            <ul className="space-y-1.5 md:space-y-2">
              {primary.map((l) => (
                <li key={l.to}>
                  <Link to={withLocalePath(l.to)} className="text-[13px] md:text-sm text-foreground hover:text-primary transition-colors">
                    {locale === "en" ? l.labelEn : l.labelNo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] md:text-sm font-mono text-muted-foreground uppercase tracking-wider mb-2 md:mb-3">
              {locale === "en" ? "More" : "Mer"}
            </p>
            <ul className="space-y-1.5 md:space-y-2">
              {more.map((l) => (
                <li key={l.to}>
                  <Link to={withLocalePath(l.to)} className="text-[13px] md:text-sm text-foreground hover:text-primary transition-colors">
                    {locale === "en" ? l.labelEn : l.labelNo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-[11px] md:text-sm font-mono text-muted-foreground uppercase tracking-wider mb-2 md:mb-3">
              {locale === "en" ? "Contact" : "Kontakt"}
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="block text-[13px] md:text-sm text-foreground hover:text-primary transition-colors break-all">
              {CONTACT_EMAIL}
            </a>
            {CONTACT_PHONE && (
              <a href={`tel:${CONTACT_PHONE}`} className="block mt-1 text-[13px] md:text-sm text-foreground hover:text-primary transition-colors">
                {CONTACT_PHONE_DISPLAY || CONTACT_PHONE}
              </a>
            )}
            <p className="mt-1.5 text-[11px] md:text-xs text-muted-foreground/70 italic">
              {locale === "en" ? "Reply within 24h on weekdays" : "Svar innen 24 t på hverdager"}
            </p>
          </div>
        </div>
        <div className="mt-6 md:mt-8 pt-3 md:pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">
          <p className="text-[10px] md:text-xs text-muted-foreground/40 flex items-center gap-2 flex-wrap">
            © {new Date().getFullYear()} · <SiteCredit locale={locale} /> · <a href="/dashboard" className="hover:text-muted-foreground/60 transition-colors">◆</a>
          </p>
          <p className="text-[10px] md:text-xs text-muted-foreground/40 italic leading-relaxed">
            "I walk by faith, and not by sight"
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}

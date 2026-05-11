import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import logoMark from "@/assets/logo-mark.png";

type NavLink = { to: string; labelNo: string; labelEn: string };

const primaryLinks: NavLink[] = [
  { to: "/tjenester", labelNo: "Tjenester", labelEn: "Services" },
  { to: "/prosjekter", labelNo: "Arbeid", labelEn: "Work" },
  { to: "/brief", labelNo: "Brief", labelEn: "Brief" },
  { to: "/prat", labelNo: "Prat", labelEn: "Chat" },
];

const moreLinks: NavLink[] = [
  { to: "/skriver", labelNo: "Skriver", labelEn: "Writing" },
  { to: "/arkiv", labelNo: "Arkiv", labelEn: "Archive" },
  { to: "/musikk", labelNo: "Musikk", labelEn: "Music" },
];

export default function Header() {
  const { pathname } = useLocation();
  const { locale, withLocalePath, switchLocaleUrl } = useLocale();
  const [moreOpen, setMoreOpen] = React.useState(false);

  const isActive = (to: string) => {
    const localized = withLocalePath(to);
    return pathname === localized;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border" style={{ paddingTop: 'env(safe-area-inset-top)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <div className="container flex items-center justify-between h-14">
        <Link
          to={withLocalePath("/")}
          className="flex items-center"
          aria-label="Studio P.A. Halvorsen"
        >
          <img
            src={logoMark}
            alt="Studio P.A. Halvorsen"
            className="h-20 md:h-28 w-auto -my-6 shrink-0"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {primaryLinks.map((l) => (
            <Link
              key={l.to}
              to={withLocalePath(l.to)}
              className={`text-sm font-body transition-colors ${
                isActive(l.to) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {locale === "en" ? l.labelEn : l.labelNo}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              className={`text-sm font-body transition-colors ${
                moreLinks.some((l) => isActive(l.to))
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((o) => !o)}
            >
              {locale === "en" ? "More" : "Mer"}
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full pt-2">
                <div className="min-w-[140px] bg-background border border-border shadow-md py-1">
                  {moreLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={withLocalePath(l.to)}
                      className={`block px-3 py-2 text-sm font-body transition-colors ${
                        isActive(l.to) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {locale === "en" ? l.labelEn : l.labelNo}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            to={switchLocaleUrl()}
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors ml-2"
          >
            {locale === "en" ? "NO" : "EN"}
          </Link>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  const { pathname } = useLocation();
  const { locale, withLocalePath, switchLocaleUrl } = useLocale();
  const [open, setOpen] = React.useState(false);

  const isActive = (to: string) => pathname === withLocalePath(to);
  const allLinks = [...primaryLinks, ...moreLinks];

  return (
    <div className="md:hidden flex items-center gap-2">
      <Link
        to={switchLocaleUrl()}
        className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
      >
        {locale === "en" ? "NO" : "EN"}
      </Link>
      <button onClick={() => setOpen(!open)} className="text-foreground p-3 -mr-3 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Meny">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" />
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-background border-b border-border py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <nav className="container flex flex-col">
            {allLinks.map((l) => (
              <Link
                key={l.to}
                to={withLocalePath(l.to)}
                onClick={() => setOpen(false)}
                className={`text-sm font-body py-3 min-h-[44px] flex items-center ${
                  isActive(l.to) ? "text-primary" : "text-muted-foreground active:text-foreground"
                }`}
              >
                {locale === "en" ? l.labelEn : l.labelNo}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

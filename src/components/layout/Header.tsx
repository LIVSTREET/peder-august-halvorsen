import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Hjem" },
  { to: "/tjenester", label: "Tjenester" },
  { to: "/prosjekter", label: "Prosjekter" },
  { to: "/arkiv", label: "Arkiv" },
  { to: "/skriver", label: "Skriver" },
  { to: "/musikk", label: "Musikk" },
  { to: "/prat", label: "Prat" },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="font-display font-bold text-lg text-foreground tracking-tight">
          ajs<span className="text-primary">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-body transition-colors ${
                pathname === l.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="text-foreground p-2" aria-label="Meny">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" />
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-background border-b border-border py-4">
          <nav className="container flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-body ${
                  pathname === l.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

import React from "react";

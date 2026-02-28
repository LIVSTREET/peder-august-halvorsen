import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { DashboardCommandPalette } from "@/components/dashboard/DashboardCommandPalette";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/dashboard", end: true, label: "Oversikt" },
  { to: "/dashboard/projects", end: false, label: "Prosjekter" },
  { to: "/dashboard/posts", end: false, label: "Skriver" },
  { to: "/dashboard/content", end: false, label: "Innhold" },
  { to: "/dashboard/archive", end: false, label: "Arkiv" },
  { to: "/dashboard/leads", end: false, label: "Leads" },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <DashboardCommandPalette />

      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between border-b border-border px-4 h-12 shrink-0">
        <span className="font-display font-bold text-foreground text-sm tracking-wide uppercase">
          Kontrollrom
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Meny"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile nav overlay */}
      {open && (
        <nav className="md:hidden border-b border-border bg-background px-4 py-3 space-y-1">
          {nav.map(({ to, end, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block text-sm py-2 px-3 rounded-md transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 mt-2 border-t border-border space-y-1">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-3"
            >
              ← Til forsiden
            </Link>
            <button
              onClick={() => { setOpen(false); supabase.auth.signOut(); }}
              className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-3"
            >
              Logg ut
            </button>
          </div>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border flex-col">
        <div className="p-5 border-b border-border">
          <span className="font-display font-bold text-foreground text-sm tracking-wide uppercase">
            Kontrollrom
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, end, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "block text-sm py-2 px-3 -mx-1 rounded-md transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <Link
            to="/"
            className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Til forsiden
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Logg ut
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { Outlet, NavLink, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { DashboardCommandPalette } from "@/components/dashboard/DashboardCommandPalette";

const nav = [
  { to: "/dashboard", end: true, label: "Oversikt" },
  { to: "/dashboard/projects", end: false, label: "Prosjekter" },
  { to: "/dashboard/posts", end: false, label: "Skriver" },
  { to: "/dashboard/content", end: false, label: "Innhold" },
  { to: "/dashboard/archive", end: false, label: "Arkiv" },
  { to: "/dashboard/leads", end: false, label: "Leads" },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      <DashboardCommandPalette />
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border flex flex-col">
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
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

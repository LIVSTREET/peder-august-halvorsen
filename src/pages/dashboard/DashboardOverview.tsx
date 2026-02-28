import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function fetchCounts() {
  const [p, po, a, b] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("archive_items").select("id", { count: "exact", head: true }),
    supabase.from("brief_submissions").select("id", { count: "exact", head: true }),
  ]);
  return {
    projects: p.count ?? 0,
    posts: po.count ?? 0,
    archive: a.count ?? 0,
    leads: b.count ?? 0,
  };
}

async function fetchRecentLeads() {
  const { data, error } = await supabase
    .from("brief_submissions")
    .select("id, name, email, goal, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data ?? [];
}

export default function DashboardOverview() {
  const { data: counts, isLoading: countsLoading } = useQuery({
    queryKey: ["dashboard", "counts"],
    queryFn: fetchCounts,
  });
  const { data: recentLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ["dashboard", "recent-leads"],
    queryFn: fetchRecentLeads,
  });

  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">Oversikt</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Rask status på innhold og leads.
        </p>
      </div>

      {/* Counts */}
      <section className="space-y-3">
        <h2 className="font-display text-base md:text-lg font-semibold text-foreground">Antall</h2>
        {countsLoading ? (
          <p className="text-muted-foreground text-sm">Laster…</p>
        ) : counts ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <CountBlock label="Prosjekter" value={counts.projects} />
            <CountBlock label="Innlegg" value={counts.posts} />
            <CountBlock label="Arkiv" value={counts.archive} />
            <CountBlock label="Leads" value={counts.leads} />
          </div>
        ) : null}
      </section>

      {/* Recent leads */}
      <section className="space-y-3">
        <h2 className="font-display text-base md:text-lg font-semibold text-foreground">Siste aktivitet</h2>
        {leadsLoading ? (
          <p className="text-muted-foreground text-sm">Laster…</p>
        ) : recentLeads && recentLeads.length > 0 ? (
          <div className="space-y-2">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-border text-sm"
              >
                <span className="text-foreground font-medium">
                  {lead.name ?? "—"}
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm truncate">{lead.email ?? ""}</span>
                <span className="text-muted-foreground text-xs sm:text-sm hidden sm:inline">{lead.goal ?? ""}</span>
                <span className="text-muted-foreground/60 sm:ml-auto text-xs">
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleDateString("nb-NO")
                    : ""}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Ingen nylig aktivitet.</p>
        )}
      </section>
    </div>
  );
}

function CountBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border rounded-md p-3 md:p-4">
      <p className="text-muted-foreground text-xs font-mono uppercase">{label}</p>
      <p className="font-display text-xl md:text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}

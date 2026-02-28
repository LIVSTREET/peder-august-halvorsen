import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardLeads, useUpdateLead } from "@/hooks/useDashboardLeads";
import { GOALS } from "@/lib/brief-labels";
import { LEAD_STATUSES } from "@/lib/lead-status";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LeadsTableSkeleton } from "@/components/dashboard/LeadsTableSkeleton";
import { copiedToast } from "@/lib/dashboard-toast";
import { getBaseUrl } from "@/lib/seo";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("nb-NO", { day: "2-digit", month: "short" });
}

export default function DashboardLeads() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: leads, isLoading } = useDashboardLeads();
  const updateLead = useUpdateLead();

  const filtered =
    leads?.filter((l) => {
      if (statusFilter !== "all" && (l as Record<string, unknown>).status !== statusFilter) return false;
      return true;
    }) ?? [];

  function copyMail(email: string | null) {
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => copiedToast("E-post i utklippstavle"));
  }

  function handleStatusChange(leadId: string, status: string) {
    updateLead.mutate({ id: leadId, status: status as "new" | "contacted" | "warm" | "won" | "lost" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground text-sm hidden sm:block">Brief-innsendelser. Status og hurtighandlinger.</p>
      </div>

      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LeadsTableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="font-display text-lg text-muted-foreground">Ingen leads enda</p>
          <p className="text-sm text-muted-foreground/60">Del lenken under for å samle inn brief fra besøkende.</p>
          <p className="text-xs font-mono text-muted-foreground break-all">{getBaseUrl()}/brief</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigator.clipboard.writeText(`${getBaseUrl()}/brief`).then(() => copiedToast("Brief-lenke i utklippstavlen"))
            }
          >
            Kopier lenke
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((lead) => (
            <div key={lead.id} className="border border-border rounded-md p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{lead.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground truncate">{lead.email ?? ""}</p>
                </div>
                <span className="text-xs text-muted-foreground/60 shrink-0">{formatDate(lead.created_at)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{GOALS[lead.goal ?? ""] ?? lead.goal ?? "—"}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={(lead as Record<string, unknown>).status as string ?? "new"}
                  onValueChange={(v) => handleStatusChange(lead.id, v)}
                >
                  <SelectTrigger className="w-[110px] h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => copyMail(lead.email)}>Kopier mail</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link to={`/dashboard/leads/${lead.id}`}>Åpne</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

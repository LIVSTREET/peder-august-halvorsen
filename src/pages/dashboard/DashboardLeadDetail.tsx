import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDashboardLead, useUpdateLead } from "@/hooks/useDashboardLeads";
import { GOALS, STAGES, PRIORITIES, BUDGETS } from "@/lib/brief-labels";
import { LEAD_STATUSES } from "@/lib/lead-status";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildSummary(lead: {
  name?: string | null;
  email?: string | null;
  goal?: string | null;
  stage?: string | null;
  priority?: string | null;
  budget_mode?: string | null;
  details?: string | null;
  created_at?: string | null;
}) {
  const lines = [
    `Brief fra ${lead.name ?? "—"} (${lead.email ?? "—"})`,
    `Mål: ${GOALS[lead.goal ?? ""] ?? lead.goal ?? "—"}`,
    `Fase: ${STAGES[lead.stage ?? ""] ?? lead.stage ?? "—"}`,
    `Prioritet: ${PRIORITIES[lead.priority ?? ""] ?? lead.priority ?? "—"}`,
    `Budsjett: ${BUDGETS[lead.budget_mode ?? ""] ?? lead.budget_mode ?? "—"}`,
    lead.details ? `Detaljer:\n${lead.details}` : "",
    lead.created_at ? `Innsendt: ${formatDate(lead.created_at)}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

function buildMailto(lead: { name?: string | null; email?: string | null }) {
  const subject = encodeURIComponent(`Brief: ${lead.name ?? "Ny lead"}`);
  const body = encodeURIComponent(
    `Hei,\n\nTakk for at du sendte inn brief. Jeg vil gjerne ta en prat.\n\nMvh`
  );
  return lead.email
    ? `mailto:${lead.email}?subject=${subject}&body=${body}`
    : `mailto:?subject=${subject}&body=${body}`;
}

export default function DashboardLeadDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: lead, isLoading } = useDashboardLead(id);
  const updateLead = useUpdateLead();
  const { toast } = useToast();

  function handleCopy() {
    if (!lead) return;
    navigator.clipboard.writeText(buildSummary(lead)).then(() => {
      toast({ title: "Kopiert til utklippstavlen" });
    });
  }

  function handleStatusChange(status: string) {
    if (!id) return;
    updateLead.mutate(
      { id, status: status as "new" | "contacted" | "warm" | "won" | "lost" },
      { onSuccess: () => toast({ title: "Status oppdatert" }) }
    );
  }

  if (isLoading || !lead) {
    return (
      <div className="py-10">
        <p className="text-muted-foreground text-sm">Laster…</p>
      </div>
    );
  }

  const currentStatus = (lead as Record<string, unknown>).status as string ?? "new";

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/dashboard/leads"
          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Leads
        </Link>
      </div>

      <h1 className="font-display text-2xl font-bold text-foreground">
        Brief: {lead.name ?? lead.email ?? lead.id}
      </h1>

      <div className="flex gap-2 items-center">
        <Select value={currentStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          Kopier sammendrag
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={buildMailto(lead)}>Send e-post</a>
        </Button>
      </div>

      <div className="divide-y divide-border">
        <Row label="Navn" value={lead.name ?? "—"} />
        <Row label="E-post" value={lead.email ?? "—"} />
        <Row label="Telefon" value={lead.phone ?? "—"} />
        <Row label="Mål" value={GOALS[lead.goal ?? ""] ?? lead.goal ?? "—"} />
        <Row label="Fase" value={STAGES[lead.stage ?? ""] ?? lead.stage ?? "—"} />
        <Row label="Prioritet" value={PRIORITIES[lead.priority ?? ""] ?? lead.priority ?? "—"} />
        <Row label="Budsjett" value={BUDGETS[lead.budget_mode ?? ""] ?? lead.budget_mode ?? "—"} />
        <Row label="Detaljer" value={lead.details ?? "—"} />
        <Row label="Innsendt" value={formatDate(lead.created_at)} />
        {lead.ai_summary && <Row label="AI-sammendrag" value={lead.ai_summary} />}
        {(lead as Record<string, unknown>).updated_at && (
          <Row label="Oppdatert" value={formatDate((lead as Record<string, unknown>).updated_at as string)} />
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3">
      <span className="font-mono text-xs text-muted-foreground uppercase w-24 shrink-0 pt-0.5">
        {label}
      </span>
      <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
    </div>
  );
}

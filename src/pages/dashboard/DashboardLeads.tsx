import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardLeads, useUpdateLead } from "@/hooks/useDashboardLeads";
import { GOALS } from "@/lib/brief-labels";
import { LEAD_STATUSES } from "@/lib/lead-status";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardLeads() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { data: leads, isLoading } = useDashboardLeads();
  const updateLead = useUpdateLead();

  const filtered =
    leads?.filter((l) => {
      if (statusFilter !== "all" && (l as Record<string, unknown>).status !== statusFilter) return false;
      return true;
    }) ?? [];

  function copyMail(email: string | null) {
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => {
      toast({ title: "Kopiert", description: "E-post i utklippstavle" });
    });
  }

  function handleStatusChange(leadId: string, status: string) {
    updateLead.mutate(
      { id: leadId, status: status as "new" | "contacted" | "warm" | "won" | "lost" },
      { onSuccess: () => toast({ title: "Oppdatert" }) }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground text-sm">Brief-innsendelser. Status og hurtighandlinger.</p>
      </div>

      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
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
        <p className="text-muted-foreground text-sm">Laster…</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mål</TableHead>
              <TableHead>Navn</TableHead>
              <TableHead>E-post</TableHead>
              <TableHead>Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(lead.created_at)}
                </TableCell>
                <TableCell>
                  <Select
                    value={(lead as Record<string, unknown>).status as string ?? "new"}
                    onValueChange={(v) => handleStatusChange(lead.id, v)}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{GOALS[lead.goal ?? ""] ?? lead.goal ?? "—"}</TableCell>
                <TableCell>{lead.name ?? "—"}</TableCell>
                <TableCell>{lead.email ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => copyMail(lead.email)}>
                      Kopier mail
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/dashboard/leads/${lead.id}`}>Åpne</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

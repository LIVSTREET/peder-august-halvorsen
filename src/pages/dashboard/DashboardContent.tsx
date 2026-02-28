import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardContentItems } from "@/hooks/useContentItems";
import { CONTENT_TYPES, CONTENT_STATUSES, TYPE_LABEL } from "@/lib/content-types";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ContentListSkeleton } from "@/components/dashboard/ContentListSkeleton";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("nb-NO", { day: "2-digit", month: "short" });
}

export default function DashboardContent() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filters = {
    type: typeFilter !== "all" ? (typeFilter as "work" | "build" | "archive") : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  };
  const { data: items, isLoading } = useDashboardContentItems(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">Innhold</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Arbeid, Nå bygger jeg, Arkiv.</p>
        </div>
        <Button size="sm" className="shrink-0" onClick={() => navigate("/dashboard/content/new")}>Nytt innhold</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle typer</SelectItem>
            {CONTENT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            {CONTENT_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <ContentListSkeleton />
      ) : (
        <div className="space-y-2">
          {items?.map((row: any) => (
            <div
              key={row.id}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 px-3 border border-border rounded-md"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{row.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{TYPE_LABEL[row.type] ?? row.type}</span>
                  <span>·</span>
                  <span>{row.status}</span>
                  <span>·</span>
                  <span>{formatDate(row.updated_at)}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="self-end sm:self-auto" onClick={() => navigate(`/dashboard/content/${row.id}`)}>
                Rediger
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

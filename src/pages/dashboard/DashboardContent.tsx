import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDashboardContentItems } from "@/hooks/useContentItems";
import { CONTENT_TYPES, CONTENT_STATUSES, TYPE_LABEL } from "@/lib/content-types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ContentListSkeleton } from "@/components/dashboard/ContentListSkeleton";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("nb-NO", { day: "2-digit", month: "short", year: "numeric" });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Innhold</h1>
          <p className="text-sm text-muted-foreground">Arbeid, Nå bygger jeg, Arkiv.</p>
        </div>
        <Button size="sm" onClick={() => navigate("/dashboard/content/new")}>Nytt innhold</Button>
      </div>

      <div className="flex gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle typer</SelectItem>
            {CONTENT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tittel</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Oppdatert</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((row: any) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.title}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{TYPE_LABEL[row.type] ?? row.type}</TableCell>
                <TableCell className="text-xs">{row.status}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(row.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/content/${row.id}`)}>
                    Rediger
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardProjects } from "@/hooks/useDashboardProjects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const STATUS_OPTIONS = [
  { value: "draft", label: "Utkast" },
  { value: "published", label: "Publisert" },
  { value: "archived", label: "Arkivert" },
] as const;

export default function DashboardProjects() {
  const { data: projects, isLoading, setStatus } = useDashboardProjects();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(projectId: string, value: string) {
    if (!["draft", "published", "archived"].includes(value)) return;
    setUpdatingId(projectId);
    try {
      await setStatus({ id: projectId, status: value as "draft" | "published" | "archived" });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Prosjekter</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Alle prosjekter. Bytt status og rediger.
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Laster…</p>
      ) : (
        <div className="space-y-2">
          {projects?.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 py-3 px-4 border border-border rounded-md"
            >
              <div className="flex-1 min-w-0">
                <Link
                  to={`/dashboard/projects/${p.id}`}
                  className="text-foreground font-medium text-sm hover:text-primary transition-colors"
                >
                  {p.title}
                </Link>
                <p className="text-muted-foreground text-xs font-mono">{p.slug}</p>
              </div>

              <Select
                value={p.status}
                onValueChange={(v) => handleStatusChange(p.id, v)}
                disabled={updatingId === p.id}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge variant="outline" className="text-xs">
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

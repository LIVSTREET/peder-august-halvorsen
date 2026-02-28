import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardPosts } from "@/hooks/useDashboardPosts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "draft", label: "Utkast" },
  { value: "published", label: "Publisert" },
  { value: "archived", label: "Arkivert" },
] as const;

export default function DashboardPosts() {
  const { data: posts, isLoading, setStatus } = useDashboardPosts();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(postId: string, value: string, publishedAt: string | null) {
    if (!value || !["draft", "published", "archived"].includes(value)) return;
    setUpdatingId(postId);
    try {
      await setStatus({
        id: postId,
        status: value as "draft" | "published" | "archived",
        publishedAt,
      });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Skriver</h1>
          <p className="text-muted-foreground text-sm">Alle innlegg. Bytt status eller rediger.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/dashboard/posts/new">Nytt innlegg</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Laster…</p>
      ) : (
        <ul className="divide-y divide-border">
          {posts?.map((p) => (
            <li key={p.id} className="flex items-center gap-4 py-3">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/dashboard/posts/${p.id}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-muted-foreground font-mono">{p.slug}</p>
              </div>
              <Select
                value={p.status}
                onValueChange={(v) => handleStatusChange(p.id, v, p.published_at)}
                disabled={updatingId === p.id}
              >
                <SelectTrigger className="w-32">
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
              <Badge variant="outline">{p.status}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

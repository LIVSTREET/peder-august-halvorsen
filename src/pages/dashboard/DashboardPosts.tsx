import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDashboardPosts } from "@/hooks/useDashboardPosts";
import { PostsListSkeleton } from "@/components/dashboard/PostsListSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "draft", label: "Utkast" },
  { value: "published", label: "Publisert" },
  { value: "archived", label: "Arkivert" },
] as const;

export default function DashboardPosts() {
  const { data: posts, isLoading, setStatus } = useDashboardPosts();
  const navigate = useNavigate();
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
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">Skriver</h1>
          <p className="text-muted-foreground text-sm hidden sm:block">Alle innlegg. Bytt status eller rediger.</p>
        </div>
        <Button size="sm" className="shrink-0" onClick={() => navigate("/dashboard/posts/new")}>Nytt innlegg</Button>
      </div>

      {isLoading ? (
        <PostsListSkeleton />
      ) : (
        <ul className="divide-y divide-border">
          {posts?.map((p) => (
            <li key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/dashboard/posts/${p.id}`}
                  className="font-medium text-foreground hover:underline text-sm"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-muted-foreground font-mono truncate">{p.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={p.status}
                  onValueChange={(v) => handleStatusChange(p.id, v, p.published_at)}
                  disabled={updatingId === p.id}
                >
                  <SelectTrigger className="w-[120px] h-8 text-xs">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/dashboard/posts/${p.id}`)}
                >
                  Rediger
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

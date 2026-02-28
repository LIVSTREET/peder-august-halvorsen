import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDashboardPosts } from "@/hooks/useDashboardPosts";
import { PostsListSkeleton } from "@/components/dashboard/PostsListSkeleton";
import { PostQuickEditDialog } from "@/components/dashboard/PostQuickEditDialog";
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
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<{
    id: string; title: string; slug: string;
    status: "draft" | "published" | "archived"; published_at: string | null;
  } | null>(null);

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

  function openCreate() {
    setEditingPost(null);
    setDialogOpen(true);
  }

  function openEdit(p: typeof editingPost) {
    setEditingPost(p);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <PostQuickEditDialog
        post={editingPost}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={(id) => navigate(`/dashboard/posts/${id}`)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Skriver</h1>
          <p className="text-muted-foreground text-sm">Alle innlegg. Bytt status eller rediger.</p>
        </div>
        <Button size="sm" onClick={openCreate}>Nytt innlegg</Button>
      </div>

      {isLoading ? (
        <PostsListSkeleton />
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEdit({
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  status: p.status,
                  published_at: p.published_at,
                })}
              >
                Rediger
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

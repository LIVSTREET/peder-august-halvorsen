import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { slugify } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS = [
  { value: "draft", label: "Utkast" },
  { value: "published", label: "Publisert" },
  { value: "archived", label: "Arkivert" },
] as const;

export default function DashboardPostEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content_md: "",
    status: "draft" as "draft" | "published" | "archived",
  });
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [newTagLabel, setNewTagLabel] = useState("");

  const { data: post, isLoading } = useQuery({
    queryKey: ["dashboard", "post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tags").select("*").order("label");
      if (error) throw error;
      return data;
    },
  });

  const { data: postTags = [] } = useQuery({
    queryKey: ["post_tags", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_tags")
        .select("tag_id")
        .eq("post_id", id!);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!post) return;
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content_md: post.content_md ?? "",
      status: post.status as "draft" | "published" | "archived",
    });
    setTagIds(postTags?.map((pt) => pt.tag_id) ?? []);
  }, [post, postTags]);

  const updateMutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      const { data, error } = await supabase
        .from("posts")
        .update({
          title: payload.title,
          slug: payload.slug,
          excerpt: payload.excerpt || null,
          content_md: payload.content_md || null,
          status: payload.status,
          ...(payload.status === "published" && !post?.published_at
            ? { published_at: new Date().toISOString() }
            : {}),
        })
        .eq("id", id!)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard", "posts"] });
      qc.invalidateQueries({ queryKey: ["dashboard", "post", id] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const syncTagsMutation = useMutation({
    mutationFn: async (newTagIds: string[]) => {
      const { data: existing } = await supabase
        .from("post_tags")
        .select("tag_id")
        .eq("post_id", id!);
      const existingIds = new Set((existing ?? []).map((r) => r.tag_id));
      const toAdd = newTagIds.filter((tid) => !existingIds.has(tid));
      const toRemove = [...existingIds].filter((tid) => !newTagIds.includes(tid));

      for (const tagId of toRemove) {
        await supabase.from("post_tags").delete().eq("post_id", id!).eq("tag_id", tagId);
      }
      for (const tagId of toAdd) {
        await supabase.from("post_tags").insert({ post_id: id!, tag_id: tagId });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["post_tags", id] });
    },
  });

  const addTagMutation = useMutation({
    mutationFn: async (label: string) => {
      const slug = slugify(label);
      const { data, error } = await supabase
        .from("tags")
        .insert({ label, slug })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (newTag) => {
      qc.invalidateQueries({ queryKey: ["tags"] });
      setTagIds((prev) => (prev.includes(newTag.id) ? prev : [...prev, newTag.id]));
      setNewTagLabel("");
    },
  });

  if (isLoading || !post) {
    return (
      <div className="py-10">
        <p className="text-muted-foreground text-sm">Laster…</p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateMutation.mutate(form);
    syncTagsMutation.mutate(tagIds);
  }

  function onTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: slugify(title) || f.slug,
    }));
  }

  const selectedTags = tags.filter((t) => tagIds.includes(t.id));

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => navigate("/dashboard/posts")}
          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Skriver
        </button>
      </div>

      <h1 className="font-display text-2xl font-bold text-foreground">
        Rediger innlegg
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="title">Tittel</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Utdrag</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content_md">Innhold (Markdown)</Label>
          <Textarea
            id="content_md"
            value={form.content_md}
            onChange={(e) => setForm((f) => ({ ...f, content_md: e.target.value }))}
            rows={14}
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, status: v as typeof form.status }))
            }
          >
            <SelectTrigger>
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
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1 rounded border border-border bg-muted/50 px-2 py-1 text-sm"
              >
                {t.label}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setTagIds((prev) => prev.filter((tid) => tid !== t.id))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Select
            value=""
            onValueChange={(tagId) => {
              if (tagId && !tagIds.includes(tagId)) setTagIds((prev) => [...prev, tagId]);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Velg tag" />
            </SelectTrigger>
            <SelectContent>
              {tags
                .filter((t) => !tagIds.includes(t.id))
                .map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 mt-2">
            <Input
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              placeholder="Ny tag (label)"
              className="w-48"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!newTagLabel.trim() || addTagMutation.isPending}
              onClick={() => addTagMutation.mutate(newTagLabel.trim())}
            >
              {addTagMutation.isPending ? "Legger til…" : "Legg til tag"}
            </Button>
          </div>
        </div>

        {updateMutation.isSuccess && (
          <p className="text-sm text-primary">Lagret.</p>
        )}
        {updateMutation.isError && (
          <p className="text-sm text-destructive">Noe gikk galt.</p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Lagrer…" : "Lagre"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={`/skriver/${post.slug}`} target="_blank">
              Forhåndsvis
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

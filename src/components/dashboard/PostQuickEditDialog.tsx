import { useState, useEffect } from "react";
import { slugify } from "@/lib/slug";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { savedToast, errorToast, createdToast } from "@/lib/dashboard-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS = [
  { value: "draft", label: "Utkast" },
  { value: "published", label: "Publisert" },
  { value: "archived", label: "Arkivert" },
] as const;

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
};

type Props = {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string) => void;
};

export function PostQuickEditDialog({ post, open, onOpenChange, onCreated }: Props) {
  const qc = useQueryClient();
  const isEdit = !!post;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content_md: "",
    status: "draft" as "draft" | "published" | "archived",
  });
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tags").select("*").order("label");
      if (error) throw error;
      return data;
    },
  });

  const { data: postTags = [] } = useQuery({
    queryKey: ["post_tags", post?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("post_tags").select("tag_id").eq("post_id", post!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!post?.id,
  });

  useEffect(() => {
    if (!open) return;
    if (post) {
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content_md: post.content_md ?? "",
        status: post.status,
      });
      setTagIds(postTags.map((pt) => pt.tag_id));
    } else {
      setForm({ title: "", slug: "", excerpt: "", content_md: "", status: "draft" });
      setTagIds([]);
    }
  }, [open, post, postTags]);

  async function syncTags(postId: string, newTagIds: string[]) {
    const { data: existing } = await supabase.from("post_tags").select("tag_id").eq("post_id", postId);
    const existingIds = new Set((existing ?? []).map((r) => r.tag_id));
    const toAdd = newTagIds.filter((tid) => !existingIds.has(tid));
    const toRemove = [...existingIds].filter((tid) => !newTagIds.includes(tid));
    for (const tagId of toRemove) {
      await supabase.from("post_tags").delete().eq("post_id", postId).eq("tag_id", tagId);
    }
    for (const tagId of toAdd) {
      await supabase.from("post_tags").insert({ post_id: postId, tag_id: tagId });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title.trim() || "Uten tittel",
      slug: form.slug.trim() || slugify(form.title) || "uten-tittel",
      excerpt: form.excerpt.trim() || null,
      content_md: form.content_md.trim() || null,
      status: form.status,
      ...(form.status === "published" && (!post || !post.published_at)
        ? { published_at: new Date().toISOString() }
        : {}),
    };

    if (isEdit) {
      const { error } = await supabase.from("posts").update(payload).eq("id", post!.id);
      if (error) { setSubmitting(false); errorToast(error.message); return; }
      await syncTags(post!.id, tagIds);
      setSubmitting(false);
      savedToast();
    } else {
      const { data, error } = await supabase.from("posts").insert(payload).select().single();
      if (error) { setSubmitting(false); errorToast(error.message); return; }
      await syncTags(data.id, tagIds);
      setSubmitting(false);
      createdToast("Innlegg opprettet");
      onCreated?.(data.id);
    }

    qc.invalidateQueries({ queryKey: ["dashboard", "posts"] });
    qc.invalidateQueries({ queryKey: ["posts"] });
    qc.invalidateQueries({ queryKey: ["post_tags"] });
    onOpenChange(false);
  }

  async function handleAddTag() {
    if (!newTagLabel.trim()) return;
    const slug = slugify(newTagLabel.trim());
    const { data, error } = await supabase.from("tags").insert({ label: newTagLabel.trim(), slug }).select().single();
    if (error) { errorToast(error.message); return; }
    qc.invalidateQueries({ queryKey: ["tags"] });
    setTagIds((prev) => [...prev, data.id]);
    setNewTagLabel("");
  }

  const selectedTags = tags.filter((t) => tagIds.includes(t.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Rediger innlegg" : "Nytt innlegg"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="poq-title">Tittel</Label>
            <Input
              id="poq-title"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  ...(!isEdit ? { slug: slugify(title) || f.slug } : {}),
                }));
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="poq-slug">Slug</Label>
            <Input
              id="poq-slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="poq-excerpt">Utdrag</Label>
            <Textarea
              id="poq-excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="poq-content">Innhold (Markdown)</Label>
            <Textarea
              id="poq-content"
              value={form.content_md}
              onChange={(e) => setForm((f) => ({ ...f, content_md: e.target.value }))}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v as typeof form.status }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((t) => (
                <span key={t.id} className="inline-flex items-center gap-1 border border-border bg-muted/50 px-2 py-1 text-sm">
                  {t.label}
                  <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setTagIds((prev) => prev.filter((tid) => tid !== t.id))}>×</button>
                </span>
              ))}
            </div>
            <Select value="" onValueChange={(tagId) => { if (tagId && !tagIds.includes(tagId)) setTagIds((prev) => [...prev, tagId]); }}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Velg tag" /></SelectTrigger>
              <SelectContent>
                {tags.filter((t) => !tagIds.includes(t.id)).map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 mt-2">
              <Input value={newTagLabel} onChange={(e) => setNewTagLabel(e.target.value)} placeholder="Ny tag" className="w-48" />
              <Button type="button" variant="outline" size="sm" disabled={!newTagLabel.trim()} onClick={handleAddTag}>Legg til</Button>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Avbryt</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Lagrer…" : isEdit ? "Lagre" : "Opprett"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

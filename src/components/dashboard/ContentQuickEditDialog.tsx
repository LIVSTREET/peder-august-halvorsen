import { useState, useEffect } from "react";
import { slugify } from "@/lib/slug";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { savedToast, errorToast, createdToast } from "@/lib/dashboard-toast";
import { CONTENT_TYPES, CONTENT_STATUSES } from "@/lib/content-types";
import { useDashboardProjects } from "@/hooks/useDashboardProjects";
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

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  excerpt: string | null;
  body: string | null;
  project_id: string | null;
};

type Props = {
  item: ContentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string) => void;
};

export function ContentQuickEditDialog({ item, open, onOpenChange, onCreated }: Props) {
  const qc = useQueryClient();
  const isEdit = !!item;
  const projectsQuery = useDashboardProjects();
  const projectsList = projectsQuery.data ?? [];

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "build" as "work" | "build" | "archive",
    status: "draft" as "draft" | "published",
    excerpt: "",
    body: "",
    project_id: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setForm({
        title: item.title,
        slug: item.slug,
        type: item.type as typeof form.type,
        status: item.status as typeof form.status,
        excerpt: item.excerpt ?? "",
        body: item.body ?? "",
        project_id: item.project_id ?? "",
      });
    } else {
      setForm({ title: "", slug: "", type: "build", status: "draft", excerpt: "", body: "", project_id: "" });
    }
  }, [open, item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title.trim() || "Uten tittel",
      slug: form.slug.trim() || slugify(form.title) || "innlegg",
      type: form.type,
      status: form.status,
      excerpt: form.excerpt.trim() || null,
      body: form.body.trim() || null,
      project_id: form.project_id || null,
    } as any;

    if (isEdit) {
      const { error } = await supabase.from("content_items").update(payload).eq("id", item!.id);
      setSubmitting(false);
      if (error) { errorToast(error.message); return; }
      savedToast();
    } else {
      const { data, error } = await supabase.from("content_items").insert(payload).select().single();
      setSubmitting(false);
      if (error) { errorToast(error.message); return; }
      createdToast("Innhold opprettet");
      onCreated?.(data.id);
    }

    qc.invalidateQueries({ queryKey: ["dashboard", "content"] });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Rediger innhold" : "Nytt innhold"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cq-title">Tittel</Label>
            <Input
              id="cq-title"
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
            <Label htmlFor="cq-slug">Slug</Label>
            <Input
              id="cq-slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((f) => ({ ...f, type: v as typeof form.type }))}
                disabled={isEdit}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as typeof form.status }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Prosjekt</Label>
            <Select
              value={form.project_id || "none"}
              onValueChange={(v) => setForm((f) => ({ ...f, project_id: v === "none" ? "" : v }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ingen</SelectItem>
                {projectsList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cq-excerpt">Utdrag</Label>
            <Textarea
              id="cq-excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Innhold (Markdown)</Label>
            <Textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={10}
              className="font-mono text-sm"
            />
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

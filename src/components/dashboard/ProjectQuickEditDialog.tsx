import { useState, useEffect } from "react";
import { slugify } from "@/lib/slug";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
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

type Project = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  role: string | null;
  tech: string | null;
  url: string | null;
  status: "draft" | "published" | "archived";
};

type Props = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string) => void;
};

export function ProjectQuickEditDialog({ project, open, onOpenChange, onCreated }: Props) {
  const qc = useQueryClient();
  const isEdit = !!project;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    role: "",
    tech: "",
    url: "",
    status: "draft" as "draft" | "published" | "archived",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (project) {
      setForm({
        title: project.title,
        slug: project.slug,
        subtitle: project.subtitle ?? "",
        description: project.description ?? "",
        role: project.role ?? "",
        tech: project.tech ?? "",
        url: project.url ?? "",
        status: project.status,
      });
    } else {
      setForm({ title: "", slug: "", subtitle: "", description: "", role: "", tech: "", url: "", status: "draft" });
    }
  }, [open, project]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title.trim() || "Uten tittel",
      slug: form.slug.trim() || slugify(form.title) || "prosjekt",
      subtitle: form.subtitle.trim() || null,
      description: form.description.trim() || null,
      role: form.role.trim() || null,
      tech: form.tech.trim() || null,
      url: form.url.trim() || null,
      status: form.status,
      ...(form.status === "published" ? { published_at: new Date().toISOString() } : {}),
    };

    if (isEdit) {
      const { error } = await supabase.from("projects").update(payload).eq("id", project!.id);
      setSubmitting(false);
      if (error) { errorToast(error.message); return; }
      savedToast();
    } else {
      const { data, error } = await supabase.from("projects").insert(payload).select().single();
      setSubmitting(false);
      if (error) { errorToast(error.message); return; }
      createdToast("Prosjekt opprettet");
      onCreated?.(data.id);
    }

    qc.invalidateQueries({ queryKey: ["dashboard", "projects"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Rediger prosjekt" : "Nytt prosjekt"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pq-title">Tittel</Label>
            <Input
              id="pq-title"
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
            <Label htmlFor="pq-slug">Slug</Label>
            <Input
              id="pq-slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pq-subtitle">Undertittel</Label>
            <Input
              id="pq-subtitle"
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pq-description">Beskrivelse</Label>
            <Textarea
              id="pq-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={5}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pq-role">Rolle</Label>
              <Input
                id="pq-role"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pq-tech">Tech (kommaseparert)</Label>
              <Input
                id="pq-tech"
                value={form.tech}
                onChange={(e) => setForm((f) => ({ ...f, tech: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pq-url">URL</Label>
            <Input
              id="pq-url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
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
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Lagrer…" : isEdit ? "Lagre" : "Opprett"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

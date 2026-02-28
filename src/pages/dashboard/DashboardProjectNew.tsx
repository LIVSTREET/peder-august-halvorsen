import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { slugify, getSlugError } from "@/lib/slug";
import { errorToast, createdToast } from "@/lib/dashboard-toast";
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

// New project creation form
export default function DashboardProjectNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    subtitle: "",
    status: "draft" as "draft" | "published" | "archived",
  });
  const [slugError, setSlugError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hasChanges = !!(form.title.trim() || form.slug.trim() || form.subtitle.trim());

  useEffect(() => {
    if (!hasChanges) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug.trim() || slugify(form.title) || "prosjekt";
    const err = getSlugError(slug);
    if (err) {
      setSlugError(err);
      return;
    }
    setSlugError(null);
    setSubmitting(true);

    supabase
      .from("projects")
      .insert({
        title: form.title.trim() || "Uten tittel",
        slug,
        subtitle: form.subtitle.trim() || null,
        status: form.status,
        ...(form.status === "published" ? { published_at: new Date().toISOString() } : {}),
      })
      .select()
      .single()
      .then(({ data, error }) => {
        setSubmitting(false);
        if (error) {
          errorToast(error.message);
          return;
        }
        createdToast("Prosjekt opprettet");
        if (data) navigate(`/dashboard/projects/${data.id}`);
      });
  }

  return (
    <div className="space-y-8">

      <div>
        <button
          onClick={() => navigate("/dashboard/projects")}
          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Prosjekter
        </button>
      </div>

      <h1 className="font-display text-2xl font-bold text-foreground">Nytt prosjekt</h1>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="title">Tittel</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: slugify(title) || f.slug }));
            }}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="slug">Slug</Label>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setForm((f) => ({ ...f, slug: slugify(f.title) || f.slug }))}
            >
              Regenerer fra tittel
            </button>
          </div>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            readOnly
            className="bg-muted/50"
            required
          />
          {slugError && <p className="text-xs text-destructive">{slugError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Undertittel / kort beskrivelse (valgfri)</Label>
          <Textarea
            id="subtitle"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((f) => ({ ...f, status: v as typeof form.status }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Oppretter…" : "Opprett"}
        </Button>
      </form>
    </div>
  );
}

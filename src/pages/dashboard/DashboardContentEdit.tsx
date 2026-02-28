import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useContentItem } from "@/hooks/useContentItems";
import { useContentItemMutations } from "@/hooks/useContentItemMutations";
import { slugify, getSlugError, isSlugValid } from "@/lib/slug";
import { getBaseUrl } from "@/lib/seo";
import { CONTENT_TYPES, CONTENT_STATUSES, CONTENT_TYPE_ROUTES } from "@/lib/content-types";
import { savedToast, errorToast } from "@/lib/dashboard-toast";
import { SaveIndicator } from "@/components/dashboard/SaveIndicator";
import { useUnsavedGuard } from "@/hooks/useUnsavedGuard";
import { useDashboardProjects } from "@/hooks/useDashboardProjects";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function DashboardContentEdit() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    title: "", slug: "", type: "build" as "work" | "build" | "archive",
    status: "draft" as "draft" | "published", excerpt: "", body: "",
    project_id: "" as string, cover_asset_id: "" as string,
  });
  const [slugError, setSlugError] = useState<string | null>(null);

  const { data: item, isLoading } = useContentItem(id);
  const projectsQuery = useDashboardProjects();
  const projectsList = projectsQuery.data ?? [];
  const { updateMutation } = useContentItemMutations(id);

  const isPublished = form.status === "published";

  const hasChanges = !!item && (
    form.title !== item.title || form.slug !== item.slug || form.type !== (item as any).type ||
    form.status !== (item as any).status || form.excerpt !== ((item as any).excerpt ?? "") ||
    form.body !== ((item as any).body ?? "") || form.project_id !== ((item as any).project_id ?? "") ||
    form.cover_asset_id !== ((item as any).cover_asset_id ?? "")
  );
  const { blocker, confirmLeave, stay } = useUnsavedGuard(hasChanges);

  useEffect(() => {
    if (!item) return;
    setForm({
      title: item.title, slug: item.slug, type: (item as any).type ?? "build",
      status: (item as any).status ?? "draft", excerpt: (item as any).excerpt ?? "",
      body: (item as any).body ?? "", project_id: (item as any).project_id ?? "",
      cover_asset_id: (item as any).cover_asset_id ?? "",
    });
  }, [item]);

  if (isLoading || !item) return <p className="text-muted-foreground">Laster…</p>;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.status === "published") {
      const err = getSlugError(form.slug);
      if (err) { setSlugError(err); return; }
    }
    setSlugError(null);
    updateMutation.mutate({
      ...form,
      project_id: form.project_id || null,
      cover_asset_id: form.cover_asset_id || null,
    }, {
      onSuccess: () => savedToast(),
      onError: (err) => errorToast(err?.message),
    });
  }

  const saveStatus: "idle" | "saving" | "saved" = updateMutation.isPending
    ? "saving" : updateMutation.isSuccess ? "saved" : "idle";
  const route = CONTENT_TYPE_ROUTES[form.type];
  const publicUrl = isPublished && isSlugValid(form.slug)
    ? `${getBaseUrl()}${route.path}/${form.slug}` : null;

  return (
    <div className="space-y-6">
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
          <div className="bg-background border border-border rounded-lg p-6 max-w-sm space-y-4">
            <h2 className="font-display text-lg font-bold">Ulagrede endringer</h2>
            <p className="text-sm text-muted-foreground">Vil du forlate siden uten å lagre?</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={stay}>Bli</Button>
              <Button variant="destructive" size="sm" onClick={confirmLeave}>Forlat</Button>
            </div>
          </div>
        </div>
      )}

      <Link to="/dashboard/content" className="text-xs font-mono text-muted-foreground hover:text-primary">
        ← Innhold
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Rediger innhold</h1>
        <SaveIndicator status={saveStatus} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Tittel</Label>
          <Input id="title" value={form.title} onChange={(e) => {
            const title = e.target.value;
            setForm((f) => ({ ...f, title, ...(!isPublished ? { slug: slugify(title) || f.slug } : {}) }));
          }} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <div className="flex gap-2">
            <Input id="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              readOnly={!isPublished} className={!isPublished ? "bg-muted/50" : ""} required />
            <Button type="button" variant="outline" size="sm"
              onClick={() => setForm((f) => ({ ...f, slug: slugify(f.title) || f.slug }))}>Regenerer</Button>
          </div>
          {slugError && <p className="text-sm text-destructive">{slugError}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as typeof f.type }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as typeof f.status }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CONTENT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Prosjekt</Label>
          <Select value={form.project_id || "none"} onValueChange={(v) => setForm((f) => ({ ...f, project_id: v === "none" ? "" : v }))}>
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
          <Label htmlFor="excerpt">Utdrag</Label>
          <Textarea id="excerpt" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} />
        </div>

        <div className="space-y-2">
          <Label>Innhold (Markdown)</Label>
          <Textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} rows={12} className="font-mono text-sm" />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Lagrer…" : "Lagre"}
          </Button>
          {publicUrl && (
            <Button type="button" variant="outline" size="sm" asChild>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">Åpne live</a>
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" asChild>
            <Link to={`${route.path}/${form.slug}`} target="_blank">Åpne preview</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

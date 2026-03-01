import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useContentItem } from "@/hooks/useContentItems";
import { useContentItemMutations } from "@/hooks/useContentItemMutations";
import { slugify, getSlugError, isSlugValid } from "@/lib/slug";
import { getBaseUrl } from "@/lib/seo";
import { CONTENT_TYPES, CONTENT_STATUSES, CONTENT_TYPE_ROUTES } from "@/lib/content-types";
import { savedToast, errorToast } from "@/lib/dashboard-toast";
import { SaveIndicator } from "@/components/dashboard/SaveIndicator";
import { BilingualField } from "@/components/dashboard/BilingualField";
import { TranslationProgress } from "@/components/dashboard/TranslationProgress";
import { useUnsavedGuard } from "@/hooks/useUnsavedGuard";
import { useDashboardProjects } from "@/hooks/useDashboardProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function DashboardContentEdit() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    title: "", title_en: "", slug: "",
    type: "build" as "work" | "build" | "archive",
    status: "draft" as "draft" | "published",
    excerpt: "", excerpt_en: "",
    body: "", body_en: "",
    project_id: "" as string, cover_asset_id: "" as string,
  });
  const [slugError, setSlugError] = useState<string | null>(null);

  const { data: item, isLoading } = useContentItem(id);
  const projectsQuery = useDashboardProjects();
  const projectsList = projectsQuery.data ?? [];
  const { updateMutation } = useContentItemMutations(id);

  const isPublished = form.status === "published";

  const enFields = [form.title_en, form.excerpt_en, form.body_en];
  const enFilled = enFields.filter((v) => v.trim() !== "").length;

  const hasChanges = !!item && (
    form.title !== item.title || form.title_en !== ((item as any).title_en ?? "") ||
    form.slug !== item.slug || form.type !== (item as any).type ||
    form.status !== (item as any).status ||
    form.excerpt !== ((item as any).excerpt ?? "") || form.excerpt_en !== ((item as any).excerpt_en ?? "") ||
    form.body !== ((item as any).body ?? "") || form.body_en !== ((item as any).body_en ?? "") ||
    form.project_id !== ((item as any).project_id ?? "") ||
    form.cover_asset_id !== ((item as any).cover_asset_id ?? "")
  );
  const { blocker, confirmLeave, stay } = useUnsavedGuard(hasChanges);

  useEffect(() => {
    if (!item) return;
    setForm({
      title: item.title, title_en: (item as any).title_en ?? "",
      slug: item.slug, type: (item as any).type ?? "build",
      status: (item as any).status ?? "draft",
      excerpt: (item as any).excerpt ?? "", excerpt_en: (item as any).excerpt_en ?? "",
      body: (item as any).body ?? "", body_en: (item as any).body_en ?? "",
      project_id: (item as any).project_id ?? "",
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

  function copyAllNoToEn() {
    setForm((f) => ({
      ...f,
      title_en: f.title,
      excerpt_en: f.excerpt,
      body_en: f.body,
    }));
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
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground">Rediger innhold</h1>
          <SaveIndicator status={saveStatus} />
          <TranslationProgress filled={enFilled} total={enFields.length} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={copyAllNoToEn}>
            Kopier alle norsk → engelsk
          </Button>
        </div>

        <BilingualField
          label="Tittel"
          valueNo={form.title}
          valueEn={form.title_en}
          onChangeNo={(v) => {
            setForm((f) => ({ ...f, title: v, ...(!isPublished ? { slug: slugify(v) || f.slug } : {}) }));
          }}
          onChangeEn={(v) => setForm((f) => ({ ...f, title_en: v }))}
          required
          onCopyNoToEn={() => setForm((f) => ({ ...f, title_en: f.title }))}
        />

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

        <BilingualField
          label="Utdrag"
          valueNo={form.excerpt}
          valueEn={form.excerpt_en}
          onChangeNo={(v) => setForm((f) => ({ ...f, excerpt: v }))}
          onChangeEn={(v) => setForm((f) => ({ ...f, excerpt_en: v }))}
          type="textarea"
          rows={2}
          onCopyNoToEn={() => setForm((f) => ({ ...f, excerpt_en: f.excerpt }))}
        />

        <BilingualField
          label="Innhold (Markdown)"
          valueNo={form.body}
          valueEn={form.body_en}
          onChangeNo={(v) => setForm((f) => ({ ...f, body: v }))}
          onChangeEn={(v) => setForm((f) => ({ ...f, body_en: v }))}
          type="textarea"
          rows={12}
          onCopyNoToEn={() => setForm((f) => ({ ...f, body_en: f.body }))}
        />

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

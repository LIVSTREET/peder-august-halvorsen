import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { slugify, isSlugValid, getSlugError } from "@/lib/slug";
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
import { ProjectAssetsSection } from "@/components/dashboard/ProjectAssetsSection";
import { ProjectPreviewCard } from "@/components/dashboard/ProjectPreviewCard";
import { getBaseUrl } from "@/lib/seo";
import { useUnsavedGuard } from "@/hooks/useUnsavedGuard";
import { SaveIndicator } from "@/components/dashboard/SaveIndicator";
import { savedToast, errorToast } from "@/lib/dashboard-toast";
import { useProjectAssets } from "@/hooks/useAssets";
import { getAssetUrl } from "@/lib/supabase-helpers";

const STATUS_OPTIONS = [
  { value: "draft", label: "Utkast" },
  { value: "published", label: "Publisert" },
  { value: "archived", label: "Arkivert" },
] as const;

export default function DashboardProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
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
  const [slugError, setSlugError] = useState<string | null>(null);

  const { data: project, isLoading } = useQuery({
    queryKey: ["dashboard", "project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: assets } = useProjectAssets(project?.id);
  const firstAsset = assets?.[0];
  const coverUrl = firstAsset
    ? getAssetUrl(firstAsset.storage_bucket, firstAsset.storage_path)
    : null;

  const isPublished = project?.status === "published";
  const slugChanged = isPublished && form.slug !== (project?.slug ?? "");

  const hasChanges = !!project && (
    form.title !== project.title ||
    form.slug !== project.slug ||
    form.subtitle !== (project.subtitle ?? "") ||
    form.description !== (project.description ?? "") ||
    form.role !== (project.role ?? "") ||
    form.tech !== (project.tech ?? "") ||
    form.url !== (project.url ?? "") ||
    form.status !== project.status
  );

  const { blocker, confirmLeave, stay } = useUnsavedGuard(hasChanges);

  const updateMutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          title: payload.title,
          slug: payload.slug,
          subtitle: payload.subtitle || null,
          description: payload.description || null,
          role: payload.role || null,
          tech: payload.tech || null,
          url: payload.url || null,
          status: payload.status,
          ...(payload.status === "published" && !project?.published_at
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
      qc.invalidateQueries({ queryKey: ["dashboard", "projects"] });
      qc.invalidateQueries({ queryKey: ["dashboard", "project", id] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      savedToast();
    },
    onError: (err) => errorToast(err?.message),
  });

  useEffect(() => {
    if (!project) return;
    setForm({
      title: project.title,
      slug: project.slug,
      subtitle: project.subtitle ?? "",
      description: project.description ?? "",
      role: project.role ?? "",
      tech: project.tech ?? "",
      url: project.url ?? "",
      status: project.status as "draft" | "published" | "archived",
    });
    setSlugError(null);
  }, [project]);

  if (isLoading || !project) {
    return (
      <div className="py-10">
        <p className="text-muted-foreground text-sm">Laster…</p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.status === "published") {
      const err = getSlugError(form.slug);
      if (err) {
        setSlugError(err);
        return;
      }
    }
    setSlugError(null);
    updateMutation.mutate(form);
  }

  return (
    <div className="space-y-8">
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="border border-border bg-background p-6 space-y-4 max-w-sm">
            <p className="font-display font-bold text-foreground">Ulagrede endringer</p>
            <p className="text-sm text-muted-foreground">
              Vil du forlate siden uten å lagre?
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={stay}>Bli</Button>
              <Button size="sm" variant="outline" onClick={confirmLeave}>Forlat</Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          onClick={() => navigate("/dashboard/projects")}
          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Prosjekter
        </button>
      </div>

      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Rediger prosjekt
        </h1>
        <SaveIndicator
          status={
            updateMutation.isPending ? "saving"
              : updateMutation.isSuccess ? "saved"
              : hasChanges ? "idle"
              : "hidden"
          }
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="title">Tittel</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({
                ...f,
                title,
                ...(!isPublished ? { slug: slugify(title) || f.slug } : {}),
              }));
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
            readOnly={!isPublished}
            className={!isPublished ? "bg-muted/50" : ""}
            required
          />
          {slugChanged && (
            <p className="text-xs text-destructive">
              Endrer du slug bryter du delinger/lenker.
            </p>
          )}
          {slugError && (
            <p className="text-xs text-destructive">{slugError}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Undertittel</Label>
          <Input
            id="subtitle"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Beskrivelse</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rolle</Label>
          <Input
            id="role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tech">Tech (kommaseparert)</Label>
          <Input
            id="tech"
            value={form.tech}
            onChange={(e) => setForm((f) => ({ ...f, tech: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
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
          {form.status === "published" && isSlugValid(form.slug) && (
            <p className="text-xs text-muted-foreground mt-1">
              <a
                href={`${getBaseUrl()}/prosjekter/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Live →
              </a>
            </p>
          )}
        </div>


        <div className="flex gap-2">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Lagrer…" : "Lagre"}
          </Button>
          {form.status === "published" && isSlugValid(form.slug) && (
            <Button type="button" variant="outline" asChild>
              <a
                href={`${getBaseUrl()}/prosjekter/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Åpne live
              </a>
            </Button>
          )}
        </div>
      </form>

      <ProjectAssetsSection projectId={project.id} />
        </div>

        <div className="lg:w-72 shrink-0 space-y-4">
          <p className="text-xs font-mono text-muted-foreground">Preview</p>
          <ProjectPreviewCard
            title={form.title}
            slug={form.slug}
            excerpt={form.subtitle}
            coverUrl={coverUrl}
            status={form.status}
            publicPath={`/prosjekter/${form.slug}`}
          />
        </div>
      </div>
    </div>
  );
}

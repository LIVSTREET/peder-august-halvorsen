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
import { BilingualField } from "@/components/dashboard/BilingualField";
import { TranslationProgress } from "@/components/dashboard/TranslationProgress";
import { getBaseUrl } from "@/lib/seo";
import { useUnsavedGuard } from "@/hooks/useUnsavedGuard";
import { SaveIndicator } from "@/components/dashboard/SaveIndicator";
import { savedToast, errorToast } from "@/lib/dashboard-toast";
import { useProjectAssets } from "@/hooks/useAssets";
import { getAssetUrl } from "@/lib/supabase-helpers";
import { PROJECT_PRESENTATIONS, normalizePresentation } from "@/lib/project-presentation";
import { AISuggestionDialog, type AISuggestion } from "@/components/dashboard/AISuggestionDialog";
import { Sparkles, Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "draft", label: "Utkast" },
  { value: "published", label: "Publisert" },
  { value: "archived", label: "Arkivert" },
] as const;

const PRESENTATION_OPTIONS = [
  { value: "landscape", label: "Landscape — desktop / nettleser" },
  { value: "portrait", label: "Portrait — mobil / app" },
] as const;

export default function DashboardProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    title_en: "",
    slug: "",
    subtitle: "",
    subtitle_en: "",
    description: "",
    description_en: "",
    problem_text: "",
    problem_text_en: "",
    solution_text: "",
    solution_text_en: "",
    result_text: "",
    result_text_en: "",
    role: "",
    role_en: "",
    tech: "",
    url: "",
    presentation: "landscape" as "landscape" | "portrait",
    status: "draft" as "draft" | "published" | "archived",
    ai_context: "",
  });
  const [slugError, setSlugError] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

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

  const enFields = [
    form.title_en,
    form.subtitle_en,
    form.description_en,
    form.problem_text_en,
    form.solution_text_en,
    form.result_text_en,
    form.role_en,
  ];
  const enFilled = enFields.filter((v) => v.trim() !== "").length;

  const hasChanges = !!project && (
    form.title !== project.title ||
    form.title_en !== ((project as any).title_en ?? "") ||
    form.slug !== project.slug ||
    form.subtitle !== (project.subtitle ?? "") ||
    form.subtitle_en !== ((project as any).subtitle_en ?? "") ||
    form.description !== (project.description ?? "") ||
    form.description_en !== ((project as any).description_en ?? "") ||
    form.problem_text !== ((project as any).problem_text ?? "") ||
    form.problem_text_en !== ((project as any).problem_text_en ?? "") ||
    form.solution_text !== ((project as any).solution_text ?? "") ||
    form.solution_text_en !== ((project as any).solution_text_en ?? "") ||
    form.result_text !== ((project as any).result_text ?? "") ||
    form.result_text_en !== ((project as any).result_text_en ?? "") ||
    form.role !== (project.role ?? "") ||
    form.role_en !== ((project as any).role_en ?? "") ||
    form.tech !== (project.tech ?? "") ||
    form.url !== (project.url ?? "") ||
    form.presentation !== normalizePresentation((project as any).presentation) ||
    form.status !== project.status ||
    form.ai_context !== ((project as any).ai_context ?? "")
  );

  const { blocker, confirmLeave, stay } = useUnsavedGuard(hasChanges);

  const updateMutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          title: payload.title,
          title_en: payload.title_en || null,
          slug: payload.slug,
          subtitle: payload.subtitle || null,
          subtitle_en: payload.subtitle_en || null,
          description: payload.description || null,
          description_en: payload.description_en || null,
          problem_text: payload.problem_text || null,
          problem_text_en: payload.problem_text_en || null,
          solution_text: payload.solution_text || null,
          solution_text_en: payload.solution_text_en || null,
          result_text: payload.result_text || null,
          result_text_en: payload.result_text_en || null,
          role: payload.role || null,
          role_en: payload.role_en || null,
          tech: payload.tech || null,
          url: payload.url || null,
          presentation: payload.presentation,
          status: payload.status,
          ai_context: payload.ai_context || null,
          ...(payload.status === "published" && !project?.published_at
            ? { published_at: new Date().toISOString() }
            : {}),
        } as any)
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
      title_en: (project as any).title_en ?? "",
      slug: project.slug,
      subtitle: project.subtitle ?? "",
      subtitle_en: (project as any).subtitle_en ?? "",
      description: project.description ?? "",
      description_en: (project as any).description_en ?? "",
      problem_text: (project as any).problem_text ?? "",
      problem_text_en: (project as any).problem_text_en ?? "",
      solution_text: (project as any).solution_text ?? "",
      solution_text_en: (project as any).solution_text_en ?? "",
      result_text: (project as any).result_text ?? "",
      result_text_en: (project as any).result_text_en ?? "",
      role: project.role ?? "",
      role_en: (project as any).role_en ?? "",
      tech: project.tech ?? "",
      url: project.url ?? "",
      presentation: normalizePresentation((project as any).presentation),
      status: project.status as "draft" | "published" | "archived",
      ai_context: (project as any).ai_context ?? "",
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

  function copyAllNoToEn() {
    setForm((f) => ({
      ...f,
      title_en: f.title,
      subtitle_en: f.subtitle,
      description_en: f.description,
      problem_text_en: f.problem_text,
      solution_text_en: f.solution_text,
      result_text_en: f.result_text,
      role_en: f.role,
    }));
  }

  async function runAi(action: "translate_en" | "improve_no" | "seo_case" | "fill_missing") {
    setAiBusy(action);
    try {
      const projectPayload = {
        title: form.title,
        title_en: form.title_en,
        subtitle: form.subtitle,
        subtitle_en: form.subtitle_en,
        description: form.description,
        description_en: form.description_en,
        problem_text: form.problem_text,
        problem_text_en: form.problem_text_en,
        solution_text: form.solution_text,
        solution_text_en: form.solution_text_en,
        result_text: form.result_text,
        result_text_en: form.result_text_en,
        role: form.role,
        role_en: form.role_en,
        tech: form.tech,
        url: form.url,
        ai_context: form.ai_context,
      };
      const { data, error } = await supabase.functions.invoke("project-ai", {
        body: { action, project: projectPayload },
      });
      if (error) {
        const ctx: any = (error as any).context;
        let payload: any = null;
        try {
          if (ctx && typeof ctx.json === "function") payload = await ctx.json();
        } catch { /* ignore */ }
        const code = payload?.error;
        if (code === "ai_not_configured") {
          errorToast("AI er ikke konfigurert ennå.");
        } else if (code === "forbidden" || code === "unauthorized") {
          errorToast("Du mangler tilgang.");
        } else if (code === "rate_limited") {
          errorToast("For mange forespørsler. Prøv igjen om litt.");
        } else if (code === "ai_credits_exhausted") {
          errorToast("AI-kreditter er brukt opp. Fyll på i Lovable Workspace.");
        } else {
          errorToast("Kunne ikke hente AI-forslag.");
        }
        return;
      }
      setAiSuggestion({ action, fields: data?.fields ?? {} });
      setAiDialogOpen(true);
    } catch (e) {
      errorToast("Kunne ikke hente AI-forslag.");
    } finally {
      setAiBusy(null);
    }
  }

  function applyAiFields(fields: Record<string, string>) {
    setForm((f) => ({ ...f, ...fields }));
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
        <TranslationProgress filled={enFilled} total={enFields.length} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            <div className="border border-border/70 rounded-md p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI-verktøy
              </div>
              <div className="flex flex-wrap gap-2">
                <AiButton
                  busy={aiBusy === "translate_en"}
                  disabled={!!aiBusy}
                  onClick={() => runAi("translate_en")}
                >
                  Generer engelsk
                </AiButton>
                <AiButton
                  busy={aiBusy === "improve_no"}
                  disabled={!!aiBusy}
                  onClick={() => runAi("improve_no")}
                >
                  Forbedre norsk
                </AiButton>
                <AiButton
                  busy={aiBusy === "seo_case"}
                  disabled={!!aiBusy}
                  onClick={() => runAi("seo_case")}
                >
                  Generer SEO-case
                </AiButton>
                <AiButton
                  busy={aiBusy === "fill_missing"}
                  disabled={!!aiBusy}
                  onClick={() => runAi("fill_missing")}
                >
                  Generer alt manglende
                </AiButton>
                <Button type="button" variant="ghost" size="sm" onClick={copyAllNoToEn}>
                  Kopier alle norsk → engelsk
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Forslag vises i dialog før noe endres. Ingenting lagres før du
                trykker «Lagre».
              </p>
            </div>

            <BilingualField
              label="Tittel"
              valueNo={form.title}
              valueEn={form.title_en}
              onChangeNo={(v) => setForm((f) => ({ ...f, title: v, ...(!isPublished ? { slug: slugify(v) || f.slug } : {}) }))}
              onChangeEn={(v) => setForm((f) => ({ ...f, title_en: v }))}
              required
              showMissingEn
              onCopyNoToEn={() => setForm((f) => ({ ...f, title_en: f.title }))}
            />

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

            <BilingualField
              label="Undertittel"
              valueNo={form.subtitle}
              valueEn={form.subtitle_en}
              onChangeNo={(v) => setForm((f) => ({ ...f, subtitle: v }))}
              onChangeEn={(v) => setForm((f) => ({ ...f, subtitle_en: v }))}
              onCopyNoToEn={() => setForm((f) => ({ ...f, subtitle_en: f.subtitle }))}
            />

            <BilingualField
              label="Beskrivelse"
              valueNo={form.description}
              valueEn={form.description_en}
              onChangeNo={(v) => setForm((f) => ({ ...f, description: v }))}
              onChangeEn={(v) => setForm((f) => ({ ...f, description_en: v }))}
              type="textarea"
              rows={4}
              noPlaceholder="Kort beskrivelse av prosjektet."
              onCopyNoToEn={() => setForm((f) => ({ ...f, description_en: f.description }))}
            />

            <div className="space-y-5 pt-4 border-t border-border/60">
              <div>
                <p className="font-display text-sm font-bold text-foreground uppercase tracking-wide">
                  Case study
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Strukturert presentasjon. Vises som egen seksjon på prosjektsiden.
                </p>
              </div>

              <BilingualField
                label="Problem"
                valueNo={form.problem_text}
                valueEn={form.problem_text_en}
                onChangeNo={(v) => setForm((f) => ({ ...f, problem_text: v }))}
                onChangeEn={(v) => setForm((f) => ({ ...f, problem_text_en: v }))}
                type="textarea"
                rows={4}
                noPlaceholder="Hva var utfordringen før prosjektet?"
                onCopyNoToEn={() => setForm((f) => ({ ...f, problem_text_en: f.problem_text }))}
              />

              <BilingualField
                label="Løsning"
                valueNo={form.solution_text}
                valueEn={form.solution_text_en}
                onChangeNo={(v) => setForm((f) => ({ ...f, solution_text: v }))}
                onChangeEn={(v) => setForm((f) => ({ ...f, solution_text_en: v }))}
                type="textarea"
                rows={4}
                noPlaceholder="Hva ble bygget eller forbedret?"
                onCopyNoToEn={() => setForm((f) => ({ ...f, solution_text_en: f.solution_text }))}
              />

              <BilingualField
                label="Resultat"
                valueNo={form.result_text}
                valueEn={form.result_text_en}
                onChangeNo={(v) => setForm((f) => ({ ...f, result_text: v }))}
                onChangeEn={(v) => setForm((f) => ({ ...f, result_text_en: v }))}
                type="textarea"
                rows={4}
                noPlaceholder="Hva ble bedre etterpå?"
                onCopyNoToEn={() => setForm((f) => ({ ...f, result_text_en: f.result_text }))}
              />
            </div>

            <BilingualField
              label="Rolle"
              valueNo={form.role}
              valueEn={form.role_en}
              onChangeNo={(v) => setForm((f) => ({ ...f, role: v }))}
              onChangeEn={(v) => setForm((f) => ({ ...f, role_en: v }))}
              onCopyNoToEn={() => setForm((f) => ({ ...f, role_en: f.role }))}
            />
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
              <Label>Presentasjon</Label>
              <Select
                value={form.presentation}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, presentation: v as typeof form.presentation }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESENTATION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Landscape vises i nettleserramme (16:9). Portrait vises som mobil-mockup (vertikal).
              </p>
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
            presentation={form.presentation}
          />
        </div>
      </div>

      <AISuggestionDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        suggestion={aiSuggestion}
        currentValues={{
          title: form.title,
          title_en: form.title_en,
          subtitle: form.subtitle,
          subtitle_en: form.subtitle_en,
          description: form.description,
          description_en: form.description_en,
          problem_text: form.problem_text,
          problem_text_en: form.problem_text_en,
          solution_text: form.solution_text,
          solution_text_en: form.solution_text_en,
          result_text: form.result_text,
          result_text_en: form.result_text_en,
          role: form.role,
          role_en: form.role_en,
        }}
        onApply={applyAiFields}
      />
    </div>
  );
}

function AiButton({
  busy,
  children,
  disabled,
  onClick,
}: {
  busy: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
      ) : (
        <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
      )}
      {children}
    </Button>
  );
}

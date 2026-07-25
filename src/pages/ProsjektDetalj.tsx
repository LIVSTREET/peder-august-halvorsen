import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import ProjectCoverMedia from "@/components/ProjectCoverMedia";
import CTAButton from "@/components/CTAButton";
import TagPill from "@/components/TagPill";
import { useProject } from "@/hooks/useProjects";
import { useProjectAssets } from "@/hooks/useAssets";
import { getAssetUrl } from "@/lib/supabase-helpers";
import { truncate, PERSON_NAME } from "@/lib/seo";
import { usePublishedContentByProject } from "@/hooks/useContentItems";
import { CONTENT_TYPE_ROUTES } from "@/lib/content-types";
import { useParams, Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey, tField } from "@/lib/i18n";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export default function ProsjektDetalj() {
  const { slug } = useParams<{ slug: string }>();
  const { locale, withLocalePath } = useLocale();
  const { data: project, isLoading } = useProject(slug || "");
  const { data: assets } = useProjectAssets(project?.id);
  const { data: contentUpdates } = usePublishedContentByProject(project?.id);

  if (isLoading) {
    return (
      <Layout>
        <div className="container pt-16 pb-24">
          <p className="text-muted-foreground">{tKey("Laster…", "Loading…", locale)}</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container pt-16 pb-24">
          <p className="text-muted-foreground">{tKey("Prosjekt ikke funnet.", "Project not found.", locale)}</p>
          <Link to={withLocalePath("/prosjekter")} className="text-primary text-sm mt-4 inline-block">
            ← {tKey("Tilbake", "Back", locale)}
          </Link>
        </div>
      </Layout>
    );
  }

  const techList = project.tech?.split(",").map((t: string) => t.trim()).filter(Boolean) || [];
  const title = tField(project, "title", locale);
  const subtitle = tField(project, "subtitle", locale);
  const description = tField(project, "description", locale);
  const problemText = tField(project as any, "problem_text", locale);
  const solutionText = tField(project as any, "solution_text", locale);
  const resultText = tField(project as any, "result_text", locale);
  const hasCaseStudy = !!(problemText || solutionText || resultText);

  const ogAsset = assets?.find((a) => ["og", "screenshot", "image"].includes(a.kind));
  const ogImageUrl = ogAsset ? getAssetUrl(ogAsset.storage_bucket, ogAsset.storage_path) : null;

  const metaDescription = description
    ? truncate(description)
    : `${title} – ${tKey("prosjekt av", "project by", locale)} ${PERSON_NAME}.`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description || undefined,
    about: { "@type": "Person", name: PERSON_NAME },
  };

  return (
    <Layout>
      <SeoHead
        title={`${title} | ${tKey("Arbeid", "Work", locale)} | Studio P.A. Halvorsen`}
        description={metaDescription}
        ogImage={ogImageUrl}
        jsonLd={webPageSchema}
      />
      <article className="container pt-16 pb-24 max-w-3xl mx-auto">
        <Link to={withLocalePath("/prosjekter")} className="text-xs font-mono text-muted-foreground hover:text-primary mb-6 inline-block">
          ← {tKey("Alle prosjekter", "All projects", locale)}
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {project.role && (
            <div>
              <span className="font-mono text-xs text-muted-foreground uppercase">{tKey("Rolle", "Role", locale)}</span>
              <p className="text-foreground">{tField(project, "role", locale)}</p>
            </div>
          )}
          {project.url && (
            <div>
              <span className="font-mono text-xs text-muted-foreground uppercase">URL</span>
              <p>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">
                  {project.url}
                </a>
              </p>
            </div>
          )}
        </div>

        {techList.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {techList.map((t: string) => (
              <TagPill key={t} label={t} />
            ))}
          </div>
        )}

        {hasCaseStudy && (
          <section aria-label="Case study" className="mt-12 space-y-5">
            {problemText && (
              <CaseBlock
                eyebrow={tKey("Problem", "Problem", locale)}
                heading={tKey("Utfordringen", "The challenge", locale)}
                text={problemText}
              />
            )}
            {solutionText && (
              <CaseBlock
                eyebrow={tKey("Løsning", "Solution", locale)}
                heading={tKey("Hva vi bygde", "What we built", locale)}
                text={solutionText}
              />
            )}
            {resultText && (
              <CaseBlock
                eyebrow={tKey("Resultat", "Result", locale)}
                heading={tKey("Hva ble bedre", "The outcome", locale)}
                text={resultText}
              />
            )}
          </section>
        )}

        {!hasCaseStudy && description && (
          <div className="mt-10 text-foreground/80 leading-relaxed whitespace-pre-line">
            {description}
          </div>
        )}

        {assets && assets.length > 0 && (
          <ProjectGallery
            assets={assets}
            title={title}
            presentation={(project as any).presentation}
            frameUrl={project.url || project.slug}
          />
        )}

        {contentUpdates && contentUpdates.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              {tKey("Siste oppdateringer", "Latest updates", locale)}
            </h2>
            <ul className="divide-y divide-border">
              {contentUpdates.map((u: any) => (
                <li key={u.id} className="py-3 flex items-baseline justify-between">
                  <Link
                    to={withLocalePath(`${CONTENT_TYPE_ROUTES[u.type as keyof typeof CONTENT_TYPE_ROUTES]?.path ?? "/na-bygger-jeg"}/${u.slug}`)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {tField(u, "title", locale)}
                  </Link>
                  {u.published_at && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {new Date(u.published_at).toLocaleDateString(locale === "en" ? "en-GB" : "nb-NO")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-border">
          <CTAButton to={withLocalePath("/brief")}>
            {tKey("Har du et lignende prosjekt?", "Have a similar project?", locale)}
          </CTAButton>
        </div>
      </article>
    </Layout>
  );
}

type ProjectAsset = Tables<"assets">;

function ProjectGallery({
  assets,
  title,
  presentation,
  frameUrl,
}: {
  assets: ProjectAsset[];
  title: string;
  presentation?: string | null;
  frameUrl?: string;
}) {
  const { locale } = useLocale();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hasMultiple = assets.length > 1;

  const showPrevious = () => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current - 1 + assets.length) % assets.length;
    });
  };

  const showNext = () => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + 1) % assets.length;
    });
  };

  useEffect(() => {
    if (activeIndex === null || !hasMultiple) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) => {
          if (current === null) return null;
          return (current - 1 + assets.length) % assets.length;
        });
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => {
          if (current === null) return null;
          return (current + 1) % assets.length;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, hasMultiple, assets.length]);

  const activeAsset = activeIndex === null ? null : assets[activeIndex];
  const activeUrl = activeAsset
    ? getAssetUrl(activeAsset.storage_bucket, activeAsset.storage_path)
    : null;

  return (
    <>
      <div className="mt-12 space-y-6">
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className="relative block w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          aria-label={tKey("Åpne bilde 1 i full størrelse", "Open image 1 full size", locale)}
        >
          <ProjectCoverMedia
            key={assets[0].id}
            presentation={presentation}
            frameUrl={frameUrl}
            src={getAssetUrl(assets[0].storage_bucket, assets[0].storage_path)}
            alt={assets[0].alt || title}
            width={assets[0].width}
            height={assets[0].height}
            fallbackLabel={title}
            variant="detail"
          />
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-2 bg-background/90 border border-border px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-foreground opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Expand className="w-3.5 h-3.5" aria-hidden="true" />
            {tKey("Vis stort", "View large", locale)}
          </span>
        </button>

        {assets.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {assets.slice(1).map((asset, index) => {
              const url = getAssetUrl(asset.storage_bucket, asset.storage_path);
              const imageNumber = index + 2;

              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => setActiveIndex(index + 1)}
                  className="relative flex min-h-44 items-center justify-center overflow-hidden border border-border/60 bg-card/40 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={tKey(
                    `Åpne bilde ${imageNumber} i full størrelse`,
                    `Open image ${imageNumber} full size`,
                    locale
                  )}
                >
                  <img
                    src={url}
                    alt={asset.alt || title}
                    width={asset.width ?? undefined}
                    height={asset.height ?? undefined}
                    loading="lazy"
                    className="block w-full h-auto max-h-[65vh] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                  <span className="absolute right-2 bottom-2 bg-background/90 border border-border p-2 text-foreground opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[96vw] h-[calc(100dvh-1rem)] max-h-[96dvh] p-3 md:p-5 bg-background/98 border-border/70 flex flex-col gap-3">
          <DialogTitle className="sr-only">
            {tKey("Prosjektbilder", "Project images", locale)}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {tKey(
              "Bildevisning. Bruk pilene for å bla mellom bildene.",
              "Image viewer. Use the arrows to browse the images.",
              locale
            )}
          </DialogDescription>

          <div className="flex-1 min-h-0 flex items-center justify-center px-0 md:px-14">
            {activeAsset && activeUrl && (
              <img
                src={activeUrl}
                alt={activeAsset.alt || title}
                width={activeAsset.width ?? undefined}
                height={activeAsset.height ?? undefined}
                className="block max-w-full max-h-full w-auto h-auto object-contain"
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
            <p className="text-xs font-mono text-muted-foreground">
              {activeIndex !== null ? activeIndex + 1 : 1} / {assets.length}
            </p>

            {hasMultiple && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="inline-flex min-w-11 min-h-11 items-center justify-center border border-border text-foreground hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={tKey("Forrige bilde", "Previous image", locale)}
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="inline-flex min-w-11 min-h-11 items-center justify-center border border-border text-foreground hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={tKey("Neste bilde", "Next image", locale)}
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CaseBlock({ eyebrow, heading, text }: { eyebrow: string; heading: string; text: string }) {
  return (
    <section className="border border-border/60 bg-card/40 p-6 md:p-8 rounded-sm">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary/80">
        [ {eyebrow} ]
      </p>
      <h2 className="mt-2 font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
        {heading}
      </h2>
      <div className="mt-4 h-px bg-border/60" />
      <p className="mt-4 text-foreground/85 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </section>
  );
}

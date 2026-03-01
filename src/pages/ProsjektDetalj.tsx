import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import BrowserFrame from "@/components/BrowserFrame";
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
        title={`${title} | ${tKey("Prosjekter", "Projects", locale)} | Alt jeg skaper`}
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

        {description && (
          <div className="mt-10 text-foreground/80 leading-relaxed whitespace-pre-line">
            {description}
          </div>
        )}

        {assets && assets.length > 0 && (
          <div className="mt-12 space-y-6">
            {assets.map((asset) => (
              <BrowserFrame key={asset.id} url={project.url || project.slug}>
                <img
                  src={getAssetUrl(asset.storage_bucket, asset.storage_path)}
                  alt={asset.alt || title}
                  width={asset.width ?? undefined}
                  height={asset.height ?? undefined}
                  className="w-full"
                  loading="lazy"
                />
              </BrowserFrame>
            ))}
          </div>
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

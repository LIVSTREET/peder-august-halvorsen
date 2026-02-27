import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import BrowserFrame from "@/components/BrowserFrame";
import CTAButton from "@/components/CTAButton";
import TagPill from "@/components/TagPill";
import { useProject } from "@/hooks/useProjects";
import { useProjectAssets } from "@/hooks/useAssets";
import { getAssetUrl } from "@/lib/supabase-helpers";
import { truncate, PERSON_NAME } from "@/lib/seo";
import { useParams, Link } from "react-router-dom";

export default function ProsjektDetalj() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug || "");
  const { data: assets } = useProjectAssets(project?.id);

  if (isLoading) {
    return (
      <Layout>
        <div className="container pt-16 pb-24">
          <p className="text-muted-foreground">Laster…</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container pt-16 pb-24">
          <p className="text-muted-foreground">Prosjekt ikke funnet.</p>
          <Link to="/prosjekter" className="text-primary text-sm mt-4 inline-block">← Tilbake</Link>
        </div>
      </Layout>
    );
  }

  const techList = project.tech?.split(",").map((t: string) => t.trim()).filter(Boolean) || [];

  const ogAsset = assets?.find((a) =>
    ["og", "screenshot", "image"].includes(a.kind)
  );
  const ogImageUrl = ogAsset
    ? getAssetUrl(ogAsset.storage_bucket, ogAsset.storage_path)
    : null;

  const description = project.description
    ? truncate(project.description)
    : `${project.title} – prosjekt av ${PERSON_NAME}.`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: project.title,
    description: project.description || undefined,
    about: { "@type": "Person", name: PERSON_NAME },
  };

  return (
    <Layout>
      <SeoHead
        title={`${project.title} | Alt jeg skaper`}
        description={description}
        pathname={`/prosjekter/${project.slug}`}
        ogImage={ogImageUrl}
        jsonLd={webPageSchema}
      />
      <article className="container pt-16 pb-24 max-w-3xl mx-auto">
        <Link to="/prosjekter" className="text-xs font-mono text-muted-foreground hover:text-primary mb-6 inline-block">
          ← Alle prosjekter
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {project.title}
        </h1>
        {project.subtitle && (
          <p className="mt-3 text-lg text-muted-foreground">{project.subtitle}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {project.role && (
            <div>
              <span className="font-mono text-xs text-muted-foreground uppercase">Rolle</span>
              <p className="text-foreground">{project.role}</p>
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

        {project.description && (
          <div className="mt-10 text-foreground/80 leading-relaxed whitespace-pre-line">
            {project.description}
          </div>
        )}

        {assets && assets.length > 0 && (
          <div className="mt-12 space-y-6">
            {assets.map((asset) => (
              <BrowserFrame key={asset.id} url={project.url || project.slug}>
                <img
                  src={getAssetUrl(asset.storage_bucket, asset.storage_path)}
                  alt={asset.alt || project.title}
                  width={asset.width ?? undefined}
                  height={asset.height ?? undefined}
                  className="w-full"
                  loading="lazy"
                />
              </BrowserFrame>
            ))}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-border">
          <CTAButton to="/brief">Har du et lignende prosjekt?</CTAButton>
        </div>
      </article>
    </Layout>
  );
}

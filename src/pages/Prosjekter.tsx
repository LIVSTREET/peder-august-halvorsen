import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import BrowserFrame from "@/components/BrowserFrame";
import EmptyState from "@/components/EmptyState";
import { useProjects } from "@/hooks/useProjects";
import { useAssets } from "@/hooks/useAssets";
import { getAssetUrl } from "@/lib/supabase-helpers";
import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey, tField } from "@/lib/i18n";

export default function Prosjekter() {
  const { locale } = useLocale();
  const { data: projects, isLoading } = useProjects();

  return (
    <Layout>
      <SeoHead
        title={tKey("Prosjekter | Alt jeg skaper", "Projects | What I create", locale)}
        description={tKey("Utvalgte prosjekter – nettsider og plattformer jeg har bygget.", "Selected projects – websites and platforms I've built.", locale)}
        pathname="/prosjekter"
      />
      <section className="container pt-16 pb-24">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-16">
          {tKey("Prosjekter", "Projects", locale)}
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">{tKey("Laster…", "Loading…", locale)}</p>
        ) : !projects || projects.length === 0 ? (
          <EmptyState
            message={tKey("Ingen prosjekter publisert ennå", "No projects published yet", locale)}
            sub={tKey("Bygger nå.", "Building now.", locale)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p) => (
              <ProjectListItem key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

function ProjectListItem({ project }: { project: any }) {
  const { locale, withLocalePath } = useLocale();
  const { data: assets } = useAssets("project", project.id);
  const firstAsset = assets?.[0];
  const title = tField(project, "title", locale);
  const subtitle = tField(project, "subtitle", locale);
  const role = tField(project, "role", locale);

  return (
    <Link to={withLocalePath(`/prosjekter/${project.slug}`)} className="block group">
      <BrowserFrame url={project.url || project.slug}>
        {firstAsset ? (
          <img
            src={getAssetUrl(firstAsset.storage_bucket, firstAsset.storage_path)}
            alt={firstAsset.alt || title}
            width={firstAsset.width ?? undefined}
            height={firstAsset.height ?? undefined}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-mono text-sm">{title}</span>
          </div>
        )}
      </BrowserFrame>
      <div className="mt-4">
        <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        {role && <p className="text-xs font-mono text-muted-foreground mt-1">{role}</p>}
      </div>
    </Link>
  );
}

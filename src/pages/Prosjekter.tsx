import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/SectionHeader";
import BrowserFrame from "@/components/BrowserFrame";
import EmptyState from "@/components/EmptyState";
import { useProjects } from "@/hooks/useProjects";
import { useAssets } from "@/hooks/useAssets";
import { getAssetUrl } from "@/lib/supabase-helpers";
import { Link } from "react-router-dom";

export default function Prosjekter() {
  const { data: projects, isLoading } = useProjects();

  return (
    <Layout>
      <section className="container pt-16 pb-24">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-16">
          Prosjekter
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Laster…</p>
        ) : !projects || projects.length === 0 ? (
          <EmptyState message="Ingen prosjekter publisert ennå" sub="Bygger nå." />
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
  const { data: assets } = useAssets("project", project.id);
  const firstAsset = assets?.[0];

  return (
    <Link to={`/prosjekter/${project.slug}`} className="block group">
      <BrowserFrame url={project.url || project.slug}>
        {firstAsset ? (
          <img
            src={getAssetUrl(firstAsset.storage_bucket, firstAsset.storage_path)}
            alt={firstAsset.alt || project.title}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-mono text-sm">{project.title}</span>
          </div>
        )}
      </BrowserFrame>
      <div className="mt-4">
        <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h2>
        {project.subtitle && <p className="text-sm text-muted-foreground mt-1">{project.subtitle}</p>}
        {project.role && <p className="text-xs font-mono text-muted-foreground mt-1">{project.role}</p>}
      </div>
    </Link>
  );
}

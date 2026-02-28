import Layout from "@/components/layout/Layout";
import heroPortrait from "@/assets/hero-portrait.jpg";
import SeoHead from "@/components/SeoHead";
import SectionHeader from "@/components/SectionHeader";
import BrowserFrame from "@/components/BrowserFrame";
import CTAButton from "@/components/CTAButton";
import EmptyState from "@/components/EmptyState";
import { useProjects } from "@/hooks/useProjects";
import { usePublishedContentByType } from "@/hooks/useContentItems";
import { useAssets } from "@/hooks/useAssets";
import { getAssetUrl } from "@/lib/supabase-helpers";
import { getBaseUrl, PERSON_NAME } from "@/lib/seo";
import { Link } from "react-router-dom";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON_NAME,
  jobTitle: "Builder / Musiker / Arrangør",
  url: typeof window !== "undefined" ? getBaseUrl() : "",
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Alt jeg skaper",
  url: typeof window !== "undefined" ? getBaseUrl() : "",
};

export default function Index() {
  return (
    <Layout>
      <SeoHead
        title="Alt jeg skaper | Peder August Halvorsen"
        description="Jeg bygger fleksible plattformer og nettsteder. Arrangør og musiker. Peder August Halvorsen – Alt jeg skaper."
        pathname="/"
        jsonLd={[personSchema, webSiteSchema]}
      />
      <Hero />
      <ArbeidSection />
      <BuildingNowSection />
    </Layout>
  );
}

function Hero() {
  return (
    <section className="container pt-20 pb-24 md:pt-32 md:pb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-none">
            Alt jeg skaper<Link to="/dashboard/login" className="text-primary hover:brightness-110 transition-colors">.</Link>
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-display font-semibold text-foreground/60 tracking-tight">
            Peder August Halvorsen
          </p>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-xl font-body leading-relaxed">
            Jeg bygger fleksible plattformer og nettsteder. Arrangør og musiker.
          </p>
          <p className="mt-3 text-base text-muted-foreground max-w-lg font-body">
            Jeg gir deg verktøy og retning, så du kan gjøre mer selv.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <CTAButton to="/brief">Fortell meg hva du prøver å få til</CTAButton>
            <CTAButton to="/prat" variant="outline">Book uforpliktende prat</CTAButton>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <img
            src={heroPortrait}
            alt="Peder August Halvorsen"
            className="aspect-square object-cover w-full max-w-md grayscale"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

function ArbeidSection() {
  const { data: projects, isLoading } = useProjects();

  return (
    <section className="container pb-24">
      <SectionHeader title="Arbeid" subtitle="Utvalgte prosjekter" />
      {isLoading ? (
        <div className="py-8 text-muted-foreground text-sm">Laster…</div>
      ) : !projects || projects.length === 0 ? (
        <EmptyState message="Ingen prosjekter ennå" sub="Bygger nå — kommer snart." />
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </section>
  );
}

function ProjectGrid({ projects }: { projects: any[] }) {
  const featured = projects[0];
  const rest = projects.slice(1, 7);

  return (
    <div className="space-y-12">
      {featured && <FeaturedProject project={featured} />}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
      <div className="pt-4">
        <Link to="/prosjekter" className="text-sm font-mono text-primary hover:underline underline-offset-4">
          Se alle prosjekter →
        </Link>
      </div>
    </div>
  );
}

function FeaturedProject({ project }: { project: any }) {
  const { data: assets } = useAssets("project", project.id);
  const firstAsset = assets?.[0];

  return (
    <Link to={`/prosjekter/${project.slug}`} className="block group">
      <BrowserFrame url={project.url || project.slug}>
        {firstAsset ? (
          <img
            src={getAssetUrl(firstAsset.storage_bucket, firstAsset.storage_path)}
            alt={firstAsset.alt || project.title}
            width={firstAsset.width ?? undefined}
            height={firstAsset.height ?? undefined}
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
        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
        )}
      </div>
    </Link>
  );
}

function ProjectCard({ project }: { project: any }) {
  const { data: assets } = useAssets("project", project.id);
  const firstAsset = assets?.[0];

  return (
    <Link to={`/prosjekter/${project.slug}`} className="block group">
      <BrowserFrame url={project.url || project.slug}>
        {firstAsset ? (
          <img
            src={getAssetUrl(firstAsset.storage_bucket, firstAsset.storage_path)}
            alt={firstAsset.alt || project.title}
            width={firstAsset.width ?? undefined}
            height={firstAsset.height ?? undefined}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-mono text-xs">{project.title}</span>
          </div>
        )}
      </BrowserFrame>
      <h3 className="mt-3 font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
        {project.title}
      </h3>
      {project.role && (
        <p className="mt-0.5 text-xs font-mono text-muted-foreground">{project.role}</p>
      )}
    </Link>
  );
}

function BuildingNowSection() {
  const { data: items } = usePublishedContentByType("build");
  const buildLogs = items?.slice(0, 5);

  return (
    <section className="container pb-24">
      <SectionHeader title="Nå bygger jeg" />
      {!buildLogs || buildLogs.length === 0 ? (
        <EmptyState message="Alltid i bevegelse" sub="Oppdateringer kommer snart." />
      ) : (
        <ul className="divide-y divide-border">
          {buildLogs.map((item) => (
            <li key={item.id} className="py-3 flex items-baseline justify-between">
              <Link to={`/na-bygger-jeg/${item.slug}`} className="text-foreground font-body hover:text-primary transition-colors">
                {item.title}
              </Link>
              {item.published_at && (
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(item.published_at).toLocaleDateString("nb-NO")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="pt-4">
        <Link to="/na-bygger-jeg" className="text-sm font-mono text-primary hover:underline underline-offset-4">
          Se alt →
        </Link>
      </div>
    </section>
  );
}

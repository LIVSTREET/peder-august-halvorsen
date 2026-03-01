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
import { useLocale } from "@/contexts/LocaleContext";
import { tKey, tField } from "@/lib/i18n";

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
  const { locale } = useLocale();
  const title = locale === "en" ? "What I create | Peder August Halvorsen" : "Alt jeg skaper | Peder August Halvorsen";
  const description = locale === "en"
    ? "I build flexible platforms and websites. Organiser and musician. Peder August Halvorsen – What I create."
    : "Jeg bygger fleksible plattformer og nettsteder. Arrangør og musiker. Peder August Halvorsen – Alt jeg skaper.";

  return (
    <Layout>
      <SeoHead title={title} description={description} jsonLd={[personSchema, webSiteSchema]} />
      <Hero />
      <ArbeidSection />
      <BuildingNowSection />
    </Layout>
  );
}

function Hero() {
  const { locale, withLocalePath } = useLocale();

  return (
    <section className="container pt-12 pb-16 md:pt-32 md:pb-32">
      <div className="flex items-center gap-4 md:hidden mb-6">
        <img
          src={heroPortrait}
          alt="Peder August Halvorsen"
          className="w-16 h-16 object-cover grayscale rounded-full shrink-0"
          loading="eager"
        />
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground leading-none">
            {tKey("Alt jeg skaper", "What I create", locale)}
            <Link to="/dashboard/login" className="text-primary hover:brightness-110 transition-colors">.</Link>
          </h1>
          <p className="mt-1 text-base font-display font-semibold text-foreground/60 tracking-tight">
            {PERSON_NAME}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div>
          <h1 className="hidden md:block font-display text-7xl font-extrabold tracking-tight text-foreground leading-none whitespace-nowrap">
            {tKey("Alt jeg skaper", "What I create", locale)}
            <Link to="/dashboard/login" className="text-primary hover:brightness-110 transition-colors">.</Link>
          </h1>
          <p className="hidden md:block mt-4 text-2xl font-display font-semibold text-foreground/60 tracking-tight">
            {PERSON_NAME}
          </p>
          <p className="mt-4 md:mt-6 text-base md:text-xl text-foreground/80 max-w-xl font-body leading-relaxed">
            {tKey("Jeg bygger fleksible plattformer og nettsteder.", "I build flexible platforms and websites.", locale)}
            <br />
            {tKey("Arrangør og musiker.", "Organiser and musician.", locale)}
          </p>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground max-w-lg font-body">
            {tKey("Jeg gir deg verktøy og retning, så du kan gjøre mer selv.", "I give you tools and direction so you can do more yourself.", locale)}
          </p>
          <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <CTAButton to={withLocalePath("/brief")}>
              {tKey("Fortell meg hva du prøver å få til", "Tell me what you're trying to do", locale)}
            </CTAButton>
            <CTAButton to={withLocalePath("/prat")} variant="outline">
              {tKey("Book uforpliktende prat", "Book a no-commitment chat", locale)}
            </CTAButton>
          </div>
        </div>
        <div className="hidden md:flex justify-end">
          <img
            src={heroPortrait}
            alt="Peder August Halvorsen"
            className="aspect-square object-cover w-full max-w-xs grayscale"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

function ArbeidSection() {
  const { locale, withLocalePath } = useLocale();
  const { data: projects, isLoading } = useProjects();

  return (
    <section className="container pb-24">
      <SectionHeader
        title={tKey("Arbeid", "Work", locale)}
        subtitle={tKey("Utvalgte prosjekter", "Selected projects", locale)}
      />
      {isLoading ? (
        <div className="py-8 text-muted-foreground text-sm">{tKey("Laster…", "Loading…", locale)}</div>
      ) : !projects || projects.length === 0 ? (
        <EmptyState
          message={tKey("Ingen prosjekter ennå", "No projects yet", locale)}
          sub={tKey("Bygger nå — kommer snart.", "Building now — coming soon.", locale)}
        />
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </section>
  );
}

function ProjectGrid({ projects }: { projects: any[] }) {
  const { locale, withLocalePath } = useLocale();
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
        <Link to={withLocalePath("/prosjekter")} className="text-sm font-mono text-primary hover:underline underline-offset-4">
          {tKey("Se alle prosjekter →", "See all projects →", locale)}
        </Link>
      </div>
    </div>
  );
}

function FeaturedProject({ project }: { project: any }) {
  const { locale, withLocalePath } = useLocale();
  const { data: assets } = useAssets("project", project.id);
  const firstAsset = assets?.[0];

  return (
    <Link to={withLocalePath(`/prosjekter/${project.slug}`)} className="block group">
      <BrowserFrame url={project.url || project.slug}>
        {firstAsset ? (
          <img
            src={getAssetUrl(firstAsset.storage_bucket, firstAsset.storage_path)}
            alt={firstAsset.alt || tField(project, "title", locale)}
            width={firstAsset.width ?? undefined}
            height={firstAsset.height ?? undefined}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-mono text-sm">{tField(project, "title", locale)}</span>
          </div>
        )}
      </BrowserFrame>
      <div className="mt-4">
        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {tField(project, "title", locale)}
        </h3>
        {(project.subtitle || project.subtitle_en) && (
          <p className="mt-1 text-sm text-muted-foreground">{tField(project, "subtitle", locale)}</p>
        )}
      </div>
    </Link>
  );
}

function ProjectCard({ project }: { project: any }) {
  const { locale, withLocalePath } = useLocale();
  const { data: assets } = useAssets("project", project.id);
  const firstAsset = assets?.[0];

  return (
    <Link to={withLocalePath(`/prosjekter/${project.slug}`)} className="block group">
      <BrowserFrame url={project.url || project.slug}>
        {firstAsset ? (
          <img
            src={getAssetUrl(firstAsset.storage_bucket, firstAsset.storage_path)}
            alt={firstAsset.alt || tField(project, "title", locale)}
            width={firstAsset.width ?? undefined}
            height={firstAsset.height ?? undefined}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-mono text-xs">{tField(project, "title", locale)}</span>
          </div>
        )}
      </BrowserFrame>
      <h3 className="mt-3 font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
        {tField(project, "title", locale)}
      </h3>
      {project.role && (
        <p className="mt-0.5 text-xs font-mono text-muted-foreground">{project.role}</p>
      )}
    </Link>
  );
}

function BuildingNowSection() {
  const { locale, withLocalePath } = useLocale();
  const { data: items } = usePublishedContentByType("build");
  const buildLogs = items?.slice(0, 5);

  return (
    <section className="container pb-24">
      <SectionHeader title={tKey("Nå bygger jeg", "Currently building", locale)} />
      {!buildLogs || buildLogs.length === 0 ? (
        <EmptyState
          message={tKey("Alltid i bevegelse", "Always in motion", locale)}
          sub={tKey("Oppdateringer kommer snart.", "Updates coming soon.", locale)}
        />
      ) : (
        <ul className="divide-y divide-border">
          {buildLogs.map((item: any) => (
            <li key={item.id} className="py-3 flex items-baseline justify-between">
              <Link to={withLocalePath(`/na-bygger-jeg/${item.slug}`)} className="text-foreground font-body hover:text-primary transition-colors">
                {tField(item, "title", locale)}
              </Link>
              {item.published_at && (
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(item.published_at).toLocaleDateString(locale === "en" ? "en-GB" : "nb-NO")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="pt-4">
        <Link to={withLocalePath("/na-bygger-jeg")} className="text-sm font-mono text-primary hover:underline underline-offset-4">
          {tKey("Se alt →", "See all →", locale)}
        </Link>
      </div>
    </section>
  );
}

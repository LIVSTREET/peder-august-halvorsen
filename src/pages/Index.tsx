import Layout from "@/components/layout/Layout";
import heroPortraitFallback from "@/assets/hero-portrait.jpg";
import { useState } from "react";
import SeoHead from "@/components/SeoHead";
import SectionHeader from "@/components/SectionHeader";
import ProjectCoverMedia from "@/components/ProjectCoverMedia";
import CTAButton from "@/components/CTAButton";
import EmptyState from "@/components/EmptyState";
import Reveal from "@/components/Reveal";
import { useProjects } from "@/hooks/useProjects";
import { usePublishedContentByType } from "@/hooks/useContentItems";
import { useAssets } from "@/hooks/useAssets";
import { getAssetUrl } from "@/lib/supabase-helpers";
import kursKrageroBefore1 from "@/assets/kurs-kragero-before-1.png";
import kursKrageroAfter1 from "@/assets/kurs-kragero-after-1.png";
import kursKrageroBefore2 from "@/assets/kurs-kragero-before-2.png";
import kursKrageroAfter2 from "@/assets/kurs-kragero-after-2.png";
import { getBaseUrl, PERSON_NAME, SITE_NAME } from "@/lib/seo";
import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey, tField } from "@/lib/i18n";
import { HomeHeroShell } from "@/components/home/HomeHeroShell";
import { HeroTechFooter } from "@/components/home/HeroTechFooter";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  founder: PERSON_NAME,
  url: typeof window !== "undefined" ? getBaseUrl() : "",
  email: "mail@studiopah.no",
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: typeof window !== "undefined" ? getBaseUrl() : "",
};

export default function Index() {
  const { locale } = useLocale();
  const title = locale === "en"
    ? "Studio P.A. Halvorsen — Modern digital craft"
    : "Studio P.A. Halvorsen — Moderne digitalt håndverk";
  const description = locale === "en"
    ? "Studio P.A. Halvorsen builds professional websites and digital systems for small businesses."
    : "Studio P.A. Halvorsen bygger profesjonelle nettsider og digitale systemer for små bedrifter.";

  return (
    <Layout>
      <SeoHead title={title} description={description} jsonLd={[organizationSchema, webSiteSchema]} />
      <Hero />
      <TrustSection />
      <BeforeAfterSection />
      <ArbeidSection />
      <ComparisonSection />
    </Layout>
  );
}

function Hero() {
  const { locale, withLocalePath } = useLocale();
  const cutoutUrl = `${import.meta.env.BASE_URL}hero-portrait-cutout.png`;
  const [portraitSrc, setPortraitSrc] = useState(cutoutUrl);

  const tagline = tKey("Moderne digitalt håndverk", "Modern digital craft", locale);
  const pitch = tKey(
    "Nettsider, SEO og digitale systemer for små bedrifter — ferdig satt opp og enkelt å drifte.",
    "Websites, SEO and digital systems for small businesses — fully built and easy to run.",
    locale
  );

  return (
    <HomeHeroShell>
      {/* Desktop hero — 3-column grid with h1 layered behind portrait */}
      <div className="hidden md:block relative px-10 lg:px-14 pt-20 pb-12">
        {/* Massive h1 sitting behind the portrait */}
        <h1
          className="absolute left-0 right-0 top-[18%] z-[10] text-center font-display font-extrabold uppercase tracking-tighter text-foreground/85 pointer-events-none select-none whitespace-nowrap"
          style={{ fontSize: "clamp(3rem, 9vw, 8rem)", lineHeight: 0.9 }}
        >
          Studio P.&nbsp;A.&nbsp;Halvorsen
        </h1>

        <div className="relative z-20 grid grid-cols-[minmax(0,1fr)_minmax(220px,320px)_minmax(0,1fr)] items-center gap-10">
          {/* LEFT: tagline */}
          <Reveal as="div" className="text-right">
            <p className="text-2xl lg:text-3xl font-display font-semibold text-foreground/70 tracking-tight text-balance">
              {tagline}
            </p>
          </Reveal>

          {/* MIDDLE: portrait */}
          <Reveal delay={100} as="div" className="flex justify-center">
            <img
              src={portraitSrc}
              onError={() => {
                if (portraitSrc !== heroPortraitFallback) setPortraitSrc(heroPortraitFallback);
              }}
              alt={`${PERSON_NAME} — Studio P.A. Halvorsen`}
              className="w-full max-w-[320px] h-auto object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
              loading="eager"
            />
          </Reveal>

          {/* RIGHT: pitch + CTA */}
          <Reveal delay={180} as="div" className="max-w-sm">
            <p className="text-lg lg:text-xl text-foreground/80 font-body leading-relaxed text-balance">
              {pitch}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CTAButton to={withLocalePath("/brief")}>
                {tKey("Send forespørsel", "Send request", locale)}
              </CTAButton>
              <CTAButton to={withLocalePath("/prat")} variant="outline">
                {tKey("Book en prat", "Book a chat", locale)}
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Mobile hero — stacked */}
      <div className="md:hidden relative px-5 pt-10 pb-8">
        <h1
          className="text-center font-display font-extrabold uppercase tracking-tighter text-foreground/85 leading-[0.9]"
          style={{ fontSize: "clamp(2rem, 11vw, 3.25rem)" }}
        >
          Studio P.&nbsp;A.&nbsp;Halvorsen
        </h1>
        <div className="relative -mt-4 flex justify-center">
          <img
            src={portraitSrc}
            onError={() => {
              if (portraitSrc !== heroPortraitFallback) setPortraitSrc(heroPortraitFallback);
            }}
            alt={`${PERSON_NAME} — Studio P.A. Halvorsen`}
            className="w-full max-w-[260px] h-auto object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
            loading="eager"
          />
        </div>
        <p className="mt-2 text-center text-sm font-display font-semibold text-foreground/65 tracking-tight">
          {tagline}
        </p>
        <p className="mt-5 text-[15px] text-foreground/80 font-body leading-relaxed text-center">
          {pitch}
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <CTAButton to={withLocalePath("/brief")} className="w-full text-center">
            {tKey("Send forespørsel", "Send request", locale)}
          </CTAButton>
          <CTAButton to={withLocalePath("/prat")} variant="outline" className="w-full text-center">
            {tKey("Book en prat", "Book a chat", locale)}
          </CTAButton>
        </div>
      </div>

      <HeroTechFooter />
    </HomeHeroShell>
  );
}

function ArbeidSection() {
  const { locale, withLocalePath } = useLocale();
  const { data: projects, isLoading } = useProjects();

  return (
    <section className="container pt-14 pb-16 md:pt-0 md:pb-24">
      <Reveal>
        <SectionHeader
          title={tKey("Arbeid", "Work", locale)}
          subtitle={tKey("Utvalgte prosjekter", "Selected projects", locale)}
          className="mb-8 md:mb-10"
        />
      </Reveal>
      {isLoading ? (
        <div className="py-8 text-muted-foreground text-sm">{tKey("Laster…", "Loading…", locale)}</div>
      ) : !projects || projects.length === 0 ? (
        <EmptyState
          message={tKey("Ingen prosjekter ennå", "No projects yet", locale)}
          sub={tKey("Bygger nå — kommer snart.", "Building now — coming soon.", locale)}
        />
      ) : (
        <Reveal>
          <ProjectGrid projects={projects} />
        </Reveal>
      )}
    </section>
  );
}

function ProjectGrid({ projects }: { projects: any[] }) {
  const { locale, withLocalePath } = useLocale();
  const featured = projects[0];
  const rest = projects.slice(1, 7);

  return (
    <div className="space-y-8 md:space-y-12">
      {featured && <FeaturedProject project={featured} />}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      )}
      <div className="pt-2 md:pt-4">
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
    <Link to={withLocalePath(`/prosjekter/${project.slug}`)} className="block group rounded-[18px] overflow-hidden shadow-md shadow-black/10 hover:shadow-lg transition-shadow">
      <ProjectCoverMedia
        presentation={(project as any).presentation}
        frameUrl={project.url || project.slug}
        src={firstAsset ? getAssetUrl(firstAsset.storage_bucket, firstAsset.storage_path) : null}
        alt={firstAsset?.alt || tField(project, "title", locale)}
        width={firstAsset?.width}
        height={firstAsset?.height}
        fallbackLabel={tField(project, "title", locale)}
        variant="featured"
      />
      <div className="mt-1.5 md:mt-3 px-1">
        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {tField(project, "title", locale)}
        </h3>
        {(project.subtitle || project.subtitle_en) && (
          <p className="mt-0.5 text-sm text-muted-foreground">{tField(project, "subtitle", locale)}</p>
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
    <Link to={withLocalePath(`/prosjekter/${project.slug}`)} className="block group rounded-[18px] overflow-hidden shadow-sm shadow-black/10 hover:shadow-md transition-shadow">
      <ProjectCoverMedia
        presentation={(project as any).presentation}
        frameUrl={project.url || project.slug}
        src={firstAsset ? getAssetUrl(firstAsset.storage_bucket, firstAsset.storage_path) : null}
        alt={firstAsset?.alt || tField(project, "title", locale)}
        width={firstAsset?.width}
        height={firstAsset?.height}
        fallbackLabel={tField(project, "title", locale)}
        variant="card"
      />
      <div className="mt-1.5 px-1 pb-2">
        <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {tField(project, "title", locale)}
        </h3>
        {project.role && (
          <p className="mt-0.5 text-xs font-mono text-muted-foreground">{project.role}</p>
        )}
      </div>
    </Link>
  );
}

function BuildingNowSection() {
  const { locale, withLocalePath } = useLocale();
  const { data: items } = usePublishedContentByType("build");
  const buildLogs = items?.slice(0, 5);

  return (
    <section className="container pt-14 md:pt-12 pb-20 md:pb-36 border-t border-border/70">
      <Reveal>
        <SectionHeader title={tKey("Nå bygger jeg", "Currently building", locale)} className="mt-6 md:mt-12 mb-8 md:mb-10" />
      </Reveal>
      {!buildLogs || buildLogs.length === 0 ? (
        <EmptyState
          message={tKey("Alltid i bevegelse", "Always in motion", locale)}
          sub={tKey("Oppdateringer kommer snart.", "Updates coming soon.", locale)}
        />
      ) : (
        <ul className="divide-y divide-border">
          {buildLogs.map((item: any, i: number) => (
            <Reveal as="li" key={item.id} delay={i * 60} className="py-4 flex items-baseline justify-between gap-4">
              <Link to={withLocalePath(`/na-bygger-jeg/${item.slug}`)} className="text-foreground font-body hover:text-primary transition-colors">
                {tField(item, "title", locale)}
              </Link>
              {item.published_at && (
                <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0 ml-4">
                  {new Date(item.published_at).toLocaleDateString(locale === "en" ? "en-GB" : "nb-NO")}
                </span>
              )}
            </Reveal>
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

function TrustSection() {
  const { locale, withLocalePath } = useLocale();

  const points = locale === "en"
    ? [
        { k: "Structure", v: "Clear architecture — not a pile of pages." },
        { k: "SEO", v: "Technical SEO and fast load, baked in." },
        { k: "Easy to run", v: "An admin you actually understand." },
        { k: "Ownership", v: "You own the code, data and domain." },
      ]
    : [
        { k: "Struktur", v: "Tydelig arkitektur — ikke en haug med sider." },
        { k: "SEO", v: "Teknisk SEO og rask lasting fra start." },
        { k: "Enkel drift", v: "Et admin du faktisk forstår." },
        { k: "Eierskap", v: "Du eier koden, dataen og domenet." },
      ];

  const steps = locale === "en"
    ? [
        { n: "01", t: "Request", d: "You send a short request or we have a chat." },
        { n: "02", t: "Structure", d: "I scope, sketch the architecture and write the copy." },
        { n: "03", t: "Build", d: "Built as a real, modern stack — not a tower of plugins." },
        { n: "04", t: "Launch", d: "We go live. You can update content yourself." },
      ]
    : [
        { n: "01", t: "Forespørsel", d: "Du sender en kort forespørsel eller vi tar en prat." },
        { n: "02", t: "Struktur", d: "Jeg setter omfang, skisserer arkitekturen og skriver tekst." },
        { n: "03", t: "Bygging", d: "Bygges på en ekte, moderne stack — ikke et tårn av plugins." },
        { n: "04", t: "Lansering", d: "Vi går live. Du kan oppdatere innholdet selv." },
      ];

  return (
    <section className="container py-16 md:py-16 border-t border-border/70">
      <Reveal>
      <SectionHeader
        title={tKey("Slik jobber jeg", "How I work", locale)}
        subtitle={tKey(
          "Ferdige løsninger for små bedrifter — ikke et tårn av plugins.",
          "Finished solutions for small businesses — not a tower of plugins.",
          locale
        )}
      />
      </Reveal>

      <div className="max-w-4xl mx-auto space-y-12 md:space-y-12">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-8">
          {points.map((p, i) => (
            <Reveal as="li" key={p.k} delay={i * 70} className="flex flex-col gap-2">
              <span className="text-[10px] md:text-[11px] font-mono text-primary uppercase tracking-widest">
                {p.k}
              </span>
              <p className="font-display text-foreground text-lg md:text-xl leading-snug">
                {p.v}
              </p>
            </Reveal>
          ))}
        </ul>

        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
            {tKey("Prosess", "Process", locale)}
          </p>
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 70} className="border border-border/70 p-4">
                <p className="text-xs font-mono text-primary">{s.n}</p>
                <p className="font-display font-bold text-foreground text-sm md:text-base mt-1.5">{s.t}</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{s.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="border-t border-border/60 pt-6 md:pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-display text-lg md:text-xl text-foreground">
            {tKey("Klar for å bygge noe solid?", "Ready to build something solid?", locale)}
          </p>
          <div className="flex flex-wrap gap-3">
            <CTAButton to={withLocalePath("/brief")}>
              {tKey("Send forespørsel", "Send request", locale)}
            </CTAButton>
            <CTAButton to={withLocalePath("/prat")} variant="outline">
              {tKey("Book en prat", "Book a chat", locale)}
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const { locale, withLocalePath } = useLocale();

  const rows = locale === "en"
    ? [
        { k: "Structure", a: "Template — limited by what the builder allows", b: "Tailored structure built around your content" },
        { k: "SEO", a: "Generic, depends on third-party plugins", b: "Technical SEO and semantic HTML from day one" },
        { k: "Performance", a: "Heavy themes, slow on mobile", b: "Lightweight modern stack, fast on mobile" },
        { k: "Admin", a: "Many menus, often confusing", b: "Simple admin in plain language" },
        { k: "Extending", a: "More plugins → more risk", b: "Real code — easy to extend without rebuilding" },
        { k: "Ownership", a: "Locked to a platform and subscription", b: "You own code, database and domain" },
        { k: "Support", a: "Chat queue, generic answers", b: "Direct line to the person who built it" },
      ]
    : [
        { k: "Struktur", a: "Mal — begrenset av hva byggeren tillater", b: "Skreddersydd struktur bygget rundt innholdet ditt" },
        { k: "SEO", a: "Generisk, avhenger av tredjeparts-plugins", b: "Teknisk SEO og semantisk HTML fra dag én" },
        { k: "Ytelse", a: "Tunge temaer, treg på mobil", b: "Lett, moderne stack — rask på mobil" },
        { k: "Admin", a: "Mange menyer, ofte forvirrende", b: "Enkelt admin på vanlig norsk" },
        { k: "Videreutvikling", a: "Flere plugins → mer risiko", b: "Ekte kode — enkelt å bygge videre uten å starte på nytt" },
        { k: "Eierskap", a: "Låst til plattform og abonnement", b: "Du eier kode, database og domene" },
        { k: "Support", a: "Chat-kø, generelle svar", b: "Direkte linje til den som har bygd det" },
      ];

  return (
    <section className="container py-16 md:py-24 border-t border-border/70">
      <Reveal>
      <SectionHeader
        title={tKey("Hvorfor ikke bare en standard nettsidebygger?", "Why not just a standard site builder?", locale)}
        subtitle={tKey(
          "Wix, Squarespace og lignende fungerer fint til mye. Men en skikkelig studio-bygd løsning gir deg noe annet.",
          "Wix, Squarespace and similar work for a lot of things. But a proper studio-built solution gives you something different.",
          locale
        )}
      />
      </Reveal>

      <div className="border border-border/70 overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr] bg-muted/30">
          <div className="px-4 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground" />
          <div className="px-4 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground border-l border-border/70">
            {tKey("Standard nettsidebygger", "Standard site builder", locale)}
          </div>
          <div className="px-4 py-3 text-xs font-mono uppercase tracking-widest text-primary border-l border-border/70">
            Studio P.A. Halvorsen
          </div>
        </div>
        <ul className="divide-y divide-border/70">
          {rows.map((r) => (
            <li key={r.k} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr]">
              <div className="px-4 py-3 font-display font-semibold text-foreground text-sm md:text-base md:border-r md:border-border/70 bg-muted/20 md:bg-transparent">
                {r.k}
              </div>
              <div className="px-4 py-3 text-sm text-muted-foreground md:border-r md:border-border/70">
                <span className="md:hidden text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 block mb-1">
                  {tKey("Standard", "Standard", locale)}
                </span>
                {r.a}
              </div>
              <div className="px-4 py-3 text-sm text-foreground/90">
                <span className="md:hidden text-[10px] font-mono uppercase tracking-widest text-primary block mb-1">
                  Studio P.A. Halvorsen
                </span>
                {r.b}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <CTAButton to={withLocalePath("/brief")}>
          {tKey("Send forespørsel", "Send request", locale)}
        </CTAButton>
        <CTAButton to={withLocalePath("/prat")} variant="outline">
          {tKey("Book en prat", "Book a chat", locale)}
        </CTAButton>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  const { locale } = useLocale();
  const pairs = [
    {
      before: kursKrageroBefore1,
      after: kursKrageroAfter1,
      caption: tKey("Forside", "Front page", locale),
    },
    {
      before: kursKrageroBefore2,
      after: kursKrageroAfter2,
      caption: tKey("Tjenester / kurs", "Services / courses", locale),
    },
  ];

  return (
    <section className="container py-16 md:py-24 border-t border-border/70">
      <Reveal>
      <SectionHeader
        title={tKey("Før og etter", "Before and after", locale)}
        subtitle={tKey(
          "Et eksempel: Kurs Kragerø — fra gammel side til ny.",
          "An example: Kurs Kragerø — from old site to new.",
          locale
        )}
      />
      </Reveal>
      <div className="space-y-12 md:space-y-14">
        {pairs.map((pair, idx) => (
          <Reveal key={idx} delay={idx * 100}>
            {pair.caption && (
              <p className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {pair.caption}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <BeforeAfterCard src={pair.before} label={tKey("Før", "Before", locale)} variant="before" />
              <BeforeAfterCard src={pair.after} label={tKey("Etter", "After", locale)} variant="after" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BeforeAfterCard({ src, label, variant }: { src: string; label: string; variant: "before" | "after" }) {
  return (
    <figure className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className={
            "text-[10px] font-mono uppercase tracking-widest px-2 py-1 border " +
            (variant === "after"
              ? "text-primary border-primary/40"
              : "text-muted-foreground border-border/70")
          }
        >
          {label}
        </span>
      </div>
      <div className="overflow-hidden border border-border/70 bg-muted/20">
        <img
          src={src}
          alt={label}
          className={
            "w-full aspect-video object-cover " +
            (variant === "before" ? "grayscale opacity-90" : "")
          }
          loading="lazy"
        />
      </div>
    </figure>
  );
}

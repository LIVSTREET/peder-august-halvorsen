import Layout from "@/components/layout/Layout";
import heroPortrait from "@/assets/hero-portrait.jpg";
import logoPah from "@/assets/logo-pah.png";
import SeoHead from "@/components/SeoHead";
import SectionHeader from "@/components/SectionHeader";
import BrowserFrame from "@/components/BrowserFrame";
import CTAButton from "@/components/CTAButton";
import EmptyState from "@/components/EmptyState";
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
      <BuildingNowSection />
    </Layout>
  );
}

function Hero() {
  const { locale, withLocalePath } = useLocale();

  return (
    <section className="container pt-6 pb-8 md:pt-32 md:pb-32">
      {/* Mobile hero */}
      <div className="md:hidden">
        <h1 className="font-display text-3xl font-extrabold tracking-tighter text-foreground leading-[1.05]">
          {tKey("Studio P.A. Halvorsen", "Studio P.A. Halvorsen", locale)}
          <span className="text-primary">.</span>
        </h1>
        <p className="mt-0.5 text-sm font-display font-semibold text-foreground/50 tracking-tight">
          {tKey("Moderne digitalt håndverk", "Modern digital craft", locale)}
        </p>
        <p className="mt-2 text-[15px] text-foreground/75 max-w-xl font-body leading-snug">
          {tKey(
            "Jeg bygger profesjonelle nettsider og digitale systemer for små bedrifter.",
            "I build professional websites and digital systems for small businesses.",
            locale
          )}
        </p>
        <p className="mt-1 text-sm text-muted-foreground/70 max-w-lg font-body leading-snug">
          {tKey(
            "Nettside, SEO, tekst, skjema, admin og teknisk oppsett — ferdig satt opp og enkelt å drifte.",
            "Website, SEO, copy, forms, admin and technical setup — fully built and easy to run.",
            locale
          )}
        </p>
        <div className="mt-4 flex flex-col gap-1.5">
          <CTAButton to={withLocalePath("/brief")} className="w-full text-center">
            {tKey("Send brief", "Send brief", locale)}
          </CTAButton>
          <CTAButton to={withLocalePath("/prat")} variant="outline" className="w-full text-center px-3 py-1.5 min-h-[36px] text-[11px] border-foreground/15 text-foreground/50">
            {tKey("Book en prat", "Book a chat", locale)}
          </CTAButton>
        </div>
      </div>

      {/* Desktop hero */}
      <div className="hidden md:grid grid-cols-[1.4fr_1fr] gap-20 items-center">
        <div>
          <h1 className="leading-none">
            <img
              src={logoPah}
              alt="Studio P.A. Halvorsen"
              className="w-full max-w-[560px] h-auto -ml-4"
            />
          </h1>
          <p className="mt-4 text-2xl font-display font-semibold text-foreground/60 tracking-tight">
            {tKey("Moderne digitalt håndverk", "Modern digital craft", locale)}
          </p>
          <p className="mt-6 text-xl text-foreground/80 max-w-xl font-body leading-relaxed">
            {tKey(
              "Jeg bygger profesjonelle nettsider og digitale systemer for små bedrifter.",
              "I build professional websites and digital systems for small businesses.",
              locale
            )}
          </p>
          <p className="mt-3 text-base text-muted-foreground max-w-lg font-body">
            {tKey(
              "Nettside, SEO, tekst, skjema, admin, varsler og teknisk oppsett — ferdig satt opp og enkelt å drifte.",
              "Website, SEO, copy, forms, admin, notifications and technical setup — fully built and easy to run.",
              locale
            )}
          </p>
          <div className="mt-10 flex flex-row items-center gap-4">
            <CTAButton to={withLocalePath("/brief")}>
              {tKey("Send brief", "Send brief", locale)}
            </CTAButton>
            <CTAButton to={withLocalePath("/prat")} variant="outline">
              {tKey("Book en prat", "Book a chat", locale)}
            </CTAButton>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="relative w-full max-w-[340px]">
            <img
              src={heroPortrait}
              alt={`${PERSON_NAME} — Studio P.A. Halvorsen`}
              className="object-cover w-full aspect-[3/4] [filter:brightness(0.88)_saturate(0.9)_contrast(1.05)]"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,hsl(var(--background)/0.55)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-background/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArbeidSection() {
  const { locale, withLocalePath } = useLocale();
  const { data: projects, isLoading } = useProjects();

  return (
    <section className="container pb-12 md:pb-24">
      <SectionHeader
        title={tKey("Arbeid", "Work", locale)}
        subtitle={tKey("Utvalgte prosjekter", "Selected projects", locale)}
        className="mb-6 md:mb-10"
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
    <div className="space-y-8 md:space-y-12">
      {featured && <FeaturedProject project={featured} />}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((p) => (
            <ProjectCard key={p.id} project={p} />
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
      <BrowserFrame url={project.url || project.slug} className="rounded-t-2xl border-border/60">
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
      <BrowserFrame url={project.url || project.slug} className="rounded-t-2xl border-border/60">
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
    <section className="container pt-6 md:pt-12 pb-16 md:pb-36 border-t border-border/70">
      <SectionHeader title={tKey("Nå bygger jeg", "Currently building", locale)} className="mt-6 md:mt-12" />
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
                <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0 ml-4">
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

function TrustSection() {
  const { locale, withLocalePath } = useLocale();

  const points = locale === "en"
    ? [
        { k: "Structure", v: "Clear information architecture and content model — not a pile of pages." },
        { k: "SEO", v: "Built-in technical SEO, fast load, semantic HTML, sitemap and metadata." },
        { k: "Easy to run", v: "Editor-friendly admin in plain language. You own your content." },
        { k: "Ownership", v: "You own the code, the database and the domain. No lock-in." },
      ]
    : [
        { k: "Struktur", v: "Tydelig informasjonsarkitektur og innholdsmodell — ikke en haug med sider." },
        { k: "SEO", v: "Teknisk SEO, rask lasting, semantisk HTML, sitemap og metadata fra start." },
        { k: "Enkel drift", v: "Et admin du faktisk forstår. Du eier innholdet ditt." },
        { k: "Eierskap", v: "Du eier koden, databasen og domenet. Ingen lock-in." },
      ];

  const steps = locale === "en"
    ? [
        { n: "01", t: "Brief", d: "You send a short brief or we have a chat." },
        { n: "02", t: "Structure", d: "I scope, sketch the architecture and write the copy." },
        { n: "03", t: "Build", d: "Built as a real, modern stack — not a tower of plugins." },
        { n: "04", t: "Launch", d: "We go live. You can update content yourself." },
      ]
    : [
        { n: "01", t: "Brief", d: "Du sender en kort brief eller vi tar en prat." },
        { n: "02", t: "Struktur", d: "Jeg setter omfang, skisserer arkitekturen og skriver tekst." },
        { n: "03", t: "Bygging", d: "Bygges på en ekte, moderne stack — ikke et tårn av plugins." },
        { n: "04", t: "Lansering", d: "Vi går live. Du kan oppdatere innholdet selv." },
      ];

  return (
    <section className="container py-12 md:py-24 border-t border-border/70">
      <SectionHeader
        title={tKey("Slik jobber jeg", "How I work", locale)}
        subtitle={tKey(
          "Ferdige løsninger for små bedrifter — ikke et tårn av plugins.",
          "Finished solutions for small businesses — not a tower of plugins.",
          locale
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start">
        <div className="md:col-span-1">
          <img
            src={heroPortrait}
            alt={`${PERSON_NAME} — Studio P.A. Halvorsen`}
            className="w-40 md:w-full max-w-[220px] aspect-square object-cover grayscale"
            loading="lazy"
          />
          <p className="mt-4 text-sm text-muted-foreground font-body leading-relaxed">
            {tKey(
              "Jeg er Peder August Halvorsen. Jeg bygger nettsider og digitale systemer som er trygge å drifte og enkle å bygge videre på.",
              "I'm Peder August Halvorsen. I build websites and digital systems that are safe to run and easy to extend.",
              locale
            )}
          </p>
        </div>

        <div className="md:col-span-2 space-y-10">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {points.map((p) => (
              <li key={p.k}>
                <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1.5">{p.k}</p>
                <p className="text-foreground/85 text-sm leading-relaxed">{p.v}</p>
              </li>
            ))}
          </ul>

          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
              {tKey("Prosess", "Process", locale)}
            </p>
            <ol className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((s) => (
                <li key={s.n} className="border border-border/70 p-3">
                  <p className="text-[10px] font-mono text-primary">{s.n}</p>
                  <p className="font-display font-bold text-foreground mt-1">{s.t}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <CTAButton to={withLocalePath("/tjenester")} variant="outline">
              {tKey("Se tjenester", "See services", locale)}
            </CTAButton>
            <CTAButton to={withLocalePath("/brief")}>
              {tKey("Send brief", "Send brief", locale)}
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
    <section className="container py-12 md:py-24 border-t border-border/70">
      <SectionHeader
        title={tKey("Hvorfor ikke bare en standard nettsidebygger?", "Why not just a standard site builder?", locale)}
        subtitle={tKey(
          "Wix, Squarespace og lignende fungerer fint til mye. Men en skikkelig studio-bygd løsning gir deg noe annet.",
          "Wix, Squarespace and similar work for a lot of things. But a proper studio-built solution gives you something different.",
          locale
        )}
      />

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
          {tKey("Send brief", "Send brief", locale)}
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
    <section className="container py-12 md:py-24 border-t border-border/70">
      <SectionHeader
        title={tKey("Før og etter", "Before and after", locale)}
        subtitle={tKey(
          "Et eksempel: Kurs Kragerø — fra gammel side til ny.",
          "An example: Kurs Kragerø — from old site to new.",
          locale
        )}
      />
      <div className="space-y-10 md:space-y-14">
        {pairs.map((pair, idx) => (
          <div key={idx}>
            {pair.caption && (
              <p className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {pair.caption}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <BeforeAfterCard src={pair.before} label={tKey("Før", "Before", locale)} variant="before" />
              <BeforeAfterCard src={pair.after} label={tKey("Etter", "After", locale)} variant="after" />
            </div>
          </div>
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

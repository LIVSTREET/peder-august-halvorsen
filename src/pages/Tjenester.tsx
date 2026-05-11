import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import SectionHeader from "@/components/SectionHeader";
import CTAButton from "@/components/CTAButton";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey } from "@/lib/i18n";
import { SITE_NAME, getBaseUrl } from "@/lib/seo";

const services: Array<{
  titleNo: string;
  titleEn: string;
  whatNo: string[];
  whatEn: string[];
  fitsNo: string[];
  fitsEn: string[];
}> = [
  {
    titleNo: "Nettsider",
    titleEn: "Websites",
    whatNo: [
      "Raske, responsive nettsider med moderne teknologi",
      "CMS-løsninger du kan oppdatere selv",
      "SEO-optimalisering og ytelse",
      "Integrasjoner med eksisterende systemer",
    ],
    whatEn: [
      "Fast, responsive websites with modern tech",
      "CMS solutions you can update yourself",
      "SEO and performance",
      "Integrations with existing systems",
    ],
    fitsNo: ["Små bedrifter", "Frilansere", "Organisasjoner", "Kreative prosjekter"],
    fitsEn: ["Small businesses", "Freelancers", "Organisations", "Creative projects"],
  },
  {
    titleNo: "Plattformer",
    titleEn: "Platforms",
    whatNo: [
      "Brukerinnlogging og dashboard",
      "Booking-, bestillings- eller medlemssystemer",
      "Automatisering av manuelle prosesser",
      "Skreddersydde admin-paneler",
    ],
    whatEn: [
      "User login and dashboards",
      "Booking, ordering or membership systems",
      "Automating manual processes",
      "Custom admin panels",
    ],
    fitsNo: ["Gründere", "Organisasjoner som trenger interne verktøy", "SaaS-ideer i tidlig fase"],
    fitsEn: ["Founders", "Organisations that need internal tools", "Early-stage SaaS ideas"],
  },
  {
    titleNo: "Booking / Musikk",
    titleEn: "Booking / Music",
    whatNo: [
      "Komplett booking-håndtering for musikkgrupper",
      "Repertoar- og setliste-planlegging",
      "Teknisk rider og stageplan",
      "Koordinering med arrangører",
    ],
    whatEn: [
      "Full booking handling for bands",
      "Repertoire and setlist planning",
      "Tech rider and stage plan",
      "Coordination with promoters",
    ],
    fitsNo: ["Musikkgrupper", "Arrangører", "Kirker og organisasjoner"],
    fitsEn: ["Bands", "Promoters", "Churches and organisations"],
  },
  {
    titleNo: "Sparring",
    titleEn: "Sparring",
    whatNo: [
      "Gjennomgang av eksisterende løsning",
      "Teknisk rådgivning og retning",
      "Hjelp til å velge riktig stack",
      "Prioritering og veikart",
    ],
    whatEn: [
      "Review of existing solutions",
      "Technical advice and direction",
      "Help choosing the right stack",
      "Prioritisation and roadmap",
    ],
    fitsNo: ["Deg som bygger selv men trenger retning", "Små team uten teknisk leder"],
    fitsEn: ["You building yourself but needing direction", "Small teams without a tech lead"],
  },
];

export default function Tjenester() {
  const { locale, withLocalePath } = useLocale();

  const baseUrl = getBaseUrl();

  const serviceSchemas = services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: locale === "en" ? s.titleEn : s.titleNo,
    serviceType: locale === "en" ? s.titleEn : s.titleNo,
    provider: { "@type": "Organization", name: SITE_NAME, url: baseUrl },
    areaServed: "NO",
    description: (locale === "en" ? s.whatEn : s.whatNo).join(". "),
  }));

  const faqs = locale === "en"
    ? [
        { q: "What does a website cost?", a: "Most small business sites land between 15,000 and 50,000 NOK depending on scope. You get a fixed price after the request." },
        { q: "How long does it take?", a: "A typical small business site takes 2–4 weeks from approved scope to launch." },
        { q: "Can I update the site myself?", a: "Yes. You get a simple admin panel in plain language and full ownership of content and code." },
        { q: "Do you do SEO?", a: "Technical SEO, semantic HTML, sitemap, metadata and performance are built in from day one." },
      ]
    : [
        { q: "Hva koster en nettside?", a: "De fleste nettsider for små bedrifter ligger mellom 15 000 og 50 000 kr avhengig av omfang. Du får fast pris etter at vi har mottatt forespørselen." },
        { q: "Hvor lang tid tar det?", a: "En typisk nettside for små bedrifter tar 2–4 uker fra godkjent omfang til lansering." },
        { q: "Kan jeg oppdatere siden selv?", a: "Ja. Du får et enkelt admin-panel på vanlig norsk og fullt eierskap til innhold og kode." },
        { q: "Driver du med SEO?", a: "Teknisk SEO, semantisk HTML, sitemap, metadata og ytelse er bygget inn fra dag én." },
      ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Layout>
      <SeoHead
        title={tKey("Tjenester | Studio P.A. Halvorsen", "Services | Studio P.A. Halvorsen", locale)}
        description={tKey(
          "Nettsider, plattformer og digitale systemer for små bedrifter i Norge. Fast pris, enkel drift, fullt eierskap.",
          "Websites, platforms and digital systems for small businesses in Norway. Fixed price, easy to run, full ownership.",
          locale
        )}
        jsonLd={[...serviceSchemas, faqSchema]}
      />
      <section className="container pt-16 pb-24">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {tKey("Tjenester", "Services", locale)}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-16">
          {tKey(
            "Jeg hjelper deg å bygge noe som fungerer — og som du forstår.",
            "I help you build something that works — and that you understand.",
            locale
          )}
        </p>

        <div className="space-y-24">
          {services.map((s, i) => (
            <ServiceSection key={i} service={s} />
          ))}
        </div>

        <div className="mt-24 border-t border-border pt-16">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-8">
            {tKey("Vanlige spørsmål", "Frequently asked", locale)}
          </h2>
          <ul className="divide-y divide-border">
            {faqs.map((f) => (
              <li key={f.q} className="py-5">
                <p className="font-display font-semibold text-foreground mb-1.5">{f.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
}

function ServiceSection({ service }: { service: (typeof services)[0] }) {
  const { locale, withLocalePath } = useLocale();
  const title = locale === "en" ? service.titleEn : service.titleNo;
  const what = locale === "en" ? service.whatEn : service.whatNo;
  const fits = locale === "en" ? service.fitsEn : service.fitsNo;

  return (
    <div>
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div>
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-4">
            {tKey("Hva du får", "What you get", locale)}
          </p>
          <ul className="space-y-3">
            {what.map((w, i) => (
              <li key={i} className="text-foreground/80 leading-relaxed">— {w}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-mono text-secondary uppercase tracking-widest mb-4">
            {tKey("Passer for", "Good for", locale)}
          </p>
          <ul className="space-y-3">
            {fits.map((f, i) => (
              <li key={i} className="text-foreground/80">— {f}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <CTAButton to={withLocalePath("/brief")} variant="outline">
          {tKey("Start en forespørsel →", "Start a request →", locale)}
        </CTAButton>
      </div>
    </div>
  );
}

import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import SectionHeader from "@/components/SectionHeader";
import CTAButton from "@/components/CTAButton";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey } from "@/lib/i18n";

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

  return (
    <Layout>
      <SeoHead
        title={tKey("Tjenester | Alt jeg skaper", "Services | What I create", locale)}
        description={tKey(
          "Nettsider, plattformer, booking og musikk, sparring. Se hva jeg tilbyr.",
          "Websites, platforms, booking and music, sparring. See what I offer.",
          locale
        )}
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
          {tKey("Start en brief →", "Start a brief →", locale)}
        </CTAButton>
      </div>
    </div>
  );
}

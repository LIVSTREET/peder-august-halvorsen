import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import SectionHeader from "@/components/SectionHeader";
import CTAButton from "@/components/CTAButton";

const services = [
  {
    title: "Nettsider",
    what: [
      "Raske, responsive nettsider med moderne teknologi",
      "CMS-løsninger du kan oppdatere selv",
      "SEO-optimalisering og ytelse",
      "Integrasjoner med eksisterende systemer",
    ],
    fits: ["Små bedrifter", "Frilansere", "Organisasjoner", "Kreative prosjekter"],
    notFits: ["Enterprise-systemer med hundrevis av brukere", "Rene mobilapper"],
  },
  {
    title: "Plattformer",
    what: [
      "Brukerinnlogging og dashboard",
      "Booking-, bestillings- eller medlemssystemer",
      "Automatisering av manuelle prosesser",
      "Skreddersydde admin-paneler",
    ],
    fits: ["Gründere", "Organisasjoner som trenger interne verktøy", "SaaS-ideer i tidlig fase"],
    notFits: ["Prosjekter uten tydelig mål", "Ren frontend uten backend-behov"],
  },
  {
    title: "Booking / Musikk",
    what: [
      "Komplett booking-håndtering for musikkgrupper",
      "Repertoar- og setliste-planlegging",
      "Teknisk rider og stageplan",
      "Koordinering med arrangører",
    ],
    fits: ["Musikkgrupper", "Arrangører", "Kirker og organisasjoner"],
    notFits: ["Store festivaler med egne systemer", "Plateselskaper"],
  },
  {
    title: "Sparring",
    what: [
      "Gjennomgang av eksisterende løsning",
      "Teknisk rådgivning og retning",
      "Hjelp til å velge riktig stack",
      "Prioritering og veikart",
    ],
    fits: ["Deg som bygger selv men trenger retning", "Små team uten teknisk leder"],
    notFits: ["De som vil ha noen til å gjøre alt", "Prosjekter uten eierskap"],
  },
];

export default function Tjenester() {
  return (
    <Layout>
      <SeoHead title="Tjenester | Alt jeg skaper" description="Nettsider, plattformer, booking og musikk, sparring. Se hva jeg tilbyr." pathname="/tjenester" />
      <section className="container pt-16 pb-24">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Tjenester
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-16">
          Jeg hjelper deg å bygge noe som fungerer — og som du forstår.
        </p>

        <div className="space-y-24">
          {services.map((s) => (
            <ServiceSection key={s.title} service={s} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

function ServiceSection({ service }: { service: (typeof services)[0] }) {
  return (
    <div>
      <SectionHeader title={service.title} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div>
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-4">Hva du får</p>
          <ul className="space-y-3">
            {service.what.map((w) => (
              <li key={w} className="text-foreground/80 leading-relaxed">— {w}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-mono text-secondary uppercase tracking-widest mb-4">Passer for</p>
          <ul className="space-y-3">
            {service.fits.map((f) => (
              <li key={f} className="text-foreground/80">— {f}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <CTAButton to="/brief" variant="outline">Start en brief →</CTAButton>
      </div>
    </div>
  );
}

import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import SectionHeader from "@/components/SectionHeader";
import CTAButton from "@/components/CTAButton";

const packages = [
  {
    title: "Konsert / arrangement",
    desc: "Full pakke for konserter, gudstjenester, eller private arrangementer. Inkluderer lydsjekk, repertoar tilpasset anledningen.",
  },
  {
    title: "Session / studio",
    desc: "Musikere til innspilling. Fleksibelt og tilpasset ditt prosjekt.",
  },
  {
    title: "Bakgrunnsmusikk",
    desc: "Diskret, stemningsskapende musikk til events, middager, eller utstillinger.",
  },
];

export default function Musikk() {
  return (
    <Layout>
      <SeoHead title="Musikk | Alt jeg skaper" description="Booking, session, bakgrunnsmusikk – musikk og arrangement." pathname="/musikk" />
      <section className="container pt-16 pb-24">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Musikk
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-16">
          Arrangør, musiker og tilrettelegger. Booking for konserter, gudstjenester og private arrangementer.
        </p>

        <SectionHeader title="Bookingpakker" />
        <div className="space-y-8 mb-20">
          {packages.map((pkg) => (
            <div key={pkg.title} className="border-b border-border pb-6">
              <h3 className="font-display text-lg font-bold text-foreground">{pkg.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{pkg.desc}</p>
            </div>
          ))}
        </div>

        <SectionHeader title="Session" />
        <p className="text-foreground/80 leading-relaxed mb-20">
          Erfaring fra studio og live. Tilgjengelig for innspillinger, arrangementer, og musikalsk rådgivning.
          Ta kontakt for å diskutere ditt prosjekt.
        </p>

        <SectionHeader title="Praktisk" />
        <div className="space-y-3 mb-12">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono text-muted-foreground uppercase w-24 shrink-0">Basert i</span>
            <span className="text-foreground">Norge</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono text-muted-foreground uppercase w-24 shrink-0">Sjangre</span>
            <span className="text-foreground">Pop, gospel, jazz, funk</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono text-muted-foreground uppercase w-24 shrink-0">Utstyr</span>
            <span className="text-foreground">Eget utstyr tilgjengelig</span>
          </div>
        </div>

        <CTAButton to="/brief?goal=booking">Send bookingforespørsel</CTAButton>
      </section>
    </Layout>
  );
}

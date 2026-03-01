import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import SectionHeader from "@/components/SectionHeader";
import CTAButton from "@/components/CTAButton";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey } from "@/lib/i18n";

const packages: Array<{ titleNo: string; titleEn: string; descNo: string; descEn: string }> = [
  {
    titleNo: "Konsert / arrangement",
    titleEn: "Concert / event",
    descNo: "Full pakke for konserter, gudstjenester, eller private arrangementer. Inkluderer lydsjekk, repertoar tilpasset anledningen.",
    descEn: "Full package for concerts, services, or private events. Includes sound check, repertoire tailored to the occasion.",
  },
  {
    titleNo: "Session / studio",
    titleEn: "Session / studio",
    descNo: "Musikere til innspilling. Fleksibelt og tilpasset ditt prosjekt.",
    descEn: "Musicians for recording. Flexible and tailored to your project.",
  },
  {
    titleNo: "Bakgrunnsmusikk",
    titleEn: "Background music",
    descNo: "Diskret, stemningsskapende musikk til events, middager, eller utstillinger.",
    descEn: "Discreet, atmospheric music for events, dinners, or exhibitions.",
  },
];

export default function Musikk() {
  const { locale, withLocalePath } = useLocale();

  return (
    <Layout>
      <SeoHead
        title={tKey("Musikk | Alt jeg skaper", "Music | Alt jeg skaper", locale)}
        description={tKey("Booking, session, bakgrunnsmusikk – musikk og arrangement.", "Booking, session, background music – music and events.", locale)}
      />
      <section className="container pt-16 pb-24">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {tKey("Musikk", "Music", locale)}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-16">
          {tKey(
            "Arrangør, musiker og tilrettelegger. Booking for konserter, gudstjenester og private arrangementer.",
            "Organiser, musician and facilitator. Booking for concerts, services and private events.",
            locale
          )}
        </p>

        <SectionHeader title={tKey("Bookingpakker", "Booking packages", locale)} />
        <div className="space-y-8 mb-20">
          {packages.map((pkg) => (
            <div key={pkg.titleNo} className="border-b border-border pb-6">
              <h3 className="font-display text-lg font-bold text-foreground">
                {locale === "en" ? pkg.titleEn : pkg.titleNo}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {locale === "en" ? pkg.descEn : pkg.descNo}
              </p>
            </div>
          ))}
        </div>

        <SectionHeader title="Session" />
        <p className="text-foreground/80 leading-relaxed mb-20">
          {tKey(
            "Erfaring fra studio og live. Tilgjengelig for innspillinger, arrangementer, og musikalsk rådgivning. Ta kontakt for å diskutere ditt prosjekt.",
            "Experience from studio and live. Available for recordings, events, and musical advice. Get in touch to discuss your project.",
            locale
          )}
        </p>

        <SectionHeader title={tKey("Praktisk", "Practical", locale)} />
        <div className="space-y-3 mb-12">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono text-muted-foreground uppercase w-24 shrink-0">
              {tKey("Basert i", "Based in", locale)}
            </span>
            <span className="text-foreground">{tKey("Norge", "Norway", locale)}</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono text-muted-foreground uppercase w-24 shrink-0">
              {tKey("Sjangre", "Genres", locale)}
            </span>
            <span className="text-foreground">Pop, gospel, jazz, funk</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono text-muted-foreground uppercase w-24 shrink-0">
              {tKey("Utstyr", "Equipment", locale)}
            </span>
            <span className="text-foreground">{tKey("Eget utstyr tilgjengelig", "Own equipment available", locale)}</span>
          </div>
        </div>

        <CTAButton to={withLocalePath("/brief?goal=booking")}>
          {tKey("Send bookingforespørsel", "Send booking request", locale)}
        </CTAButton>
      </section>
    </Layout>
  );
}

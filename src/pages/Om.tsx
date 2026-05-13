import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import CTAButton from "@/components/CTAButton";
import Reveal from "@/components/Reveal";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey } from "@/lib/i18n";
import { Link } from "react-router-dom";
import logoSignature from "@/assets/logo-signature.png";
import { cn } from "@/lib/utils";

const principles = [
  {
    titleNo: "Mennesker først",
    titleEn: "People first",
    bodyNo:
      "Jeg prøver å bygge digitale løsninger som føles like ekte som menneskene bak dem.",
    bodyEn: "I try to build digital work that feels as real as the people behind it.",
  },
  {
    titleNo: "Bygge ting som brukes",
    titleEn: "Build things that get used",
    bodyNo:
      "Et nettsted skal ikke være en dead end. Det skal være stedet arbeid, hobby eller relasjon starter.",
    bodyEn:
      "A website shouldn't be a dead end. It should be where work, a hobby, or a relationship starts.",
  },
  {
    titleNo: "Moderne verktøy, menneskelig resultat",
    titleEn: "Modern tools, human results",
    bodyNo:
      "Jeg bruker AI for å jobbe raskere og smartere — ikke for å gjøre arbeidet upersonlig.",
    bodyEn: "I use AI to work faster and smarter — not to make the work feel impersonal.",
  },
] as const;

export default function Om() {
  const { locale, withLocalePath } = useLocale();

  return (
    <Layout>
      <SeoHead
        title={tKey(
          "Om Studio P.A. Halvorsen – Moderne digitalt håndverk",
          "About Studio P.A. Halvorsen – Modern digital craft",
          locale
        )}
        description={tKey(
          "Jeg bygger moderne nettsider og digitale løsninger med fokus på mennesker, identitet og brukervennlighet.",
          "I build modern websites and digital products with a focus on people, identity and usability.",
          locale
        )}
      />

      {/* Hero */}
      <section className="container pt-12 md:pt-20 pb-16 md:pb-24">
        <Reveal>
          <img
            src={logoSignature}
            alt=""
            aria-hidden="true"
            className="h-10 md:h-12 w-auto object-contain opacity-20 mb-6"
          />
        </Reveal>
        <Reveal delay={100}>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            {tKey("Studio P.A. Halvorsen", "Studio P.A. Halvorsen", locale)}
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-3 text-lg md:text-xl text-muted-foreground font-body">
            {tKey("Moderne digitalt håndverk", "Modern digital craft", locale)}
          </p>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-foreground/80 leading-relaxed">
            {tKey(
              "Jeg bygger moderne nettsider og digitale løsninger med fokus på mennesker, identitet og brukervennlighet.",
              "I build modern websites and digital products with a focus on people, identity and usability.",
              locale
            )}
          </p>
        </Reveal>
        <Reveal delay={400}>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTAButton to={withLocalePath("/prosjekter")} variant="primary">
              {tKey("Se prosjekter", "See work", locale)}
            </CTAButton>
            <CTAButton to={withLocalePath("/prat")} variant="outline">
              {tKey("Ta kontakt", "Get in touch", locale)}
            </CTAButton>
          </div>
        </Reveal>
      </section>

      {/* Kort om meg */}
      <section className="container pb-20 md:pb-28">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-4">
              {tKey("Filosofi", "Philosophy", locale)}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <blockquote className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug">
              {tKey(
                "Teknologi blir mest interessant når den føles menneskelig.",
                "Technology is most interesting when it feels human.",
                locale
              )}
            </blockquote>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 space-y-5 text-foreground/80 leading-relaxed max-w-prose">
              <p>
                {tKey(
                  "Det siste året har jeg vært opptatt av ett spørsmål:",
                  "This past year I've kept coming back to one question:",
                  locale
                )}
              </p>
              <p className="font-display text-xl md:text-2xl font-semibold text-foreground">
                {tKey(
                  "Hvordan kan jeg bruke AI effektivt — uten å outsource meg selv?",
                  "How can I use AI effectively — without outsourcing myself?",
                  locale
                )}
              </p>
              <p>
                {tKey(
                  "Jeg tror de beste digitale løsningene fortsatt bygges gjennom menneskelig forståelse, gode relasjoner og ekte interesse for det man lager.",
                  "I believe the best digital work is still built through human understanding, good relationships and genuine care for what you make.",
                  locale
                )}
              </p>
              <p>
                {tKey(
                  "Derfor prøver jeg å bygge nettsider og digitale produkter som ikke bare ser bra ut, men som faktisk føles riktige å bruke.",
                  "That's why I try to build sites and products that don't only look good — they feel right to use.",
                  locale
                )}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Prinsipper */}
      <section className="container pb-20 md:pb-28">
        <Reveal>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8">
            {tKey("Prinsipper", "Principles", locale)}
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {principles.map((p, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="rounded-2xl border border-border bg-gradient-to-b from-card/40 to-transparent p-6 md:p-8">
                <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">
                  {tKey(p.titleNo, p.titleEn, locale)}
                </h3>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {tKey(p.bodyNo, p.bodyEn, locale)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Utvalgte prosjekter */}
      <section className="container pb-20 md:pb-28">
        <Reveal>
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-8">
            {tKey("Utvalgte prosjekter", "Selected projects", locale)}
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <ProjectCard
            title={tKey("Bilgarasje", "Bilgarasje", locale)}
            description={tKey(
              "Moderne nettsted for bilrelatert tjeneste.",
              "Modern website for a car-related service.",
              locale
            )}
            href="https://bilgarasje.no"
            external
          />
          <ProjectCard
            title={tKey("Pastelly", "Pastelly", locale)}
            description={tKey(
              "Digitale løsninger bygget med omtanke.",
              "Digital solutions built with care.",
              locale
            )}
            href={withLocalePath("/prosjekter")}
            external={false}
          />
          <ProjectCard
            title={tKey("Kurs Kragerø", "Kurs Kragerø", locale)}
            description={tKey(
              "Kurs og opplæring i Kragerø.",
              "Courses and training in Kragerø.",
              locale
            )}
            href={withLocalePath("/prosjekter/kurs-kragero")}
            external={false}
          />
        </div>
      </section>

      {/* Avslutning */}
      <section className="container pb-24 md:pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {tKey("La oss bygge noe ordentlig.", "Let's build something proper.", locale)}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {tKey(
                "Jeg liker å jobbe med mennesker som bryr seg om det de bygger.",
                "I like working with people who care about what they build.",
                locale
              )}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTAButton to={withLocalePath("/brief")} variant="primary">
                {tKey("Start prosjekt", "Start a project", locale)}
              </CTAButton>
              <CTAButton to={withLocalePath("/prat")} variant="outline">
                {tKey("Ta kontakt", "Get in touch", locale)}
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}

function ProjectCard({
  title,
  description,
  href,
  external,
}: {
  title: string;
  description: string;
  href: string;
  external: boolean;
}) {
  const className = cn(
    "group block text-left rounded-2xl md:rounded-3xl border border-border",
    "p-5 md:p-8 lg:p-10",
    "bg-gradient-to-b from-card/30 to-transparent",
    "transition-all duration-300",
    "hover:border-primary/25 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.65)]"
  );

  const content = (
    <>
      <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 mb-5 md:mb-6" />
      <h3 className="font-display text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {content}
    </Link>
  );
}

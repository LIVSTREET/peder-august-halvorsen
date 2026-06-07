import Layout from "@/components/layout/Layout";
import LegalIdentity from "@/components/layout/LegalIdentity";
import SeoHead from "@/components/SeoHead";
import CTAButton from "@/components/CTAButton";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey } from "@/lib/i18n";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/seo";

export default function Prat() {
  const { locale, withLocalePath } = useLocale();

  return (
    <Layout>
      <SeoHead
        title={tKey("Book en prat | Studio P.A. Halvorsen", "Book a chat | Studio P.A. Halvorsen", locale)}
        description={tKey("Book en uforpliktende prat om prosjektet ditt.", "Book a no-commitment chat about your project.", locale)}
      />
      <section className="container pt-16 pb-24 max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {tKey("Prat", "Chat", locale)}
        </h1>
        <p className="text-lg text-muted-foreground mb-3">
          {tKey("La oss ta en uforpliktende prat om det du jobber med.", "Let's have a no-commitment chat about what you're working on.", locale)}
        </p>
        <p className="text-sm font-mono text-primary mb-12">
          {tKey("Svar innen 24 timer på hverdager", "Reply within 24 hours on weekdays", locale)}
        </p>

        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="block border border-border p-5 hover:border-primary transition-colors group"
            >
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                {tKey("E-post", "Email", locale)}
              </p>
              <p className="text-foreground font-display text-lg group-hover:text-primary transition-colors break-all">
                {CONTACT_EMAIL}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {tKey("Foretrukket — du får svar samme dag.", "Preferred — you'll hear back the same day.", locale)}
              </p>
            </a>

            {CONTACT_PHONE ? (
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="block border border-border p-5 hover:border-primary transition-colors group"
              >
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                  {tKey("Telefon", "Phone", locale)}
                </p>
                <p className="text-foreground font-display text-lg group-hover:text-primary transition-colors">
                  {CONTACT_PHONE_DISPLAY || CONTACT_PHONE}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {tKey("Ring eller send SMS — hverdager 9–17.", "Call or text — weekdays 9–17.", locale)}
                </p>
              </a>
            ) : (
              <div className="block border border-border p-5">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                  {tKey("Møte", "Meeting", locale)}
                </p>
                <p className="text-foreground font-display text-lg">
                  {tKey("Vi finner et tidspunkt", "We'll find a time", locale)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {tKey("Send en kort mail med ønsket dag/tid — så bekrefter jeg.", "Send a short email with your preferred day/time — I'll confirm.", locale)}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              {tKey("Juridisk", "Legal", locale)}
            </p>
            <LegalIdentity locale={locale} />
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-foreground font-display text-lg mb-2">
              {tKey("Har du et konkret prosjekt?", "Have a concrete project?", locale)}
            </p>
            <p className="text-muted-foreground text-sm mb-5">
              {tKey(
                "Send en kort forespørsel — fire raske spørsmål. Da har vi noe konkret å snakke om.",
                "Send a short request — four quick questions. Then we have something concrete to discuss.",
                locale
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <CTAButton to={withLocalePath("/brief")}>
                {tKey("Start en forespørsel", "Start a request", locale)}
              </CTAButton>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(tKey("Hei – jeg lurer på…", "Hi – I'm wondering about…", locale))}`}
                className="inline-block whitespace-nowrap px-6 py-3 min-h-[44px] font-body text-sm font-medium tracking-wide uppercase transition-all duration-200 border bg-transparent text-foreground border-foreground/30 hover:border-primary hover:text-primary"
              >
                {tKey("Send mail", "Send email", locale)}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

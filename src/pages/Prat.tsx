import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import CTAButton from "@/components/CTAButton";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey } from "@/lib/i18n";

export default function Prat() {
  const { locale, withLocalePath } = useLocale();

  return (
    <Layout>
      <SeoHead
        title={tKey("Prat | Alt jeg skaper", "Chat | Alt jeg skaper", locale)}
        description={tKey("Book en uforpliktende prat om prosjektet ditt.", "Book a no-commitment chat about your project.", locale)}
        noindex
      />
      <section className="container pt-16 pb-24 max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {tKey("Prat", "Chat", locale)}
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          {tKey("La oss ta en uforpliktende prat om det du jobber med.", "Let's have a no-commitment chat about what you're working on.", locale)}
        </p>

        <div className="space-y-12">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">
              {tKey("Book et møte", "Book a meeting", locale)}
            </h2>
            <div className="border border-border p-8 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                {tKey("Kalenderintegrasjon kommer snart.", "Calendar integration coming soon.", locale)}
              </p>
              <p className="text-foreground">
                {tKey("Send meg en melding så finner vi et tidspunkt.", "Send me a message and we'll find a time.", locale)}
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">
              {tKey("Kontakt", "Contact", locale)}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <span className="font-mono text-muted-foreground w-16">
                  {tKey("E-post", "Email", locale)}
                </span>
                <span className="text-foreground">hei@altjegskaper.no</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <p className="text-muted-foreground text-sm mb-4">
              {tKey("Har du et konkret prosjekt? Start med en brief:", "Have a concrete project? Start with a brief:", locale)}
            </p>
            <CTAButton to={withLocalePath("/brief")}>
              {tKey("Start en brief", "Start a brief", locale)}
            </CTAButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}

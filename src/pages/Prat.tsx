import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import CTAButton from "@/components/CTAButton";

export default function Prat() {
  return (
    <Layout>
      <SeoHead title="Prat | Alt jeg skaper" description="Book en uforpliktende prat om prosjektet ditt." pathname="/prat" noindex />
      <section className="container pt-16 pb-24 max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Prat
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          La oss ta en uforpliktende prat om det du jobber med.
        </p>

        <div className="space-y-12">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">Book et møte</h2>
            <div className="border border-border p-8 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                Kalenderintegrasjon kommer snart.
              </p>
              <p className="text-foreground">
                Send meg en melding så finner vi et tidspunkt.
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">Kontakt</h2>
            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <span className="font-mono text-muted-foreground w-16">E-post</span>
                <span className="text-foreground">hei@altjegskaper.no</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <p className="text-muted-foreground text-sm mb-4">
              Har du et konkret prosjekt? Start med en brief:
            </p>
            <CTAButton to="/brief">Start en brief</CTAButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}

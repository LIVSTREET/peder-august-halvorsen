import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logoSignature from "@/assets/logo-signature.png";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Single dark inset surface that wraps the entire home page (hero + all sections).
 * Outer area is left transparent so a lighter stone background from Layout shows through.
 */
export function HomePageShell({ children }: { children: ReactNode }) {
  const { withLocalePath } = useLocale();
  return (
    <section className="relative">
      <div className="container pt-4 pb-12 md:pt-8 md:pb-20">
        <div
          className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-white/5"
          style={{
            backgroundColor: "#151311",
            boxShadow:
              "0 100px 180px -30px rgba(0,0,0,0.55), 0 50px 90px -20px rgba(0,0,0,0.4), 0 20px 40px -10px rgba(0,0,0,0.35), 0 0 140px rgba(120,70,30,0.08), 0 1px 0 hsl(30 30% 90% / 0.04) inset",
          }}
        >
          <Link
            to={withLocalePath("/")}
            aria-label="Studio P.A. Halvorsen"
            className="absolute top-4 left-5 md:top-6 md:left-7 z-30 flex items-center"
          >
            <img
              src={logoSignature}
              alt=""
              aria-hidden="true"
              className="h-8 md:h-10 lg:h-12 w-auto max-w-[120px] lg:max-w-[150px] object-contain invert opacity-85 hover:opacity-100 transition-opacity"
              decoding="async"
            />
          </Link>
          {children}
        </div>
      </div>
    </section>
  );
}
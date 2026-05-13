import type { ReactNode } from "react";

/**
 * Single dark inset surface that wraps the entire home page (hero + all sections).
 * Outer area is left transparent so a lighter stone background from Layout shows through.
 */
export function HomePageShell({ children }: { children: ReactNode }) {
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
          {children}
        </div>
      </div>
    </section>
  );
}
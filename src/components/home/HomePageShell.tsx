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
          className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-white/5 bg-[hsl(var(--background))]"
          style={{
            boxShadow:
              "0 60px 120px -30px rgba(0,0,0,0.7), 0 20px 40px -12px rgba(0,0,0,0.5), 0 1px 0 hsl(0 0% 100% / 0.04) inset",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
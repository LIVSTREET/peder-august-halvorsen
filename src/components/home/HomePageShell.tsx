import type { ReactNode } from "react";

/**
 * Single dark inset surface that wraps the entire home page (hero + all sections).
 * Outer area is left transparent so a lighter stone background from Layout shows through.
 */
export function HomePageShell({ children }: { children: ReactNode }) {
  return (
    <section className="relative">
      <div className="container pt-6 pb-10 md:pt-10 md:pb-16">
        <div
          className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-border/40 bg-[hsl(var(--background))]"
          style={{
            boxShadow:
              "0 40px 80px -20px rgba(0,0,0,0.55), 0 8px 24px -8px rgba(0,0,0,0.4)",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
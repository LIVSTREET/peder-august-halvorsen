import type { ReactNode } from "react";

/**
 * Outer "stone" backdrop + dark inset card that frames the home hero.
 * Hard-edged, premium, no organic shapes.
 */
export function HomeHeroShell({ children }: { children: ReactNode }) {
  return (
    <section className="relative">
      {/* Stone backdrop — subtle CSS-only texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, hsl(var(--muted)/0.6), transparent 60%), radial-gradient(ellipse at 90% 90%, hsl(var(--muted)/0.45), transparent 65%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.35) 100%)",
        }}
      />
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
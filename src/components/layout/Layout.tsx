import Header from "./Header";
import Footer from "./Footer";
import MobileStickyCTA from "./MobileStickyCTA";
import logoMark from "@/assets/logo-mark.png";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  const isHome = pathname === "/" || pathname === "/en";
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col relative",
        isHome &&
          "bg-[#d7d3cc] bg-[radial-gradient(ellipse_120%_70%_at_50%_-10%,hsl(40_25%_96%_/_0.55),transparent_60%),radial-gradient(ellipse_80%_60%_at_50%_110%,hsl(30_15%_70%_/_0.25),transparent_60%)] bg-fixed"
      )}
    >
      {/* Signature watermark — subtle R-mark fixed in background */}
      <img
        src={logoMark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed -left-[10vw] top-1/2 -translate-y-1/2 w-[120vw] md:w-[80vw] max-w-none opacity-[0.025] mix-blend-screen z-0"
      />
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <MobileStickyCTA />
      {/* Spacer so sticky CTA does not overlap content on mobile */}
      <div className="md:hidden h-16" aria-hidden="true" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
    </div>
  );
}

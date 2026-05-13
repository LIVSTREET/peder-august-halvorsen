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
          "bg-[#3a3a36] bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,hsl(0_0%_100%_/_0.08),transparent_55%),repeating-linear-gradient(135deg,hsl(0_0%_0%_/_0.06)_0_1px,transparent_1px_8px)]"
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

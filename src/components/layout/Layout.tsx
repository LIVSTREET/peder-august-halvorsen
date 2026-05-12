import Header from "./Header";
import Footer from "./Footer";
import MobileStickyCTA from "./MobileStickyCTA";
import logoMark from "@/assets/logo-mark.png";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
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

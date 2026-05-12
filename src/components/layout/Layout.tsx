import Header from "./Header";
import Footer from "./Footer";
import MobileStickyCTA from "./MobileStickyCTA";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileStickyCTA />
      {/* Spacer so sticky CTA does not overlap content on mobile */}
      <div className="md:hidden h-16" aria-hidden="true" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
    </div>
  );
}

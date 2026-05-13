import { Link, useLocation } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

const HIDDEN_PATHS = ["/brief", "/prat", "/dashboard"];

export default function MobileStickyCTA() {
  const { pathname } = useLocation();
  const { locale, withLocalePath } = useLocale();

  const isHidden = HIDDEN_PATHS.some((p) => {
    const localized = withLocalePath(p);
    return pathname === localized || pathname.startsWith(localized + "/");
  });
  if (isHidden) return null;

  return (
    <div
      className="md:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link
        to={withLocalePath("/brief")}
        className="pointer-events-auto flex items-center justify-center w-full whitespace-nowrap px-4 py-2.5 min-h-[40px] rounded-full font-mono text-[11px] tracking-[0.22em] uppercase border border-foreground/15 bg-background/85 backdrop-blur-md text-foreground shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] active:bg-primary active:text-primary-foreground active:border-primary transition-colors"
      >
        <span className="text-primary mr-2">→</span>
        {locale === "en" ? "Send request" : "Send forespørsel"}
      </Link>
    </div>
  );
}
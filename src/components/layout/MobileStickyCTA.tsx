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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex gap-2 px-3 py-2">
        <Link
          to={withLocalePath("/brief")}
          className="flex-1 inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 min-h-[44px] font-body text-xs font-medium tracking-wide uppercase border bg-primary text-primary-foreground border-primary active:brightness-110"
        >
          {locale === "en" ? "Send request" : "Send forespørsel"}
        </Link>
      </div>
    </div>
  );
}
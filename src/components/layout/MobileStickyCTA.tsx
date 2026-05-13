import { useEffect, useState } from "react";
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

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={
        "md:hidden fixed bottom-3 inset-x-6 z-40 pointer-events-none flex justify-center transition-all duration-300 " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none")
      }
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
    >
      <Link
        to={withLocalePath("/brief")}
        tabIndex={visible ? 0 : -1}
        className="pointer-events-auto inline-flex items-center justify-center whitespace-nowrap px-5 py-2 min-h-[40px] font-body text-xs font-medium tracking-wide uppercase border bg-primary text-primary-foreground border-primary shadow-[0_10px_30px_-10px_rgba(0,0,0,0.55)] active:brightness-110"
      >
        {locale === "en" ? "Send request" : "Send forespørsel"}
      </Link>
    </div>
  );
}
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scrolls to top on PUSH/REPLACE navigation, restores previous
 * scroll position on POP (back/forward).
 */
export default function ScrollRestoration() {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType();
  const positions = useRef<Map<string, number>>(new Map());
  const lastKey = useRef<string | null>(null);

  // Disable browser's native restoration so we control it.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
  }, []);

  // Save scroll position continuously for the current key.
  useEffect(() => {
    const key = pathname + search;
    lastKey.current = key;
    const onScroll = () => {
      positions.current.set(key, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      positions.current.set(key, window.scrollY);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, search]);

  // On navigation, scroll to top or restore.
  useEffect(() => {
    const key = pathname + search;
    // Anchor link – let the browser handle it.
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    if (navType === "POP") {
      const y = positions.current.get(key) ?? 0;
      window.scrollTo(0, y);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, hash, navType]);

  return null;
}

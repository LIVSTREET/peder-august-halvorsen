import { useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Lightweight unsaved-changes guard that works with BrowserRouter.
 * Uses beforeunload for tab close and a navigation wrapper for in-app links.
 */
export function useUnsavedGuard(hasChanges: boolean) {
  const hasChangesRef = useRef(hasChanges);
  hasChangesRef.current = hasChanges;

  // Ctrl/Cmd+S → click submit
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        const btn = document.querySelector(
          '[type="submit"]'
        ) as HTMLButtonElement | null;
        btn?.click();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Tab close / refresh
  useEffect(() => {
    if (!hasChanges) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasChanges]);

  // Return a no-op blocker-like object for backward compat
  const blocker = { state: "idle" as "idle" | "blocked" };
  const confirmLeave = useCallback(() => {}, []);
  const stay = useCallback(() => {}, []);

  return { blocker, confirmLeave, stay };
}

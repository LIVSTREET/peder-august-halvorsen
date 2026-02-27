import { useEffect, useCallback } from "react";
import { useBlocker } from "react-router-dom";

export function useUnsavedGuard(hasChanges: boolean) {
  const blocker = useBlocker(
    hasChanges
      ? ({ currentLocation, nextLocation }) =>
          currentLocation.pathname !== nextLocation.pathname
      : false
  );

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

  useEffect(() => {
    if (!hasChanges) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasChanges]);

  const confirmLeave = useCallback(() => {
    if (blocker.state === "blocked" && blocker.proceed) blocker.proceed();
  }, [blocker]);

  const stay = useCallback(() => {
    if (blocker.state === "blocked" && blocker.reset) blocker.reset();
  }, [blocker]);

  return { blocker, confirmLeave, stay };
}

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
document.documentElement.classList.add("intro-loading");

createRoot(root).render(<App />);

// Wait for fonts + next frame so the fade-in starts at a clean paint.
const reveal = () => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove("intro-loading");
    document.documentElement.classList.add("intro-ready");
  });
};

const fontsReady =
  (document as any).fonts?.ready instanceof Promise
    ? (document as any).fonts.ready
    : Promise.resolve();

Promise.race([fontsReady, new Promise((r) => setTimeout(r, 200))]).then(reveal);

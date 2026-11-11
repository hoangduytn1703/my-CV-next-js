import { prefersReducedMotion } from "components/fx/motion";
import { THEME_MODE_STORAGE_KEY } from "constants/app";
import { motion } from "framer-motion";
import { MouseEvent, useEffect, useState } from "react";
import s from "./ThemeToggle.module.scss";

type Mode = "dark" | "light";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

const spring = { type: "spring", stiffness: 260, damping: 20 } as const;

/** Sun/moon morph button. Switching themes reveals the new palette in a circle growing from the button. */
const ThemeToggle = () => {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    setMode(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_MODE_STORAGE_KEY, next);
      } catch {
        // storage can be unavailable (private mode) — the theme still switches for this visit
      }
      setMode(next);
    };

    const doc = document as ViewTransitionDocument;
    if (!doc.startViewTransition || prefersReducedMotion()) {
      apply();

      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = doc.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  const dark = mode === "dark";

  return (
    <button
      className={s.toggle}
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      data-cursor-label={dark ? "Light" : "Dark"}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <mask id="theme-toggle-mask">
          <rect width="24" height="24" fill="white" />
          <motion.circle
            r="7"
            fill="black"
            initial={false}
            animate={{ cx: dark ? 17 : 32, cy: dark ? 7 : -4 }}
            transition={spring}
          />
        </mask>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask="url(#theme-toggle-mask)"
          initial={false}
          animate={{ r: dark ? 9 : 5 }}
          transition={spring}
        />
        <motion.g
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: dark ? 0 : 1, rotate: dark ? -60 : 0, scale: dark ? 0.5 : 1 }}
          transition={spring}
          style={{ originX: "12px", originY: "12px" }}
        >
          <path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M4.6 19.4 6 18M18 6l1.4-1.4" />
        </motion.g>
      </svg>
    </button>
  );
};

export default ThemeToggle;

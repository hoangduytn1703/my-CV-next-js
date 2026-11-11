import { prefersReducedMotion } from "components/fx/motion";
import Lenis from "lenis";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

const LenisContext = createContext<Lenis | null>(null);

/** Inertia smooth-scrolling for the whole page (disabled for reduced-motion users). */
export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({
      autoRaf: true,
      anchors: true,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(instance);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
};

export const useLenis = () => useContext(LenisContext);

type ScrollTarget = string | number | HTMLElement;

export const useScrollTo = () => {
  const lenis = useLenis();

  return useCallback(
    (target: ScrollTarget, offset = 0) => {
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4, force: true });

        return;
      }
      let top = 0;
      if (typeof target === "number") {
        top = target;
      } else {
        const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (!el) return;
        top = el.getBoundingClientRect().top + window.scrollY + offset;
      }
      window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    },
    [lenis]
  );
};

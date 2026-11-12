import { prefersReducedMotion } from "components/fx/motion";
import { useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { RefObject, useEffect, useRef } from "react";

/* Small cyberpunk primitives shared by the sections (same language as the intro). */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$*+=<>/\\|_";
const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * "Decrypts" `text` into `el`: random glyphs resolve left → right.
 * Meant for monospace text (no width jitter). Returns a cancel function that leaves the final text.
 */
export const decrypt = (el: HTMLElement, text: string, duration = 0.7) => {
  if (prefersReducedMotion()) {
    el.textContent = text;

    return () => undefined;
  }
  const start = performance.now();
  let raf = 0;
  let last = 0;
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / (duration * 1000));
    if (now - last > 40 || k === 1) {
      last = now;
      const n = Math.floor(text.length * k);
      el.textContent = text.slice(0, n) + Array.from(text.slice(n), (c) => (c === " " ? " " : glyph())).join("");
    }
    if (k < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);

  return () => {
    cancelAnimationFrame(raf);
    el.textContent = text;
  };
};

/** Text that decrypts itself the first time it scrolls into view (server-renders the real text). */
export const Decrypt = ({
  text,
  className,
  delay = 0,
  duration = 0.7,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    let cancel = () => undefined as void;
    const timer = setTimeout(() => {
      cancel = decrypt(el, text, duration);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      cancel();
    };
  }, [inView, text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
};

/**
 * Scroll parallax for an element: returns a y MotionValue going from `distance` to `-distance` (px)
 * while `ref` crosses the viewport. Positive distance = element drifts up faster than the page.
 */
export const useParallax = (ref: RefObject<HTMLElement>, distance: number) => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [distance, -distance]);
};

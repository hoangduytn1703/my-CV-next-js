import { useEffect, useRef } from "react";
import s from "./Cursor.module.scss";

/** Fraction of the remaining distance the ring covers per 60fps frame. */
const FOLLOW = 0.22;

const INTERACTIVE = "[data-cursor-label], a, button, [role='button'], label, input, textarea, select";

/**
 * Dot + trailing ring cursor (mouse devices only).
 * - grows on links/buttons
 * - shows a label bubble on elements with data-cursor-label="..."
 * - fades out over text inputs so the native caret stays visible
 */
const Cursor = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !ring || !dot || !label) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("has-cursor");
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const setState = (state: string) => {
      ring.dataset.state = state;
      dot.dataset.state = state;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      root.classList.add(s.visible);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      if (!target) {
        setState("default");

        return;
      }
      const text = target.getAttribute("data-cursor-label");
      if (text) {
        label.textContent = text;
        setState("label");
      } else if (target.matches("input, textarea, select")) {
        setState("text");
      } else {
        setState("hover");
      }
    };

    const onDown = () => (ring.dataset.pressed = "true");
    const onUp = () => (ring.dataset.pressed = "false");
    const onLeave = () => root.classList.remove(s.visible);

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const k = 1 - Math.pow(1 - FOLLOW, dt / 16.67);
      rx += (mx - rx) * k;
      ry += (my - ry) * k;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={s.cursor} aria-hidden>
      <div ref={ringRef} className={s.ringWrap}>
        <div className={s.ring}>
          <span ref={labelRef} className={s.label} />
        </div>
      </div>
      <div ref={dotRef} className={s.dotWrap}>
        <div className={s.dot} />
      </div>
    </div>
  );
};

export default Cursor;

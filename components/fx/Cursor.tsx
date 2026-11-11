import { prefersReducedMotion } from "components/fx/motion";
import { useEffect, useRef } from "react";
import s from "./Cursor.module.scss";

/**
 * "Target" cursor (inspired by React Bits' TargetCursor), mouse devices only.
 *
 * Idle: a dot with four corner brackets spinning around it.
 * Hovering a target: the spin unwinds and the brackets fly out to frame the
 * element's bounding box, trailing the pointer a little (elastic parallax).
 * Elements with data-cursor-label="..." also get a small HUD tag on the frame.
 */

/** Anything the frame can lock onto (closest match wins, so a button inside a card frames the button). */
const TARGETS = [
  "[data-cursor-target]",
  ".btn",
  ".glass",
  ".tilt",
  "a",
  "button",
  "[role='button']",
  "[role='tab']",
  "label",
  "input",
  "textarea",
  "select",
].join(", ");
const TEXT_FIELDS = "input, textarea, select";

const CORNER = 12; // bracket size (px)
const PAD = 7; // gap between the element and the locked frame
const SPIN = 180; // idle spin speed, deg/s (one turn every 2s)
// Idle bracket positions around the pointer (top-left of each bracket box): TL, TR, BR, BL
const IDLE = [
  [-1.5, -1.5],
  [0.5, -1.5],
  [0.5, 0.5],
  [-1.5, 0.5],
].map(([x, y]) => [x * CORNER, y * CORNER]);

/** Frame-rate independent easing factor: `k` is the fraction covered per 60fps frame. */
const ease = (k: number, dt: number) => 1 - Math.pow(1 - k, dt / 16.67);

const Cursor = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const cornerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const label = labelRef.current;
    const corners = cornerRefs.current;
    if (!wrap || !label || corners.some((c) => !c)) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const reduce = prefersReducedMotion();
    document.documentElement.classList.add("has-cursor");

    let mx = -100;
    let my = -100;
    let target: Element | null = null;
    let rot = 0;
    let scale = 1;
    let pressed = false;
    let raf = 0;
    let last = performance.now();
    const pos = IDLE.map(([x, y]) => ({ x, y }));

    const setTarget = (el: Element | null) => {
      const next = el?.closest(TARGETS) ?? null;
      if (next === target) return;
      target = next;
      if (next) {
        // Unwind the shortest way back to 0°.
        rot = ((rot % 360) + 360) % 360;
        if (rot > 180) rot -= 360;
      }
      const text = next?.getAttribute("data-cursor-label") ?? "";
      label.textContent = text;
      label.dataset.show = text ? "true" : "false";
      wrap.dataset.state = !next ? "idle" : next.matches(TEXT_FIELDS) ? "text" : "locked";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      wrap.dataset.visible = "true";
      setTarget(e.target instanceof Element ? e.target : null);
    };
    // Content can scroll under a still pointer (wheel, Lenis) — re-check what's underneath.
    const onScroll = () => setTarget(document.elementFromPoint(mx, my));
    const onDown = () => {
      pressed = true;
      wrap.dataset.pressed = "true";
    };
    const onUp = () => {
      pressed = false;
      wrap.dataset.pressed = "false";
    };
    const onLeave = () => {
      wrap.dataset.visible = "false";
      setTarget(null);
    };

    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (target && !target.isConnected) setTarget(document.elementFromPoint(mx, my));

      let desired = IDLE;
      if (target) {
        const r = target.getBoundingClientRect();
        desired = [
          [r.left - PAD, r.top - PAD],
          [r.right + PAD - CORNER, r.top - PAD],
          [r.right + PAD - CORNER, r.bottom + PAD - CORNER],
          [r.left - PAD, r.bottom + PAD - CORNER],
        ].map(([x, y]) => [x - mx, y - my]);
        rot += (0 - rot) * ease(0.25, dt);
      } else if (!reduce) {
        rot = (rot + (SPIN * dt) / 1000) % 360;
      }

      const k = ease(target ? 0.26 : 0.32, dt);
      pos.forEach((p, i) => {
        p.x += (desired[i][0] - p.x) * k;
        p.y += (desired[i][1] - p.y) * k;
        corners[i]!.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      });

      scale += ((pressed ? 0.88 : 1) - scale) * ease(0.3, dt);
      wrap.style.transform = `translate3d(${mx}px, ${my}px, 0) rotate(${rot}deg) scale(${scale})`;
      label.style.transform = `translate3d(${mx + pos[0].x}px, ${my + pos[0].y - 24}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Two top-level fixed layers: the frame blends with the page (difference), the label stays solid.
  return (
    <>
      <div ref={wrapRef} className={s.target} data-state="idle" data-visible="false" aria-hidden>
        <span className={s.dot} />
        {["tl", "tr", "br", "bl"].map((c, i) => (
          <span
            key={c}
            ref={(el) => {
              cornerRefs.current[i] = el;
            }}
            className={`${s.corner} ${s[c]}`}
          />
        ))}
      </div>
      <span ref={labelRef} className={s.label} data-show="false" aria-hidden />
    </>
  );
};

export default Cursor;

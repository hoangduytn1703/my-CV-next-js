import { prefersReducedMotion } from "components/fx/motion";

const COLORS = ["#34d399", "#22d3ee", "#a78bfa", "#f472b6", "#fbbf24"];
const LIFETIME = 2200;

/** One-shot confetti burst from a viewport point, drawn on a throwaway canvas. */
export const burstConfetti = (originX: number, originY: number) => {
  if (typeof window === "undefined" || prefersReducedMotion()) return;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "9998",
  });
  document.body.appendChild(canvas);
  ctx.scale(dpr, dpr);

  const pieces = Array.from({ length: 150 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;

    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  });

  const start = performance.now();
  const tick = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = Math.max(0, 1 - elapsed / LIFETIME);
    pieces.forEach((p) => {
      p.vy += 0.25;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (elapsed < LIFETIME) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
};

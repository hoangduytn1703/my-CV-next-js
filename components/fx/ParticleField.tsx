import { prefersReducedMotion } from "components/fx/motion";
import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DIST = 130;
const MOUSE_DIST = 170;

/**
 * Interactive constellation: drifting dots that link up when close,
 * get pushed away by the cursor and draw threads towards it.
 * Pauses when off-screen or when the tab is hidden.
 */
const ParticleField = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = prefersReducedMotion();
    const mouse = { x: 0, y: 0, active: false };
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let inView = true;
    let rgb = "160, 245, 215";

    const readColor = () => {
      rgb = getComputedStyle(document.documentElement).getPropertyValue("--particle-rgb").trim() || rgb;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (running) {
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < MOUSE_DIST * MOUSE_DIST && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const force = (1 - d / MOUSE_DIST) * 0.09;
              p.vx += (dx / d) * force;
              p.vy += (dy / d) * force;
            }
          }
          p.vx *= 0.985;
          p.vy *= 0.985;
          if (Math.abs(p.vx) + Math.abs(p.vy) < 0.15) {
            p.vx += (Math.random() - 0.5) * 0.05;
            p.vy += (Math.random() - 0.5) * 0.05;
          }
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          else if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          else if (p.y > h + 20) p.y = -20;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.75)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            ctx.strokeStyle = `rgba(${rgb}, ${(1 - Math.sqrt(d2) / LINK_DIST) * 0.32})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < MOUSE_DIST + 50) {
            ctx.strokeStyle = `rgba(${rgb}, ${(1 - d / (MOUSE_DIST + 50)) * 0.55})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.round((w * h) / 12000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6,
      }));
      if (!running) draw();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y >= 0 && mouse.y <= rect.height && mouse.x >= 0 && mouse.x <= rect.width;
    };
    const onLeave = () => (mouse.active = false);
    const onVisibility = () => (document.hidden ? stop() : start());

    readColor();
    resize();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      readColor();
      if (!running) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
};

export default ParticleField;

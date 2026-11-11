import { useEffect, useRef } from "react";
import s from "./Background.module.scss";

/** Fixed page backdrop: drifting aurora blobs, faded grid, film grain and a cursor spotlight. */
const Background = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={s.bg} aria-hidden>
      <div className={`${s.blob} ${s.b1}`} />
      <div className={`${s.blob} ${s.b2}`} />
      <div className={`${s.blob} ${s.b3}`} />
      <div className={s.grid} />
      <div className={s.spot} />
      <div className={s.noise} />
    </div>
  );
};

export default Background;

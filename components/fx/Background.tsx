import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import s from "./Background.module.scss";

/**
 * Fixed page backdrop: drifting aurora blobs, faded grid, film grain and a cursor spotlight.
 * Each layer scrolls at its own speed (parallax depth) while the page moves.
 */
const Background = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["0vh", reduce ? "0vh" : "-45vh"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0vh", reduce ? "0vh" : "-80vh"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0vh", reduce ? "0vh" : "-25vh"]);
  const gridPos = useTransform(scrollY, (v) => `0px ${reduce ? 0 : -v * 0.12}px`);

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
      <motion.div className={s.layer} style={{ y: y1 }}>
        <div className={`${s.blob} ${s.b1}`} />
      </motion.div>
      <motion.div className={s.layer} style={{ y: y2 }}>
        <div className={`${s.blob} ${s.b2}`} />
      </motion.div>
      <motion.div className={s.layer} style={{ y: y3 }}>
        <div className={`${s.blob} ${s.b3}`} />
      </motion.div>
      <motion.div className={s.grid} style={{ backgroundPosition: gridPos }} />
      <div className={s.spot} />
      <div className={s.noise} />
    </div>
  );
};

export default Background;

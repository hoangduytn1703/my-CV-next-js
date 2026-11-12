import { decrypt } from "components/fx/Cyber";
import { useIntroDone } from "components/fx/Intro";
import { EASE_OUT } from "components/fx/motion";
import { cvConfig } from "config/cv";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import s from "./SectionHud.module.scss";

const SECTIONS = cvConfig.menu.filter((m) => !m.disabled && m.href !== "home");

/**
 * Small game-style HUD pinned bottom-left (desktop): current section, decrypted on change,
 * plus overall scroll %. Hidden on the hero so the first screen stays clean.
 */
const SectionHud = () => {
  const intro = useIntroDone();
  const [active, setActive] = useState(-1);
  const labelRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll();
  const percent = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}`.padStart(3, "0"));

  // Same scroll-spy rule as the navbar: the section crossing the middle of the viewport.
  useEffect(() => {
    const ids = ["home", ...SECTIONS.map((m) => m.href)];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(SECTIONS.findIndex((m) => m.href === entry.target.id));
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = labelRef.current;
    if (!el || active < 0) return;

    return decrypt(el, SECTIONS[active].label.toUpperCase(), 0.5);
  }, [active, intro]);

  return (
    <AnimatePresence>
      {intro && active >= 0 && (
        <motion.div
          className={s.hud}
          aria-hidden
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <span className={s.index}>{`${active + 1}`.padStart(2, "0")}</span>
          <span className={s.line} />
          <span ref={labelRef} className={s.label} />
          <span className={s.percent}>
            <motion.span>{percent}</motion.span>%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SectionHud;

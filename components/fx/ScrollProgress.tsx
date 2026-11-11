import { ArrowUp } from "components/fx/icons";
import { useScrollTo } from "components/fx/SmoothScroll";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import s from "./ScrollProgress.module.scss";

/** Gradient reading-progress bar pinned to the top of the viewport. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return <motion.div className={s.bar} style={{ scaleX }} aria-hidden />;
};

/** Floating back-to-top button whose ring fills with scroll progress. */
export const BackToTop = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  const scrollTo = useScrollTo();

  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 700));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className={s.top}
          onClick={() => scrollTo(0)}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <svg viewBox="0 0 48 48" className={s.ring}>
            <circle cx="24" cy="24" r="22" className={s.track} />
            <motion.circle cx="24" cy="24" r="22" className={s.progress} style={{ pathLength: scrollYProgress }} />
          </svg>
          <ArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

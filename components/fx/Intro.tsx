import { EASE_IN_OUT, EASE_OUT, prefersReducedMotion } from "components/fx/motion";
import { useLenis } from "components/fx/SmoothScroll";
import { cvConfig } from "config/cv";
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import s from "./Intro.module.scss";

const IntroContext = createContext(false);

/** True once the preloader curtain starts lifting — sections use it to start their entrance. */
export const useIntroDone = () => useContext(IntroContext);

const Preloader = ({ onDone }: { onDone: () => void }) => {
  const [visible, setVisible] = useState(true);
  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) => `${Math.round(v)}`.padStart(3, "0"));
  const scaleX = useTransform(progress, [0, 100], [0, 1]);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const reduce = prefersReducedMotion();
    let timer: ReturnType<typeof setTimeout>;
    const controls = animate(progress, 100, {
      duration: reduce ? 0.3 : 1.7,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        timer = setTimeout(
          () => {
            setVisible(false);
            onDoneRef.current();
          },
          reduce ? 0 : 180
        );
      },
    });

    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, [progress]);

  const letters = cvConfig.name.split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={s.preloader}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1, ease: EASE_IN_OUT }}
        >
          <div className={s.top}>
            <span>{cvConfig.mainJob[0]}</span>
            <span>Portfolio</span>
          </div>
          <h2 className={s.name} aria-label={cvConfig.name}>
            {letters.map((l, i) => (
              <span key={i} className={s.mask} aria-hidden>
                <motion.span
                  className={s.letter}
                  initial={{ y: "140%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 + i * 0.035 }}
                >
                  {l === " " ? " " : l}
                </motion.span>
              </span>
            ))}
          </h2>
          <div className={s.bottom}>
            <span className={s.loading}>Loading experience</span>
            <span className={s.counter}>
              <motion.span>{counter}</motion.span>
              <small>%</small>
            </span>
          </div>
          <motion.div className={s.bar} style={{ scaleX }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const IntroProvider = ({ children }: { children: ReactNode }) => {
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [done, lenis]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", !done);
  }, [done]);

  return (
    <IntroContext.Provider value={done}>
      <Preloader onDone={() => setDone(true)} />
      {children}
    </IntroContext.Provider>
  );
};

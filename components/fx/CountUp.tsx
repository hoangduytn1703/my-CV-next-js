import { EASE_OUT } from "components/fx/motion";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

/** Counts from 0 to `to` the first time it becomes visible. */
const CountUp = ({ to, duration = 2, delay = 0 }: { to: number; duration?: number; delay?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}`;
      },
    });

    return () => controls.stop();
  }, [inView, to, duration, delay]);

  return <span ref={ref}>0</span>;
};

export default CountUp;

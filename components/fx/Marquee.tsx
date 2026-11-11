import { cvConfig } from "config/cv";
import { TechIcon } from "components/fx/TechIcon";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";
import { cx } from "utils/common";
import s from "./Marquee.module.scss";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;

  return ((((v - min) % range) + range) % range) + min;
};

// Every distinct technology mentioned across the projects.
const TECHS = Array.from(
  new Set(cvConfig.works.flatMap((w) => w.term.split(",").map((t) => t.trim())).filter(Boolean))
);

/** Infinite ticker whose speed (and direction) follows the scroll velocity. */
const MarqueeRow = ({
  items,
  baseVelocity,
  className,
}: {
  items: string[];
  baseVelocity: number;
  className?: string;
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2.8], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  const group = (
    <div className={s.group}>
      {items.map((item) => (
        <span key={item} className={s.item}>
          <TechIcon name={item} mono className={s.icon} />
          {item}
          <span className={s.star} aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cx(s.band, className)}>
      <motion.div className={s.track} style={{ x }}>
        {group}
        {group}
      </motion.div>
    </div>
  );
};

const TechMarquee = () => (
  <div className={s.wrap} aria-label={`Tech stack: ${TECHS.join(", ")}`}>
    <MarqueeRow items={TECHS} baseVelocity={-1.4} className={s.bandA} />
    <MarqueeRow items={[...TECHS].reverse()} baseVelocity={1.4} className={s.bandB} />
  </div>
);

export default TechMarquee;

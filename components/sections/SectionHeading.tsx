import { Decrypt, useParallax } from "components/fx/Cyber";
import { Reveal, SplitWords } from "components/fx/Reveal";
import { motion } from "framer-motion";
import { useRef } from "react";
import s from "./SectionHeading.module.scss";

interface Props {
  index: string;
  eyebrow: string;
  title: string;
  highlight?: string;
}

const SectionHeading = ({ index, eyebrow, title, highlight }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  // Giant outlined section number drifting on its own (slower) layer behind the title.
  const y = useParallax(ref, 110);

  return (
    <div ref={ref} className={s.heading}>
      <motion.span className={s.ghost} style={{ y }} aria-hidden>
        {index}
      </motion.span>
      <Reveal y={20} blur={false}>
        <span className={s.eyebrow}>
          <span className={s.index}>{index}</span>
          <span className={s.line} aria-hidden />
          <Decrypt text={eyebrow} delay={0.15} />
        </span>
      </Reveal>
      <SplitWords text={title} highlight={highlight} className={s.title} />
    </div>
  );
};

export default SectionHeading;

import { EASE_OUT } from "components/fx/motion";
import { HTMLMotionProps, motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { Fragment, useRef } from "react";
import { cx } from "utils/common";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
  blur?: boolean;
}

/** Fades + lifts + un-blurs its content the first time it scrolls into view. */
export const Reveal = ({ delay = 0, y = 40, blur = true, children, ...rest }: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    {...rest}
  >
    {children}
  </motion.div>
);

interface SplitWordsProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Space separated words that get the animated gradient. */
  highlight?: string;
  delay?: number;
}

/** Heading whose words slide up from behind a mask, one after another. */
export const SplitWords = ({ text, as = "h2", className, highlight = "", delay = 0 }: SplitWordsProps) => {
  const Tag = motion[as] as typeof motion.h2;
  const words = text.split(" ");
  const highlighted = new Set(highlight.split(" ").filter(Boolean));

  return (
    <Tag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="word-mask" aria-hidden>
            <motion.span
              className={cx("word", highlighted.has(word) && "gradient-text")}
              variants={{
                hidden: { y: "140%", rotate: 6 },
                show: { y: "0%", rotate: 0, transition: { duration: 0.95, ease: EASE_OUT } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
};

const ScrollWord = ({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) => {
  const opacity = useTransform(progress, range, [0.14, 1]);

  return (
    <>
      <motion.span style={{ opacity }} className={accent ? "gradient-text" : undefined}>
        {children}
      </motion.span>{" "}
    </>
  );
};

/** Paragraph that "lights up" word by word as you scroll through it. */
export const ScrollWords = ({ text, className, keywords }: { text: string; className?: string; keywords?: RegExp }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;

        return (
          <ScrollWord
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, start + 1 / words.length]}
            accent={!!keywords && keywords.test(word)}
          >
            {word}
          </ScrollWord>
        );
      })}
    </p>
  );
};

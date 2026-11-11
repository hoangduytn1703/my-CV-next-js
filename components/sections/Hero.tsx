import avatar from "assets/images/avatar2.jpg";
import CountUp from "components/fx/CountUp";
import { ArrowRight, Download } from "components/fx/icons";
import { useIntroDone } from "components/fx/Intro";
import { Magnetic } from "components/fx/Magnetic";
import { EASE_OUT } from "components/fx/motion";
import { useScrollTo } from "components/fx/SmoothScroll";
import { TechLabel } from "components/fx/TechIcon";
import { TiltCard } from "components/fx/TiltCard";
import Typewriter from "components/fx/Typewriter";
import { cvConfig } from "config/cv";
import config from "config/site";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CSSProperties, Fragment, MouseEvent, useRef } from "react";
import { cx } from "utils/common";
import s from "./Hero.module.scss";

const ParticleField = dynamic(() => import("components/fx/ParticleField"), { ssr: false });

const ORBIT = ["Vue", "Nuxt", "React", "Next.js", "TypeScript", "Tailwind"];
const nameWords = cvConfig.name.split(" ");
const years = cvConfig.facts.find((f) => /year/i.test(f.name))?.count ?? 0;
const projects = cvConfig.facts.find((f) => /project/i.test(f.name))?.count ?? 0;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE_OUT } },
};
const nameVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const letterVariants: Variants = {
  hidden: { y: "150%", rotate: 10 },
  show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: EASE_OUT } },
};

const Hero = () => {
  const intro = useIntroDone();
  const scrollTo = useScrollTo();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const goTo = (target: string) => (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    scrollTo(target);
  };

  return (
    <section id="home" ref={ref} className={s.hero}>
      <ParticleField className={s.canvas} />

      <motion.div className={cx("container", s.inner)} style={{ opacity: fade }}>
        <motion.div
          className={s.text}
          style={{ y: textY }}
          variants={container}
          initial="hidden"
          animate={intro ? "show" : "hidden"}
        >
          <motion.span className={s.badge} variants={item}>
            <span className={s.pulse} aria-hidden />
            {cvConfig.mainJob[0]} · {years}+ years · {config.location.split(",")[0]}
          </motion.span>

          <motion.h1 className={s.name} variants={nameVariants} aria-label={cvConfig.name}>
            {nameWords.map((word, wi) => {
              const highlight = wi === nameWords.length - 1;

              return (
                <Fragment key={word}>
                  <span className={cx(s.word, highlight && s.highlight)} aria-hidden>
                    {word.split("").map((ch, ci) => (
                      <motion.span key={ci} className={s.letter} variants={letterVariants}>
                        <span
                          className={s.letterInner}
                          style={
                            highlight
                              ? ({
                                  "--n": `${word.length * 100}%`,
                                  "--p": `${(ci / Math.max(1, word.length - 1)) * 100}%`,
                                } as CSSProperties)
                              : undefined
                          }
                        >
                          {ch}
                        </span>
                      </motion.span>
                    ))}
                  </span>
                  {wi < nameWords.length - 1 && " "}
                </Fragment>
              );
            })}
          </motion.h1>

          <motion.p className={s.role} variants={item}>
            I&apos;m a <Typewriter words={cvConfig.mainJob} start={intro} className={s.typed} />
          </motion.p>

          <motion.p className={s.lead} variants={item}>
            {cvConfig.heroLead}
          </motion.p>

          <motion.div className={s.ctas} variants={item}>
            <Magnetic>
              <a href="#contact" className="btn btn-primary" onClick={goTo("#contact")}>
                Hire me <ArrowRight />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={cvConfig.cvDownloadLink} className="btn btn-ghost" download>
                Download CV <Download />
              </a>
            </Magnetic>
          </motion.div>

          <motion.ul className={s.socials} variants={item}>
            {config.socialLinks.map((l) => (
              <li key={l.label}>
                <Magnetic strength={0.5}>
                  <a href={l.url} target="_blank" rel="noreferrer" aria-label={l.label}>
                    <i className={l.iconClassName} />
                  </a>
                </Magnetic>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className={s.visual}
          style={{ y: visualY }}
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={intro ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -6 }}
          transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.35 }}
        >
          <TiltCard className={s.avatarCard} max={14} glare={false} hoverScale={1} lift={0}>
            <div className={s.glow} aria-hidden />
            <div className={s.orbit} aria-hidden>
              {ORBIT.map((tech, i) => {
                const angle = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;

                return (
                  <span
                    key={tech}
                    className={s.chip}
                    style={{ left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` }}
                  >
                    <span className={s.chipInner}>
                      <TechLabel name={tech} />
                    </span>
                  </span>
                );
              })}
            </div>
            <div className={s.blob}>
              <Image
                src={avatar}
                alt={cvConfig.name}
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 960px) 70vw, 400px"
                className={s.avatar}
              />
            </div>
            <div className={cx(s.floatCard, s.fc1)}>
              <div className={s.floatInner}>
                <strong>
                  <CountUp to={years} delay={1.2} />+
                </strong>
                <span>Years experience</span>
              </div>
            </div>
            <div className={cx(s.floatCard, s.fc2)}>
              <div className={s.floatInner}>
                <strong>
                  <CountUp to={projects} delay={1.4} />
                </strong>
                <span>Projects delivered</span>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className={s.scrollCue}
        onClick={goTo("#about")}
        initial={{ opacity: 0, y: 20 }}
        animate={intro ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <span className={s.mouse} aria-hidden>
          <span />
        </span>
        Scroll
      </motion.a>
    </section>
  );
};

export default Hero;

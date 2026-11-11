import CountUp from "components/fx/CountUp";
import { Download, Trophy } from "components/fx/icons";
import { Magnetic } from "components/fx/Magnetic";
import { EASE_OUT } from "components/fx/motion";
import { Reveal, ScrollWords } from "components/fx/Reveal";
import { TiltCard, trackPointer } from "components/fx/TiltCard";
import SectionHeading from "components/sections/SectionHeading";
import { cvConfig } from "config/cv";
import { motion, Variants } from "framer-motion";
import { CSSProperties } from "react";
import { cx } from "utils/common";
import s from "./About.module.scss";

const KEYWORDS = /^(React|Next\.js|Vue|Japanese|performance|pixel-perfect|UI\/UX|award-winning|production-grade)/;

const SEGMENTS = 20;

const segmentVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0.3 },
  show: { opacity: 1, scaleY: 1, transition: { duration: 0.45, ease: EASE_OUT } },
};

/** LED-style level meter: lit segments sweep in left→right and ripple on hover. */
const SkillMeter = ({ name, value, index }: { name: string; value: number; index: number }) => {
  const lit = Math.round((value / 100) * SEGMENTS);

  return (
    <motion.div
      className={s.meter}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
      }}
    >
      <div className={s.meterHead}>
        <span className={s.meterIndex}>{`0${index + 1}`}</span>
        <span className={s.meterName}>{name}</span>
        <span className={s.meterValue}>
          <CountUp to={value} delay={0.2 + index * 0.06} />
          <small>%</small>
        </span>
      </div>
      <motion.div
        className={s.segments}
        aria-hidden
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.2 + index * 0.06 } } }}
      >
        {Array.from({ length: SEGMENTS }, (_, k) =>
          k < lit ? (
            <motion.span
              key={k}
              className={cx(s.seg, s.segOn, k === lit - 1 && s.segHead)}
              variants={segmentVariants}
              style={{ "--p": `${(k / (SEGMENTS - 1)) * 100}%`, "--i": k } as CSSProperties}
            />
          ) : (
            <span key={k} className={s.seg} />
          )
        )}
      </motion.div>
    </motion.div>
  );
};

const About = () => (
  <section id="about" className="section">
    <div className="container">
      <SectionHeading
        index="01"
        eyebrow="About me"
        title="Building fast, reusable & pixel-perfect interfaces"
        highlight="pixel-perfect"
      />

      <div className={s.grid}>
        <ScrollWords text={cvConfig.about} className={s.statement} keywords={KEYWORDS} />

        <div className={s.side}>
          <div className={s.stats}>
            {cvConfig.facts.map((fact, i) => (
              <Reveal key={fact.name} delay={i * 0.08}>
                <TiltCard className={cx(s.stat, "glass spotlight")} max={12}>
                  <i className={fact.icon} />
                  <strong>
                    <CountUp to={fact.count} />
                    {fact.suffix}
                  </strong>
                  <span>{fact.name}</span>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {cvConfig.awards.map((award) => (
            <Reveal key={award.title} delay={0.1}>
              <div className={cx(s.award, "glass")}>
                <span className={s.awardIcon}>
                  <Trophy />
                </span>
                <div>
                  <span className={s.awardMeta}>
                    {award.year} · {award.company}
                  </span>
                  <p className={s.awardTitle}>{award.title}</p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.15}>
            <Magnetic>
              <a className="btn btn-ghost" href={cvConfig.cvDownloadLink} download>
                Download my CV <Download />
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>

      <div className={s.skills}>
        <Reveal className={cx(s.skillsPanel, "glass spotlight")} onPointerMove={trackPointer}>
          <div className={s.skillsHead}>
            <h3 className={s.skillsTitle}>
              <span>{"//"}</span> Skills &amp; proficiency
            </h3>
            <div className={s.scale} aria-hidden>
              <span>Familiar</span>
              <span>Proficient</span>
              <span>Expert</span>
            </div>
          </div>
          <div className={s.skillList}>
            {cvConfig.skills.map((skill, i) => (
              <SkillMeter key={skill.name} name={skill.name} value={skill.value} index={i} />
            ))}
          </div>
        </Reveal>

        <div className={s.toolbox}>
          {cvConfig.skillGroups.map((group, gi) => (
            <Reveal
              key={group.title}
              delay={(gi % 3) * 0.08}
              className={cx(s.group, "glass spotlight")}
              onPointerMove={trackPointer}
            >
              <span className={s.groupIndex}>{`0${gi + 1}`}</span>
              <h4 className={s.groupTitle}>{group.title}</h4>
              <ul className={s.chips}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className={s.soft} y={20}>
          <span className={s.softLabel}>Soft skills</span>
          <ul className={s.softList}>
            {cvConfig.softSkills.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  </section>
);

export default About;

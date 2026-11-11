import { ArrowUpRight, Briefcase, Globe, Graduation } from "components/fx/icons";
import { EASE_OUT } from "components/fx/motion";
import { Reveal } from "components/fx/Reveal";
import { TechLabel } from "components/fx/TechIcon";
import { TiltCard } from "components/fx/TiltCard";
import SectionHeading from "components/sections/SectionHeading";
import { cvConfig, Job } from "config/cv";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { cx } from "utils/common";
import s from "./Experience.module.scss";

const { education, work } = cvConfig.experience;

const years = cvConfig.facts.find((f) => /year/i.test(f.name))?.count ?? 0;

const TimelineItem = ({ job }: { job: Job }) => {
  const current = /now|present/i.test(job.time);

  return (
    <motion.article
      className={s.item}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
    >
      <motion.span
        className={cx(s.dot, current && s.dotCurrent)}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -35% 0px" }}
        transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.15 }}
      />
      <TiltCard className={cx(s.card, "glass spotlight")} max={4} hoverScale={1.01}>
        <div className={s.cardHead}>
          <span className={s.time}>{job.time}</span>
          {current && <span className={s.now}>Current</span>}
        </div>
        <h3 className={s.role}>{job.title}</h3>
        <span className={s.company}>{job.company}</span>
        <p className={s.desc}>{job.description}</p>
        {job.clients && (
          <div className={s.clients}>
            <span className={s.clientsLabel}>Clients</span>
            {job.clients.map((c) => (
              <span key={c} className={s.client}>
                {c}
              </span>
            ))}
          </div>
        )}
        {job.highlights && (
          <ul className={s.highlights}>
            {job.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        {job.links && (
          <ul className={s.links}>
            {job.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label} <ArrowUpRight />
                </a>
                {l.note && <span>{l.note}</span>}
              </li>
            ))}
          </ul>
        )}
        {job.tags && (
          <ul className={s.tags}>
            {job.tags.map((t) => (
              <li key={t}>
                <TechLabel name={t} />
              </li>
            ))}
          </ul>
        )}
      </TiltCard>
    </motion.article>
  );
};

const Experience = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const cometTop = useTransform(scaleY, (v) => `${v * 100}%`);

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeading index="03" eyebrow="Experience" title="My professional journey" highlight="journey" />

        <div className={s.layout}>
          <aside className={s.side}>
            <Reveal>
              <TiltCard className={cx(s.sideCard, "glass spotlight")} max={6}>
                <div className={s.sideHead}>
                  <Graduation /> Education
                </div>
                {education.map((edu) => (
                  <div key={edu.title} className={s.edu}>
                    <span className={s.time}>{edu.time}</span>
                    <h4>{edu.title}</h4>
                    <p>{edu.description}</p>
                    <p className={s.eduPlace}>{edu.location}</p>
                  </div>
                ))}
              </TiltCard>
            </Reveal>
            <Reveal delay={0.1}>
              <TiltCard className={cx(s.sideCard, "glass spotlight")} max={6}>
                <div className={s.sideHead}>
                  <Briefcase /> At a glance
                </div>
                <ul className={s.glance}>
                  {[
                    [`${years}+`, "Years"],
                    [`${work.length}`, "Companies"],
                    [`${cvConfig.works.length}`, "Projects"],
                  ].map(([value, label]) => (
                    <li key={label}>
                      <TiltCard className={s.glanceItem} max={16} lift={4} data-cursor-target>
                        <strong>{value}</strong>
                        <span>{label}</span>
                      </TiltCard>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
            <Reveal delay={0.2}>
              <TiltCard className={cx(s.sideCard, "glass spotlight")} max={6}>
                <div className={s.sideHead}>
                  <Globe /> Languages
                </div>
                <ul className={s.langs}>
                  {cvConfig.languages.map((l) => (
                    <li key={l.name}>
                      <strong>{l.name}</strong>
                      <span>{l.level}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          </aside>

          <div className={s.timeline} ref={timelineRef}>
            <div className={s.line} aria-hidden>
              <motion.div className={s.fill} style={{ scaleY }} />
              <motion.span className={s.comet} style={{ top: cometTop }} />
            </div>
            {work.map((job) => (
              <TimelineItem key={`${job.company}-${job.time}`} job={job} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

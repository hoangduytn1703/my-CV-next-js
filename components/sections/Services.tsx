import { CodeIcon, GaugeIcon, LayoutIcon, ShieldIcon } from "components/fx/icons";
import { Reveal } from "components/fx/Reveal";
import { TiltCard } from "components/fx/TiltCard";
import SectionHeading from "components/sections/SectionHeading";
import { cvConfig } from "config/cv";
import { CSSProperties } from "react";
import { cx } from "utils/common";
import s from "./Services.module.scss";

const ICONS: Record<string, typeof CodeIcon> = {
  code: CodeIcon,
  layout: LayoutIcon,
  speed: GaugeIcon,
  shield: ShieldIcon,
};

const Services = () => (
  <section id="services" className="section">
    <div className="container">
      <SectionHeading index="02" eyebrow="Services" title="What I can do for you" highlight="you" />

      <div className={s.grid}>
        {cvConfig.services.map((service, i) => {
          const Icon = ICONS[service.icon] ?? CodeIcon;

          return (
            <Reveal key={service.name} delay={i * 0.1} className={s.cell}>
              <TiltCard
                className={cx(s.card, "glass spotlight")}
                max={8}
                style={{ "--c": service.color } as CSSProperties}
              >
                <span className={s.num}>{`0${i + 1}`}</span>
                <div className={s.icon}>
                  <Icon />
                </div>
                <h3 className={s.title}>{service.name}</h3>
                <p className={s.desc}>{service.description}</p>
                <span className={s.bar} aria-hidden />
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;

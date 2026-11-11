import { ArrowUp } from "components/fx/icons";
import { Magnetic } from "components/fx/Magnetic";
import { EASE_OUT } from "components/fx/motion";
import { useScrollTo } from "components/fx/SmoothScroll";
import { cvConfig } from "config/cv";
import config from "config/site";
import { motion } from "framer-motion";
import s from "./Footer.module.scss";

const Footer = () => {
  const scrollTo = useScrollTo();
  const letters = cvConfig.name.split("");

  return (
    <footer className={s.footer}>
      <div className="container">
        <motion.p
          className={s.bigName}
          aria-label={cvConfig.name}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -5% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
        >
          {letters.map((l, i) => (
            <span key={i} className={s.mask} aria-hidden>
              <motion.span
                className={s.letter}
                variants={{
                  hidden: { y: "140%" },
                  show: { y: "0%", transition: { duration: 1, ease: EASE_OUT } },
                }}
              >
                {l === " " ? " " : l}
              </motion.span>
            </span>
          ))}
        </motion.p>

        <div className={s.bottom}>
          <span className={s.copy}>{config.copyright}</span>
          <ul className={s.socials}>
            {config.socialLinks.map((l) => (
              <li key={l.label}>
                <Magnetic strength={0.5}>
                  <a href={l.url} target="_blank" rel="noreferrer" aria-label={l.label}>
                    <i className={l.iconClassName} />
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
          <button className={s.toTop} onClick={() => scrollTo(0)}>
            Back to top <ArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useIntroDone } from "components/fx/Intro";
import { Magnetic } from "components/fx/Magnetic";
import { EASE_IN_OUT, EASE_OUT } from "components/fx/motion";
import { useLenis, useScrollTo } from "components/fx/SmoothScroll";
import ThemeToggle from "components/fx/ThemeToggle";
import { cvConfig } from "config/cv";
import config from "config/site";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MouseEvent, useEffect, useState } from "react";
import { cx } from "utils/common";
import s from "./Navbar.module.scss";

const items = cvConfig.menu.filter((m) => !m.disabled);
const socials = config.socialLinks.filter((l) => l.url.startsWith("http"));
const OVERLAY_ORIGIN = "at calc(100% - 46px) 46px";

const Navbar = () => {
  const intro = useIntroDone();
  const lenis = useLenis();
  const scrollTo = useScrollTo();
  const [active, setActive] = useState(items[0].href);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (Math.abs(y - prev) < 4) return;
    setHidden(y > prev && y > 400);
  });

  // Scroll-spy: the section crossing the middle of the viewport is "active".
  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.href)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else if (intro) lenis?.start();
    document.documentElement.classList.toggle("menu-open", open);
  }, [open, lenis, intro]);

  const go = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(`#${href}`);
  };

  return (
    <>
      <motion.header
        className={cx(s.header, scrolled && s.scrolled)}
        initial={{ y: -120, opacity: 0 }}
        animate={intro ? { y: hidden && !open ? -120 : 0, opacity: 1 } : { y: -120, opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <div className={cx("container", s.inner)}>
          <a href="#home" className={s.logo} onClick={go("home")} aria-label="Back to top">
            <span className={s.logoMark}>D</span>
            <span className={s.logoText}>
              DuyNH<span className={s.logoDot}>.</span>
            </span>
          </a>

          <nav className={s.pill} aria-label="Main">
            {items.map((item) => {
              const isActive = active === item.href;

              return (
                <a
                  key={item.href}
                  href={`#${item.href}`}
                  onClick={go(item.href)}
                  className={cx(s.link, isActive && s.active)}
                  aria-current={isActive ? "true" : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className={s.indicator}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={s.roll}>
                    <span data-text={item.label}>{item.label}</span>
                  </span>
                </a>
              );
            })}
          </nav>

          <div className={s.actions}>
            <ThemeToggle />
            <Magnetic className={s.ctaWrap}>
              <a href="#contact" onClick={go("contact")} className={cx("btn btn-primary", s.cta)}>
                Let&apos;s talk
              </a>
            </Magnetic>
            <button
              className={cx(s.burger, open && s.burgerOpen)}
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={s.overlay}
            initial={{ clipPath: `circle(0% ${OVERLAY_ORIGIN})` }}
            animate={{ clipPath: `circle(150% ${OVERLAY_ORIGIN})` }}
            exit={{ clipPath: `circle(0% ${OVERLAY_ORIGIN})` }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          >
            <nav className={s.overlayNav} aria-label="Mobile">
              {items.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={`#${item.href}`}
                  onClick={go(item.href)}
                  className={cx(s.overlayLink, active === item.href && s.overlayActive)}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 + i * 0.06 }}
                >
                  <span className={s.overlayIndex}>{`0${i + 1}`}</span>
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              className={s.overlayFoot}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
            >
              {socials.map((l) => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

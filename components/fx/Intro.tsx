import { prefersReducedMotion } from "components/fx/motion";
import { useLenis } from "components/fx/SmoothScroll";
import { content } from "config/content";
import { cvConfig } from "config/cv";
import { createContext, CSSProperties, Fragment, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { cx } from "utils/common";
import s from "./Intro.module.scss";

const IntroContext = createContext(false);

/** True once the preloader starts tearing away — sections use it to start their entrance. */
export const useIntroDone = () => useContext(IntroContext);

/* ------------------------------------------------------------------
   Cyberpunk boot intro: CRT power-on → boot log + segmented loader →
   name decrypt (glyph scramble + RGB-split glitch) → ACCESS GRANTED →
   glitch-out and the screen shreds into strips that fly off.
   Any key / click / wheel skips it. Reduced motion → short fade.
   ------------------------------------------------------------------ */

type Phase = "idle" | "boot" | "granted" | "exit" | "gone";

/** Timeline, in seconds from the moment the screen powers on. */
const T = {
  progressStart: 0.45,
  progressEnd: 2.7,
  nameStart: 0.85,
  nameResolveStart: 1.05,
  nameResolveEnd: 2.2,
  subStart: 1.9,
  subEnd: 2.55,
  granted: 2.8,
  exit: 3.45,
  exitDuration: 1.05,
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$*+=<>/\\|_";
const rand = (n: number) => Math.floor(Math.random() * n);
const glyph = () => GLYPHS[rand(GLYPHS.length)];
const hex = (digits: number) =>
  rand(16 ** digits)
    .toString(16)
    .toUpperCase()
    .padStart(digits, "0");
const hexRow = () => `0x${hex(4)}  ${Array.from({ length: 6 }, () => hex(2)).join(" ")}`;

/** The loader "stalls" a few times like a real one: [time 0..1, value 0..1]. */
const PROGRESS_KNOTS: [number, number][] = [
  [0, 0],
  [0.18, 0.21],
  [0.3, 0.27],
  [0.46, 0.49],
  [0.58, 0.53],
  [0.76, 0.8],
  [0.88, 0.9],
  [1, 1],
];
const progressAt = (x: number) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  for (let i = 1; i < PROGRESS_KNOTS.length; i++) {
    const [t1, v1] = PROGRESS_KNOTS[i];
    if (x <= t1) {
      const [t0, v0] = PROGRESS_KNOTS[i - 1];
      const k = (x - t0) / (t1 - t0);

      return v0 + (v1 - v0) * k * k * (3 - 2 * k);
    }
  }

  return 1;
};

/** Order in which the horizontal strips leave the screen. */
const STRIP_ORDER = [5, 1, 8, 3, 10, 0, 6, 11, 2, 9, 4, 7];

const { profile } = content;
const BOOT_LOG: [tag: string, label: string][] = [
  ["BIOS", "NHD-SYS v5.0 // KERNEL READY"],
  ["INIT", "NEURAL INTERFACE"],
  ["MOUNT", "/skills  react · next · vue"],
  ["SYNC", `EXPERIENCE  ${profile.yearsOfExperience}+ YRS`],
  ["TRACE", (profile.location.split(",")[0] || profile.location).toUpperCase()],
  ["DECRYPT", "IDENTITY"],
];

const Preloader = ({ onDone }: { onDone: () => void }) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reduce, setReduce] = useState(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const hexRef = useRef<HTMLPreElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  // Boot: drive everything time-based from one rAF loop (DOM writes via refs, no re-renders).
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    // Hydrated very late (slow network): the page has waited enough, don't replay the whole show.
    if (performance.now() - (nav?.responseEnd ?? 0) > 6000) {
      setPhase("exit");

      return;
    }

    const glyphs = Array.from(nameRef.current?.querySelectorAll<HTMLElement>("[data-ch]") ?? []);
    const finals = glyphs.map((el) => el.dataset.ch ?? "");
    const sub = subRef.current;
    const subFinal = sub?.dataset.text ?? "";
    const setStatus = (text: string) => {
      if (statusRef.current && statusRef.current.textContent !== text) statusRef.current.textContent = text;
    };
    const resolveAll = () => {
      glyphs.forEach((el, i) => {
        el.textContent = finals[i];
        el.classList.add(s.done);
      });
      nameRef.current?.classList.add(s.resolved);
      if (sub) sub.textContent = subFinal;
    };

    const reduced = prefersReducedMotion();
    setReduce(reduced);

    if (reduced) {
      resolveAll();
      if (counterRef.current) counterRef.current.textContent = "100";
      if (fillRef.current) fillRef.current.style.transform = "scaleX(1)";
      setStatus("ACCESS GRANTED");
      setPhase("granted");
      const timer = setTimeout(() => setPhase((p) => (p === "granted" ? "exit" : p)), 700);

      return () => clearTimeout(timer);
    }

    setPhase("boot");
    const start = performance.now();
    const rows = Array.from({ length: 9 }, hexRow);
    let raf = 0;
    let lastScramble = 0;
    let lastHex = 0;
    let lastSecond = -1;
    let resolved = false;
    let granted = false;

    const tick = (now: number) => {
      if (phaseRef.current === "exit" || phaseRef.current === "gone") return;
      const t = (now - start) / 1000;

      const p = progressAt((t - T.progressStart) / (T.progressEnd - T.progressStart));
      if (counterRef.current) counterRef.current.textContent = `${Math.round(p * 100)}`.padStart(3, "0");
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;

      if (now - lastScramble > 45) {
        lastScramble = now;
        if (t >= T.nameStart && !resolved) {
          const span = T.nameResolveEnd - T.nameResolveStart;
          let all = true;
          glyphs.forEach((el, i) => {
            const at = T.nameResolveStart + (span * i) / Math.max(1, glyphs.length - 1);
            if (t < at) {
              all = false;
              el.textContent = glyph();
            } else if (!el.classList.contains(s.done)) {
              el.textContent = finals[i];
              el.classList.add(s.done);
            }
          });
          if (all) {
            resolved = true;
            nameRef.current?.classList.add(s.resolved);
          }
        }
        if (sub && t >= T.subStart && sub.textContent !== subFinal) {
          const n = Math.floor(subFinal.length * Math.min(1, (t - T.subStart) / (T.subEnd - T.subStart)));
          sub.textContent =
            subFinal.slice(0, n) + Array.from(subFinal.slice(n), (c) => (c === " " ? " " : glyph())).join("");
        }
      }

      if (hexRef.current && now - lastHex > 90) {
        lastHex = now;
        rows[rand(rows.length)] = hexRow();
        rows[rand(rows.length)] = hexRow();
        hexRef.current.textContent = rows.join("\n");
      }

      const second = Math.floor(Date.now() / 1000);
      if (second !== lastSecond && clockRef.current) {
        lastSecond = second;
        clockRef.current.textContent = new Date().toLocaleTimeString("en-GB", { hour12: false });
      }

      setStatus(t < T.nameStart ? "ESTABLISHING UPLINK" : t < T.granted ? "DECRYPTING IDENTITY" : "ACCESS GRANTED");

      if (!granted && t >= T.granted) {
        granted = true;
        setPhase((ph) => (ph === "boot" ? "granted" : ph));
      }
      if (t >= T.exit) {
        setPhase((ph) => (ph === "boot" || ph === "granted" ? "exit" : ph));

        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  // Skip on any key / click / tap / wheel.
  useEffect(() => {
    if (phase !== "boot" && phase !== "granted") return;
    const skip = () => setPhase((p) => (p === "boot" || p === "granted" ? "exit" : p));
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });

    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [phase]);

  // Exit: release the page immediately (hero animates in under the shredding strips), unmount after.
  useEffect(() => {
    if (phase !== "exit") return;
    if (counterRef.current) counterRef.current.textContent = "100";
    if (fillRef.current) fillRef.current.style.transform = "scaleX(1)";
    onDoneRef.current();
    const timer = setTimeout(() => setPhase("gone"), (reduce ? 0.45 : T.exitDuration) * 1000);

    return () => clearTimeout(timer);
  }, [phase, reduce]);

  if (phase === "gone") return null;

  const subtitle = `// ${cvConfig.mainJob[0] ?? ""}`.toUpperCase();
  const words = cvConfig.name.split(" ");

  return (
    <div
      className={cx(
        s.preloader,
        phase !== "idle" && s.run,
        (phase === "granted" || phase === "exit") && s.granted,
        phase === "exit" && s.exit
      )}
    >
      <div className={s.strips} aria-hidden>
        {STRIP_ORDER.map((d, i) => (
          <span key={i} className={s.strip} style={{ "--d": d } as CSSProperties} />
        ))}
      </div>

      <div className={s.screen}>
        <div className={s.glow} aria-hidden />
        <div className={s.floor} aria-hidden />
        <div className={s.sweep} aria-hidden />
        <div className={s.frame} aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </div>

        <header className={s.top} aria-hidden>
          <span>
            <b>NHD</b>
            {"//PORTFOLIO_OS"}
          </span>
          <span className={s.topMid}>ENCRYPTED CHANNEL · AES-256</span>
          <span>
            <span ref={clockRef}>--:--:--</span> <span className={s.live}>LIVE</span>
          </span>
        </header>

        <ul className={s.log} aria-hidden>
          {BOOT_LOG.map(([tag, label], i) => (
            <li key={tag} style={{ "--i": i } as CSSProperties}>
              <span className={s.tag}>{tag}</span>
              <span className={s.label}>{label}</span>
              <span className={s.leader} />
              {i === BOOT_LOG.length - 1 ? (
                <span className={s.pending}>
                  <span>[RUN]</span>
                  <span>[OK]</span>
                </span>
              ) : (
                <span className={s.ok}>[OK]</span>
              )}
            </li>
          ))}
        </ul>

        <pre className={s.hex} ref={hexRef} aria-hidden />

        <div className={s.center}>
          <h2 className={s.name} ref={nameRef} aria-label={cvConfig.name}>
            <span className={s.nameText} aria-hidden>
              {words.map((word, wi) => (
                <Fragment key={wi}>
                  {wi > 0 && " "}
                  <span className={s.word}>
                    {word.split("").map((c, ci) => (
                      <span key={ci} className={s.ch}>
                        <span className={s.ghost}>{c}</span>
                        <span className={s.glyph} data-ch={c} />
                      </span>
                    ))}
                  </span>
                </Fragment>
              ))}
            </span>
            <span className={cx(s.clone, s.cloneA)} aria-hidden>
              {cvConfig.name}
            </span>
            <span className={cx(s.clone, s.cloneB)} aria-hidden>
              {cvConfig.name}
            </span>
          </h2>
          <p className={s.sub} ref={subRef} data-text={subtitle} aria-hidden />
          <div className={s.access} aria-hidden>
            <span>ACCESS GRANTED</span>
          </div>
        </div>

        <footer className={s.bottom} aria-hidden>
          <div className={s.meter}>
            <div className={s.meterHead}>
              <span ref={statusRef} className={s.status}>
                ESTABLISHING UPLINK
              </span>
              <span className={s.skip}>
                <span className={s.skipKey}>[ PRESS ANY KEY TO SKIP ]</span>
                <span className={s.skipTap}>[ TAP TO SKIP ]</span>
              </span>
            </div>
            <div className={s.track}>
              <div className={s.fill} ref={fillRef} />
            </div>
          </div>
          <div className={s.counter}>
            <span ref={counterRef}>000</span>
            <small>%</small>
          </div>
        </footer>

        <div className={s.scanlines} aria-hidden />
      </div>

      <div className={s.beam} aria-hidden />
      <div className={s.flash} aria-hidden />
    </div>
  );
};

export const IntroProvider = ({ children }: { children: ReactNode }) => {
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [done, lenis]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", !done);
  }, [done]);

  return (
    <IntroContext.Provider value={done}>
      <Preloader onDone={() => setDone(true)} />
      {children}
    </IntroContext.Provider>
  );
};

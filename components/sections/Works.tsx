import { ArrowUpRight, Close, GridView, ListView, Trophy } from "components/fx/icons";
import { EASE_OUT } from "components/fx/motion";
import { Reveal } from "components/fx/Reveal";
import { useLenis } from "components/fx/SmoothScroll";
import { TechLabel } from "components/fx/TechIcon";
import { TiltCard } from "components/fx/TiltCard";
import SectionHeading from "components/sections/SectionHeading";
import { CompanyType, cvConfig } from "config/cv";
import { AnimatePresence, motion, useSpring, useTransform, useVelocity } from "framer-motion";
import Image from "next/image";
import {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx } from "utils/common";
import s from "./Works.module.scss";

const ALL = CompanyType.Everything;

// Featured projects first, then the order from config (newest first).
const works = [...cvConfig.works]
  .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  .map((w, id) => ({
    ...w,
    id,
    slug: CompanyType[w.company] ?? "",
    tags: w.term
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  }));
type Work = typeof works[number];
type View = "grid" | "list";

const VIEWS: { id: View; label: string; Icon: typeof GridView }[] = [
  { id: "list", label: "List", Icon: ListView },
  { id: "grid", label: "Grid", Icon: GridView },
];

const filters = Object.entries(CompanyType).map(([label, slug]) => ({
  label,
  slug,
  count: slug === ALL ? works.length : works.filter((w) => w.slug === slug).length,
}));

const hasThumbnail = (w: Work) => !!w.thumbnail && !w.thumbnail.includes("placeholder");
const hasLink = (w: Work) => !!w.href && w.href !== "#";
const pad = (n: number) => String(n).padStart(2, "0");

/** Enter / Space activates a role="button" element. */
const onActivate = (fn: () => void) => (e: KeyboardEvent<HTMLElement>) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

/** Generated cover for projects without a screenshot. */
const PlaceholderArt = ({ title, seed = 0 }: { title: string; seed?: number }) => {
  const initials = title
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className={s.placeholder} style={{ "--h": `${(seed * 67) % 360}deg` } as CSSProperties} aria-hidden>
      <span>{initials}</span>
    </div>
  );
};

const Thumb = ({ work, sizes, className, eager }: { work: Work; sizes: string; className?: string; eager?: boolean }) =>
  hasThumbnail(work) ? (
    <Image src={work.thumbnail} alt="" fill sizes={sizes} className={className} loading={eager ? "eager" : undefined} />
  ) : (
    <PlaceholderArt title={work.title} seed={work.id} />
  );

/* ------------------------------------------------------------------ */
/* Grid view                                                           */
/* ------------------------------------------------------------------ */

const WorkCard = ({
  work,
  index,
  featured,
  onOpen,
}: {
  work: Work;
  index: number;
  featured: boolean;
  onOpen: () => void;
}) => (
  <TiltCard
    className={cx(s.card, featured && s.featured)}
    max={featured ? 5 : 8}
    role="button"
    tabIndex={0}
    aria-label={`${work.title} — view details`}
    data-cursor-label="View"
    onClick={onOpen}
    onKeyDown={onActivate(onOpen)}
  >
    <div className={s.thumb}>
      <Thumb
        work={work}
        className={s.img}
        sizes={
          featured ? "(max-width: 1080px) 100vw, 820px" : "(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 400px"
        }
      />
    </div>
    <div className={s.shade} aria-hidden />
    <span className={s.borderGlow} aria-hidden />
    <div className={s.topLeft}>
      <span className={s.index}>{featured ? `Featured · ${pad(index + 1)}` : pad(index + 1)}</span>
      {work.badge && (
        <span className={s.badge}>
          <Trophy /> {work.badge}
        </span>
      )}
    </div>
    <span className={s.arrow} aria-hidden>
      <ArrowUpRight />
    </span>
    <div className={s.meta}>
      <span className={s.company}>
        {work.client ?? work.company}
        {work.period && <span className={s.period}> · {work.period}</span>}
      </span>
      <h3 className={s.title}>{work.title}</h3>
      {featured && work.description && <p className={s.excerpt}>{work.description}</p>}
      <ul className={s.tags}>
        {work.tags.slice(0, featured ? 5 : 3).map((t) => (
          <li key={t}>
            <TechLabel name={t} />
          </li>
        ))}
        {work.tags.length > (featured ? 5 : 3) && <li>+{work.tags.length - (featured ? 5 : 3)}</li>}
      </ul>
    </div>
  </TiltCard>
);

const WorkGrid = ({ items, onOpen }: { items: Work[]; onOpen: (w: Work) => void }) => (
  <motion.div layout className={s.grid}>
    <AnimatePresence mode="popLayout">
      {items.map((work, i) => (
        <motion.div
          key={work.id}
          layout="position"
          className={cx(s.cell, i === 0 && s.featuredCell)}
          initial={{ opacity: 0, y: 50, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
          transition={{
            duration: 0.7,
            ease: EASE_OUT,
            delay: (i % 3) * 0.08,
            layout: { duration: 0.6, ease: EASE_OUT },
          }}
        >
          <WorkCard work={work} index={i} featured={i === 0} onOpen={() => onOpen(work)} />
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* List view — big typographic rows + a preview that chases the cursor */
/* ------------------------------------------------------------------ */

const FOLLOW_SPRING = { stiffness: 260, damping: 28, mass: 0.5 };
const PREVIEW_W = 380;
const PREVIEW_H = 250;
const PREVIEW_GAP = 14;

/** Preview position: follows the cursor horizontally, but floats above the hovered row
 *  (below it near the top of the screen) so it never covers the title you are reading. */
const previewPosition = (cursorX: number, row: HTMLElement) => {
  const r = row.getBoundingClientRect();
  const x = Math.min(Math.max(cursorX - PREVIEW_W / 2, 12), window.innerWidth - PREVIEW_W - 12);
  const above = r.top - PREVIEW_GAP - PREVIEW_H;
  const y = above > 70 ? above : r.bottom + PREVIEW_GAP;

  return { x, y };
};

const WorkList = ({ items, onOpen }: { items: Work[]; onOpen: (w: Work) => void }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const lastActive = useRef(0);
  if (active !== null) lastActive.current = active;

  const x = useSpring(0, FOLLOW_SPRING);
  const y = useSpring(0, FOLLOW_SPRING);
  // Tilt the preview in the direction the cursor travels.
  const rotate = useSpring(useTransform(useVelocity(x), [-1600, 1600], [-12, 12], { clamp: true }), {
    stiffness: 200,
    damping: 30,
  });

  // The row under the cursor is "active" — re-checked on scroll too, so wheel-scrolling
  // through the list without moving the mouse still updates the highlight and preview.
  const pick = useCallback(
    (jump = false) => {
      const p = pointer.current;
      const hit = p ? document.elementFromPoint(p.x, p.y)?.closest<HTMLElement>("[data-row]") : null;
      const row = hit && listRef.current?.contains(hit) ? hit : null;
      setActive(row ? Number(row.dataset.row) : null);
      if (!row || !p) return;
      const pos = previewPosition(p.x, row);
      if (jump) {
        x.jump(pos.x);
        y.jump(pos.y);
      } else {
        x.set(pos.x);
        y.set(pos.y);
      }
    },
    [x, y]
  );

  useEffect(() => {
    const onScroll = () => pick();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [pick]);

  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    pointer.current = { x: e.clientX, y: e.clientY };
    pick(true);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    pointer.current = { x: e.clientX, y: e.clientY };
    pick();
  };
  const onLeave = () => {
    pointer.current = null;
    setActive(null);
  };

  return (
    <div
      ref={listRef}
      className={cx(s.list, active !== null && s.listActive)}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {items.map((work, i) => (
        <motion.div
          key={work.id}
          data-row={i}
          role="button"
          tabIndex={0}
          aria-label={`${work.title} — view details`}
          data-cursor-label="Open"
          className={cx(s.row, active === i && s.rowActive)}
          onClick={() => onOpen(work)}
          onKeyDown={onActivate(() => onOpen(work))}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -6% 0px" }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: Math.min(i, 6) * 0.05 }}
        >
          <span className={s.rowIndex}>{pad(i + 1)}</span>
          <span className={s.rowThumb}>
            <Thumb work={work} sizes="80px" />
          </span>
          <div className={s.rowMain}>
            <h3 className={s.rowTitle}>{work.title}</h3>
            <span className={s.rowCompany}>
              {work.client ? `${work.client} · ${work.company}` : work.company}
              {work.period && ` · ${work.period}`}
            </span>
          </div>
          <ul className={s.rowTags}>
            {work.tags.slice(0, 3).map((t) => (
              <li key={t}>
                <TechLabel name={t} />
              </li>
            ))}
          </ul>
          <span className={s.rowArrow} aria-hidden>
            <ArrowUpRight />
          </span>
          <span className={s.rowLine} aria-hidden />
        </motion.div>
      ))}

      <motion.div
        className={s.preview}
        style={{ x, y, rotate }}
        initial={false}
        animate={{ scale: active !== null ? 1 : 0, opacity: active !== null ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        aria-hidden
      >
        <motion.div
          className={s.previewTrack}
          animate={{ y: `${-lastActive.current * 100}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 30 }}
        >
          {items.map((work) => (
            <div key={work.id} className={s.previewSlide}>
              <Thumb work={work} sizes="400px" eager />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Detail modal                                                        */
/* ------------------------------------------------------------------ */

const WorkModal = ({ work, onClose }: { work: Work | null; onClose: () => void }) => {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!work) return;
    lenis?.stop();
    document.documentElement.classList.add("modal-open");
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    return () => {
      lenis?.start();
      document.documentElement.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [work, lenis, onClose]);

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  });

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          className={s.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <motion.div
            className={s.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-modal-title"
            data-lenis-prevent
            initial={{ opacity: 0, y: 80, scale: 0.92, rotateX: 14 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.95, rotateX: 6 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <button ref={closeRef} className={s.close} onClick={onClose} aria-label="Close">
              <Close />
            </button>
            <div className={s.modalThumb}>
              <Thumb work={work} sizes="(max-width: 900px) 92vw, 860px" />
            </div>
            <div className={s.modalBody}>
              <motion.span className={s.company} {...fadeIn(0.12)}>
                {work.company}
              </motion.span>
              <motion.h3 id="work-modal-title" className={s.modalTitle} {...fadeIn(0.18)}>
                {work.title}
              </motion.h3>
              {work.badge && (
                <motion.span className={s.badge} {...fadeIn(0.2)}>
                  <Trophy /> {work.badge}
                </motion.span>
              )}
              <motion.dl className={s.modalMeta} {...fadeIn(0.22)}>
                {[
                  ["Role", work.role],
                  ["Period", work.period],
                  ["Client", work.client],
                  ["Company", work.company],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </motion.dl>
              {work.description && (
                <motion.p className={s.modalDesc} {...fadeIn(0.26)}>
                  {work.description}
                </motion.p>
              )}
              {work.highlights && (
                <motion.ul className={s.modalHighlights} {...fadeIn(0.3)}>
                  {work.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </motion.ul>
              )}
              <motion.ul className={s.modalTags} {...fadeIn(0.3)}>
                {work.tags.map((t) => (
                  <li key={t}>
                    <TechLabel name={t} />
                  </li>
                ))}
              </motion.ul>
              {hasLink(work) && (
                <motion.div {...fadeIn(0.36)}>
                  <a className="btn btn-primary" href={work.href} target="_blank" rel="noreferrer">
                    Visit website <ArrowUpRight />
                  </a>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------ */

const Works = () => {
  const [filter, setFilter] = useState(ALL);
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<Work | null>(null);
  const visible = useMemo(() => (filter === ALL ? works : works.filter((w) => w.slug === filter)), [filter]);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="works" className="section">
      <div className="container">
        <SectionHeading index="04" eyebrow="Portfolio" title="Selected works & projects" highlight="works" />

        <Reveal className={s.toolbar} y={20}>
          <div className={s.filters} role="tablist" aria-label="Filter projects by company">
            {filters.map((f) => {
              const active = filter === f.slug;

              return (
                <button
                  key={f.slug}
                  role="tab"
                  aria-selected={active}
                  className={cx(s.filter, active && s.filterActive)}
                  onClick={() => setFilter(f.slug)}
                >
                  {active && (
                    <motion.span
                      layoutId="works-filter"
                      className={s.filterPill}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={s.filterLabel}>{f.label}</span>
                  <span className={s.filterCount}>{f.count}</span>
                </button>
              );
            })}
          </div>

          <div className={s.viewToggle} role="group" aria-label="Layout">
            {VIEWS.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={cx(s.viewBtn, view === id && s.viewBtnActive)}
                aria-pressed={view === id}
                aria-label={`${label} view`}
                data-cursor-label={label}
                onClick={() => setView(id)}
              >
                {view === id && (
                  <motion.span
                    layoutId="works-view"
                    className={s.viewPill}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon />
              </button>
            ))}
          </div>
        </Reveal>

        {/* Opacity-only switch: a transform here would trap the fixed-position list preview. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {view === "grid" ? (
              <WorkGrid items={visible} onOpen={setSelected} />
            ) : (
              <WorkList key={filter} items={visible} onOpen={setSelected} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <WorkModal work={selected} onClose={close} />
    </section>
  );
};

export default Works;

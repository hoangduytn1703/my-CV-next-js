import { HTMLMotionProps, motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { PointerEvent, useRef } from "react";
import { cx } from "utils/common";

/** Writes the pointer position (relative to the element) into --x / --y for the .spotlight effect. */
export const trackPointer = (e: PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--y", `${e.clientY - rect.top}px`);
};

const SPRING = { stiffness: 220, damping: 20, mass: 0.6 };

interface TiltCardProps extends HTMLMotionProps<"div"> {
  /** Max rotation in degrees. */
  max?: number;
  glare?: boolean;
  hoverScale?: number;
}

/** 3D tilt-towards-cursor card with an optional moving glare. Mouse only — touch keeps the card flat. */
export const TiltCard = ({
  max = 10,
  glare = true,
  hoverScale = 1.02,
  className,
  style,
  children,
  onPointerMove,
  onPointerLeave,
  ...rest
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const scale = useSpring(1, SPRING);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, SPRING);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 55%)`;

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    trackPointer(e);
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ref.current.style.setProperty("--px", (px - 0.5).toFixed(3));
    ref.current.style.setProperty("--py", (py - 0.5).toFixed(3));
    rotateY.set((px - 0.5) * max * 2);
    rotateX.set((0.5 - py) * max * 2);
    scale.set(hoverScale);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareOpacity.set(1);
  };

  const handleLeave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cx("tilt", className)}
      style={{ ...style, rotateX, rotateY, scale, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      {children}
      {glare && (
        <motion.span className="tilt-glare" style={{ background: glareBg, opacity: glareOpacity }} aria-hidden />
      )}
    </motion.div>
  );
};

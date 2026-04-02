"use client";

import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ReactNode, useRef } from "react";

/**
 * ScrollProgress — hardware-accelerated scroll progress bar using native ScrollTimeline.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gradient-to-r from-accent via-sky to-accent origin-left"
      style={{ scaleX }}
    />
  );
}

/**
 * Parallax — moves children at a different rate than scroll.
 * offset: how many pixels to shift over the scroll range. Negative = moves up.
 */
export function Parallax({
  children,
  className = "",
  offset = -100,
}: {
  children: ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * ScrollFade — fades out hero content as user scrolls past.
 */
export function ScrollFade({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

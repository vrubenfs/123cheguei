"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

/**
 * HoverCard — lifts, scales, and tilts on hover. Spring physics.
 */
export function HoverCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * MagneticButton — follows cursor slightly on hover. Spring physics.
 */
export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  type,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "submit" | "button";
  disabled?: boolean;
}) {
  const Comp = href ? motion.a : motion.button;

  return (
    <Comp
      href={href}
      onClick={onClick}
      type={href ? undefined : type}
      disabled={disabled}
      className={className}
      whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </Comp>
  );
}

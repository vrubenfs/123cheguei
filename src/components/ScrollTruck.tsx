"use client";

import { motion, useScroll, useTransform } from "motion/react";

export default function ScrollTruck() {
  const { scrollYProgress } = useScroll();
  const left = useTransform(scrollYProgress, [0, 1], ["2%", "88%"]);

  return (
    <div className="fixed bottom-2 sm:bottom-3 left-0 right-0 z-40 pointer-events-none">
      {/* Road surface */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primary/[0.03] to-transparent" />

      {/* Dashed road line */}
      <div className="absolute bottom-3 sm:bottom-4 left-4 right-4 h-[2px]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, #1E3A5F 0px, #1E3A5F 10px, transparent 10px, transparent 20px)`,
            opacity: 0.1,
          }}
        />
      </div>

      {/* Truck */}
      <motion.div className="absolute bottom-2 sm:bottom-3" style={{ left }}>
        <svg width="44" height="26" viewBox="0 0 88 52" fill="none" className="sm:w-[52px] sm:h-[32px] drop-shadow-sm">
          {/* Cargo */}
          <rect x="0" y="4" width="48" height="30" rx="4" fill="#5A9E2F" />
          <rect x="4" y="8" width="40" height="22" rx="2" fill="white" opacity="0.15" />
          {/* Cab */}
          <path d="M48,14 L48,34 L68,34 L68,24 L62,14 Z" fill="#5A9E2F" />
          <path d="M52,17 L52,27 L63,27 L59,17 Z" fill="white" opacity="0.3" />
          {/* Bumper */}
          <rect x="66" y="28" width="7" height="5" rx="2" fill="#5A9E2F" opacity="0.7" />
          {/* Wheels */}
          <circle cx="16" cy="38" r="7" fill="#1E3A5F" />
          <circle cx="16" cy="38" r="3.5" fill="white" opacity="0.25" />
          <circle cx="16" cy="38" r="1.5" fill="white" />
          <circle cx="56" cy="38" r="7" fill="#1E3A5F" />
          <circle cx="56" cy="38" r="3.5" fill="white" opacity="0.25" />
          <circle cx="56" cy="38" r="1.5" fill="white" />
        </svg>
      </motion.div>
    </div>
  );
}

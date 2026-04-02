"use client";

import { motion, useScroll, useTransform } from "motion/react";

export default function ScrollTruck() {
  const { scrollYProgress } = useScroll();
  const left = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none h-14">
      {/* Road line */}
      <div className="absolute bottom-4 left-0 right-0 h-[2px] mx-4">
        <div
          className="w-full h-full opacity-[0.06]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, var(--primary) 0px, var(--primary) 12px, transparent 12px, transparent 24px)`,
          }}
        />
      </div>

      {/* Truck that moves with scroll */}
      <motion.div className="absolute bottom-1" style={{ left }}>
        <svg width="48" height="30" viewBox="0 0 96 56" fill="none">
          {/* Cargo */}
          <rect x="0" y="6" width="52" height="32" rx="4" fill="#5A9E2F" />
          <rect x="4" y="10" width="44" height="24" rx="2" fill="white" opacity="0.15" />
          <line x1="10" y1="18" x2="24" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
          <line x1="10" y1="24" x2="24" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
          {/* Cab */}
          <path d="M52,16 L52,38 L74,38 L74,26 L66,16 Z" fill="#5A9E2F" />
          <path d="M56,19 L56,30 L68,30 L63,19 Z" fill="white" opacity="0.3" />
          {/* Bumper */}
          <rect x="72" y="30" width="8" height="6" rx="2" fill="#5A9E2F" opacity="0.7" />
          {/* Wheels */}
          <circle cx="18" cy="42" r="8" fill="#1E3A5F" />
          <circle cx="18" cy="42" r="4" fill="white" opacity="0.2" />
          <circle cx="18" cy="42" r="1.5" fill="white" />
          <circle cx="60" cy="42" r="8" fill="#1E3A5F" />
          <circle cx="60" cy="42" r="4" fill="white" opacity="0.2" />
          <circle cx="60" cy="42" r="1.5" fill="white" />
          {/* Exhaust puffs */}
          <circle cx="-4" cy="36" r="4" fill="#1E3A5F" opacity="0.04">
            <animate attributeName="cx" values="-4;-20" dur="1s" repeatCount="indefinite" />
            <animate attributeName="r" values="4;8" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.04;0" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="-10" cy="33" r="3" fill="#1E3A5F" opacity="0.03">
            <animate attributeName="cx" values="-10;-28" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;7" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.03;0" dur="1.4s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>
    </div>
  );
}

"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect, useState, useRef } from "react";
import { StaggerContainer, StaggerItem } from "./motion/FadeIn";
import { useInView } from "motion/react";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!isInView) return;
    const t0 = performance.now();
    const run = (now: number) => {
      const p = Math.min((now - t0) / 2000, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf.current = requestAnimationFrame(run);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Stats() {
  const { locale } = useLanguage();

  const stats = [
    { n: 500, s: "+", l: locale === "pt" ? "Mudanças" : "Moves" },
    { n: 10, s: "+", l: locale === "pt" ? "Anos" : "Years" },
    { n: 98, s: "%", l: locale === "pt" ? "Satisfação" : "Satisfaction" },
    { n: 24, s: "h", l: locale === "pt" ? "Resposta" : "Response" },
  ];

  return (
    <section className="py-14 sm:py-16 bg-primary">
      <StaggerContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4" stagger={0.08}>
        {stats.map((s, i) => (
          <StaggerItem key={i} y={30} scale={0.85}>
            <div className="text-center relative">
              {i > 0 && <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/10" />}
              <div className="text-4xl sm:text-5xl font-black text-white"><Counter target={s.n} suffix={s.s} /></div>
              <div className="mt-1 text-xs font-semibold tracking-widest uppercase text-white/30">{s.l}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

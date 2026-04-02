"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion/FadeIn";
import { HoverCard } from "./motion/HoverCard";

const services = [
  { key: "residential" as const, badge: "Popular", badgeColor: "bg-accent", icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
  { key: "packing" as const, badge: null, badgeColor: "", icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg> },
  { key: "assembly" as const, badge: null, badgeColor: "", icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" /></svg> },
  { key: "transport" as const, badge: "Europa", badgeColor: "bg-sky", icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg> },
];

export default function Services() {
  const { t } = useLanguage();
  return (
    <section id="servicos" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto">
          <p className="text-accent font-bold text-sm tracking-[0.2em] uppercase mb-4">{t.services.subtitle}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">{t.services.title}</h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.08}>
          {services.map((s) => {
            const data = t.services[s.key];
            return (
              <StaggerItem key={s.key} y={30}>
                <HoverCard className="group relative rounded-2xl p-7 bg-[#F8FAFB] border border-gray-100 hover:border-accent/20 hover:bg-white hover:shadow-xl hover:shadow-accent/[0.06] transition-all duration-300 h-full cursor-default">
                  {s.badge && (
                    <span className={`absolute top-5 right-5 ${s.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                      {s.badge}
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    {s.icon}
                  </div>
                  <h3 className="mt-5 text-base font-bold text-primary">{data.title}</h3>
                  <p className="mt-2 text-sm text-foreground/55 leading-relaxed">{data.description}</p>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

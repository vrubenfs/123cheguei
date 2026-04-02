"use client";

import { useLanguage } from "@/i18n/LanguageContext";

export default function Hero() {
  const { t, locale } = useLanguage();

  return (
    <section id="hero" className="relative min-h-[100vh] flex items-center bg-gradient-to-b from-primary via-primary to-[#162d4a] overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "40px 40px" }} />

      {/* Gradient orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/[0.08] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-sky/[0.06] rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.1] px-4 py-2 rounded-full text-sm font-medium text-white/70 mb-8">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inset-0 rounded-full bg-accent opacity-75" /><span className="relative rounded-full h-2 w-2 bg-accent" /></span>
              {locale === "pt" ? "Mudanças em Portugal & Europa" : "Moving across Portugal & Europe"}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1] tracking-tight">
              <span className="text-white block">{locale === "pt" ? "Mudanças" : "Moving"}</span>
              <span className="bg-gradient-to-r from-accent via-accent-light to-sky bg-clip-text text-transparent block mt-2">
                {locale === "pt" ? "sem stress." : "stress-free."}
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/40 max-w-md leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
              <a href="#orcamento" className="group inline-flex items-center gap-2.5 bg-accent hover:bg-[#4E8C27] text-white text-base font-bold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-accent/25 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
                {t.hero.cta}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a href="tel:932844460" className="inline-flex items-center gap-3 text-white/60 hover:text-white font-medium text-base py-3 transition-colors">
                <span className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </span>
                932 844 460
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
                <span className="text-white/60 text-sm font-medium ml-1">4.9/5</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-white/40 text-sm">500+ {locale === "pt" ? "mudanças realizadas" : "moves completed"}</span>
            </div>
          </div>

          {/* Right: quick quote card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/20 relative">
            <div className="absolute -top-3 left-8 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-accent/30">
              {locale === "pt" ? "ORÇAMENTO GRÁTIS" : "FREE QUOTE"}
            </div>
            <h3 className="text-xl font-bold text-primary mt-2 mb-6">{locale === "pt" ? "Peça já o seu orçamento" : "Get your quote now"}</h3>
            <form className="space-y-4">
              <input type="text" placeholder={locale === "pt" ? "Nome" : "Name"} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all" />
              <input type="tel" placeholder={locale === "pt" ? "Telefone" : "Phone"} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder={locale === "pt" ? "De (cidade)" : "From (city)"} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all" />
                <input type="text" placeholder={locale === "pt" ? "Para (cidade)" : "To (city)"} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all" />
              </div>
              <a href="#orcamento" className="block w-full bg-accent hover:bg-[#4E8C27] text-white text-center font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-accent/20">
                {locale === "pt" ? "Pedir Orçamento →" : "Get Quote →"}
              </a>
            </form>
            <p className="text-xs text-gray-400 text-center mt-4">{locale === "pt" ? "Resposta em menos de 24h · Sem compromisso" : "Response within 24h · No obligation"}</p>
          </div>
        </div>
      </div>

      {/* Bottom curve transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 60V30C360 0 720 0 1080 30L1440 60H0Z" fill="white" /></svg>
      </div>
    </section>
  );
}

"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";
import { Logo } from "./TruckLogo";

export default function Header() {
  const { t, locale, toggleLocale } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "#servicos", label: t.nav.services },
    { href: "#como-funciona", label: t.nav.howItWorks },
    { href: "#orcamento", label: t.nav.quote },
    { href: "#contacto", label: t.nav.contact },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled || menuOpen ? "bg-white/95 backdrop-blur-lg shadow-md shadow-primary/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-[72px]">
        <a href="#" aria-label="123cheguei"><Logo variant={scrolled || menuOpen ? "default" : "white"} /></a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a key={l.href} href={l.href} className={`text-sm font-medium px-3 py-2 rounded-lg transition-all ${scrolled || menuOpen ? "text-foreground/60 hover:text-primary hover:bg-primary/[0.04]" : "text-white/60 hover:text-white hover:bg-white/[0.06]"}`}>{l.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggleLocale} className={`text-xs font-bold border rounded-full w-9 h-9 flex items-center justify-center transition-all ${scrolled || menuOpen ? "border-primary/15 text-primary/70 hover:bg-primary/[0.04]" : "border-white/20 text-white/70 hover:bg-white/[0.06]"}`} aria-label={locale === "pt" ? "Switch to English" : "Mudar para Português"}>
            {locale === "pt" ? "EN" : "PT"}
          </button>
          <a href="#orcamento" className="hidden sm:inline-flex bg-accent hover:bg-[#4E8C27] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm">
            {t.nav.getQuote}
          </a>
          <button className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg ${scrolled || menuOpen ? "text-primary" : "text-white"}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden px-4 pb-4 pt-2 border-t border-primary/5 flex flex-col gap-1">
          {links.map(l => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-foreground/60 px-3 py-3 rounded-xl hover:bg-primary/[0.04]">{l.label}</a>)}
          <a href="#orcamento" onClick={() => setMenuOpen(false)} className="bg-accent text-white text-sm font-semibold px-5 py-3 rounded-full text-center mt-2">{t.nav.getQuote}</a>
        </nav>
      )}
    </header>
  );
}

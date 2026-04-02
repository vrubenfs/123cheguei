"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { useState, FormEvent } from "react";
import { SlideIn } from "./motion/FadeIn";
import { MagneticButton } from "./motion/HoverCard";

export default function MoveRequestForm() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { setStatus("success"); (e.target as HTMLFormElement).reset(); } else setStatus("error");
    } catch { setStatus("error"); }
  };

  const inp = "w-full px-4 py-3.5 rounded-xl border border-primary/[0.06] bg-white text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all text-[15px]";

  return (
    <section id="orcamento" className="py-20 sm:py-28 bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — slides from left */}
          <SlideIn from="left">
            <p className="text-accent font-bold text-sm tracking-[0.15em] uppercase mb-3">{t.form.subtitle}</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{t.form.title}</h2>
            <p className="mt-6 text-white/35 text-lg leading-relaxed max-w-md">
              {locale === "pt" ? "Preencha o formulário e receba uma proposta personalizada em menos de 24 horas. Sem compromisso." : "Fill in the form and receive a personalized proposal within 24 hours. No obligation."}
            </p>
            <div className="mt-8 space-y-4">
              <a href="tel:932844460" className="flex items-center gap-4 text-white/50 hover:text-white transition-colors">
                <span className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center"><svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></span>
                <div><div className="text-xs text-white/25">{locale === "pt" ? "Ligue-nos" : "Call us"}</div><div className="font-bold text-lg">932 844 460</div></div>
              </a>
              <a href="https://wa.me/351932844460" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/50 hover:text-white transition-colors">
                <span className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center"><svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg></span>
                <div><div className="text-xs text-white/25">WhatsApp</div><div className="font-bold text-lg">{locale === "pt" ? "Enviar mensagem" : "Send message"}</div></div>
              </a>
            </div>
          </SlideIn>

          {/* Form — slides from right */}
          <SlideIn from="right" delay={0.15}>
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-7 sm:p-10 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">{t.form.name} <span className="text-red">*</span></label>
                  <input id="name" type="text" name="name" required autoComplete="name" className={inp} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">{t.form.email} <span className="text-red">*</span></label>
                  <input id="email" type="email" name="email" required autoComplete="email" className={inp} />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-primary mb-2">{t.form.phone} <span className="text-red">*</span></label>
                  <input id="phone" type="tel" name="phone" required autoComplete="tel" className={inp} />
                </div>
                <div>
                  <label htmlFor="from" className="block text-sm font-semibold text-primary mb-2">{t.form.from} <span className="text-red">*</span></label>
                  <input id="from" type="text" name="from" required className={inp} />
                </div>
                <div>
                  <label htmlFor="to" className="block text-sm font-semibold text-primary mb-2">{t.form.to} <span className="text-red">*</span></label>
                  <input id="to" type="text" name="to" required className={inp} />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-semibold text-primary mb-2">{t.form.date}</label>
                  <input id="date" type="date" name="date" className={inp} />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-primary mb-2">{t.form.type}</label>
                  <select id="type" name="type" className={inp}><option value="">{t.form.typePlaceholder}</option>{t.form.types.map(ty => <option key={ty} value={ty}>{ty}</option>)}</select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-semibold text-primary mb-2">{t.form.notes}</label>
                  <textarea id="notes" name="notes" rows={3} placeholder={t.form.notesPlaceholder} className={`${inp} resize-none`} />
                </div>
              </div>
              <MagneticButton type="submit" disabled={status === "sending"} className="mt-6 w-full bg-accent hover:bg-[#4E8C27] disabled:opacity-50 text-white text-lg font-bold py-4 rounded-full transition-colors shadow-lg shadow-accent/20">
                {status === "sending" ? t.form.sending : t.form.submit}
              </MagneticButton>
              {status === "success" && <div className="mt-4 p-3 bg-accent/10 text-accent rounded-xl text-center text-sm font-medium">{t.form.success}</div>}
              {status === "error" && <div className="mt-4 p-3 bg-red/10 text-red rounded-xl text-center text-sm font-medium">{t.form.error}</div>}
            </form>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { useState, FormEvent } from "react";

export default function Hero() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string || "",
      phone: fd.get("phone") as string,
      from: fd.get("from") as string,
      to: fd.get("to") as string,
      date: fd.get("date") as string || "",
      website: fd.get("website") as string || "",
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setStatus("success"); (e.target as HTMLFormElement).reset(); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  const inp = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all";

  return (
    <section id="hero" className="relative min-h-[100vh] flex items-center bg-gradient-to-b from-primary via-primary to-[#162d4a] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/[0.08] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-sky/[0.06] rounded-full blur-[100px]" />

      {/* Real Europe map with Portugal in green */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/europe-map-opt.svg"
        alt=""
        className="absolute left-[5%] sm:left-[10%] top-[5%] w-[80%] sm:w-[60%] lg:w-[50%] h-auto opacity-[0.35] pointer-events-none select-none"
        loading="lazy"
      />

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

            <p className="mt-6 text-base sm:text-lg text-white/60 max-w-md leading-relaxed">{t.hero.subtitle}</p>

            <div className="mt-8 flex items-center gap-3">
              <a href="tel:932844460" className="inline-flex items-center gap-3 text-white/60 hover:text-white font-medium text-base py-3 transition-colors">
                <span className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </span>
                932 844 460
              </a>
              <a href="https://wa.me/351932844460" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#20BD5A] font-medium text-sm py-3 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-10 flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
                <span className="text-white/60 text-sm font-medium ml-1">4.9/5</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-white/60 text-sm">500+ {locale === "pt" ? "mudanças realizadas" : "moves completed"}</span>
            </div>
          </div>

          {/* Right: working quote form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/20 relative">
            <div className="absolute -top-3 left-8 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-accent/30">
              {locale === "pt" ? "ORÇAMENTO GRÁTIS" : "FREE QUOTE"}
            </div>

            {status === "success" ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-primary">{locale === "pt" ? "Pedido enviado!" : "Request sent!"}</h3>
                <p className="text-sm text-foreground/50 mt-2">{locale === "pt" ? "Entraremos em contacto em breve." : "We'll be in touch soon."}</p>
                <button onClick={() => setStatus("idle")} className="mt-4 text-accent text-sm font-semibold hover:underline">
                  {locale === "pt" ? "Enviar outro pedido" : "Send another request"}
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-primary mt-2 mb-6">{locale === "pt" ? "Peça já o seu orçamento" : "Get your quote now"}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="text" name="website" className="absolute opacity-0 pointer-events-none h-0 w-0" tabIndex={-1} autoComplete="off" />
                  <input type="text" name="name" required placeholder={locale === "pt" ? "Nome *" : "Name *"} className={inp} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="tel" name="phone" required placeholder={locale === "pt" ? "Telefone *" : "Phone *"} className={inp} />
                    <input type="email" name="email" placeholder="Email" className={inp} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" name="from" required placeholder={locale === "pt" ? "De (cidade) *" : "From (city) *"} className={inp} />
                    <input type="text" name="to" required placeholder={locale === "pt" ? "Para (cidade) *" : "To (city) *"} className={inp} />
                  </div>
                  <input type="date" name="date" className={`${inp} text-gray-400`} />
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" name="gdpr" required className="mt-0.5 accent-accent" />
                    <span>{locale === "pt" ? "Aceito a recolha dos meus dados para resposta ao pedido de orçamento." : "I consent to data collection to respond to my quote request."}</span>
                  </label>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="block w-full bg-accent hover:bg-[#4E8C27] disabled:opacity-50 text-white text-center font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-accent/20"
                  >
                    {status === "sending"
                      ? (locale === "pt" ? "A enviar..." : "Sending...")
                      : (locale === "pt" ? "Pedir Orçamento →" : "Get Quote →")
                    }
                  </button>
                </form>
                {status === "error" && (
                  <p className="text-red text-xs text-center mt-3">{locale === "pt" ? "Erro ao enviar. Tente ligar 932 844 460." : "Error sending. Try calling 932 844 460."}</p>
                )}
                <p className="text-xs text-gray-400 text-center mt-4">{locale === "pt" ? "Resposta em menos de 24h · Sem compromisso" : "Response within 24h · No obligation"}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 60V30C360 0 720 0 1080 30L1440 60H0Z" fill="white" /></svg>
      </div>
    </section>
  );
}

"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";
import { FadeIn } from "./motion/FadeIn";

const faqs = {
  pt: [
    { q: "Com quanta antecedência devo marcar a mudança?", a: "Recomendamos pelo menos 1-2 semanas de antecedência. Para mudanças internacionais, 3-4 semanas é ideal. Em caso de urgência, fazemos o possível para acomodar pedidos de última hora." },
    { q: "Os meus pertences estão seguros durante o transporte?", a: "Sim. Todos os transportes incluem seguro de carga. Os seus móveis são protegidos com mantas, filme stretch e caixas reforçadas. Em caso de dano, cobrimos a reparação ou substituição." },
    { q: "Fornecem materiais de embalagem?", a: "Sim. Fornecemos caixas de cartão reforçado, papel bolha, fita adesiva, filme stretch e proteções para móveis. Pode optar pelo serviço de embalagem completo ou levantar os materiais para embalar você mesmo." },
    { q: "Fazem mudanças internacionais?", a: "Sim. Cobrimos todo o espaço europeu: Espanha, França, Alemanha, Suíça, Bélgica, Holanda, Luxemburgo, Reino Unido e mais. Tratamos de toda a logística." },
    { q: "Qual é o preço de uma mudança?", a: "O preço depende da distância, volume de bens, andar e acessibilidade. Envie-nos o pedido de orçamento e responderemos em menos de 24 horas com um valor personalizado, sem compromisso." },
    { q: "Desmontam e montam móveis?", a: "Sim. A nossa equipa desmonta e monta móveis IKEA, cozinhas, roupeiros e camas. Incluído no serviço ou disponível como extra." },
  ],
  en: [
    { q: "How far in advance should I book?", a: "We recommend at least 1-2 weeks notice. For international moves, 3-4 weeks is ideal. For urgent moves, we do our best to accommodate last-minute requests." },
    { q: "Are my belongings insured during transport?", a: "Yes. All transports include cargo insurance. Your furniture is protected with blankets, stretch film, and reinforced boxes. In case of damage, we cover repair or replacement." },
    { q: "Do you provide packing materials?", a: "Yes. We supply reinforced cardboard boxes, bubble wrap, tape, stretch film, and furniture protectors. You can choose full packing service or pick up materials to self-pack." },
    { q: "Do you handle international moves?", a: "Yes. We cover all of Europe: Spain, France, Germany, Switzerland, Belgium, Netherlands, Luxembourg, UK and more. We handle all logistics." },
    { q: "How much does a move cost?", a: "Price depends on distance, volume, floor level, and accessibility. Send us a quote request and we'll respond within 24 hours with a personalized, no-obligation price." },
    { q: "Do you disassemble and reassemble furniture?", a: "Yes. Our team handles IKEA, kitchens, wardrobes, and beds. Included in service or available as an add-on." },
  ],
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm sm:text-base font-semibold text-primary pr-4">{q}</span>
        <svg
          className={`w-5 h-5 text-accent shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-60" : "max-h-0"}`}>
        <p className="px-6 pb-4 text-sm text-foreground/60 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { locale } = useLanguage();
  const items = locale === "pt" ? faqs.pt : faqs.en;

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <p className="text-accent font-bold text-sm tracking-[0.2em] uppercase mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            {locale === "pt" ? "Perguntas Frequentes" : "Frequently Asked Questions"}
          </h2>
        </FadeIn>

        <div className="space-y-3">
          {items.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

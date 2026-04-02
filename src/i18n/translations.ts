export const translations = {
  pt: {
    nav: {
      services: "Serviços",
      howItWorks: "Como Funciona",
      quote: "Orçamento",
      contact: "Contacto",
      getQuote: "Pedir Orçamento",
    },
    hero: {
      title: "Mudanças simples, rápidas e sem stress",
      subtitle:
        "Serviço profissional de mudanças residenciais em todo o Portugal e Europa. Cuidamos da sua mudança como se fosse a nossa.",
      cta: "Pedir Orçamento Grátis",
    },
    services: {
      title: "Os Nossos Serviços",
      subtitle: "Tudo o que precisa para uma mudança tranquila",
      residential: {
        title: "Mudanças Residenciais",
        description:
          "Mudanças de apartamentos e moradias com cuidado e profissionalismo. De T0 a T5+, tratamos de tudo.",
      },
      packing: {
        title: "Embalagem e Proteção",
        description:
          "Embalamos os seus pertences com materiais de qualidade para garantir que tudo chega em perfeitas condições.",
      },
      assembly: {
        title: "Montagem e Desmontagem",
        description:
          "Desmontamos e montamos os seus móveis no destino. Rápido, eficiente e sem danos.",
      },
      transport: {
        title: "Transporte Nacional e Europeu",
        description:
          "Transporte seguro para qualquer destino em Portugal e Europa. Cobertura total com veículos adequados.",
      },
    },
    howItWorks: {
      title: "Como Funciona",
      subtitle: "3 passos simples para a sua mudança",
      step1: {
        title: "Preencha o Formulário",
        description:
          "Indique os detalhes da sua mudança: origem, destino, data e tipo de habitação.",
      },
      step2: {
        title: "Receba o Orçamento",
        description:
          "Contactamos em menos de 24 horas com um orçamento personalizado e sem compromisso.",
      },
      step3: {
        title: "Mudança Feita!",
        description:
          "No dia marcado, a nossa equipa trata de tudo. 1, 2, 3... cheguei!",
      },
    },
    form: {
      title: "Pedir Orçamento",
      subtitle: "Preencha o formulário e receba uma proposta sem compromisso",
      name: "Nome Completo",
      email: "Email",
      phone: "Telefone",
      from: "Morada de Origem",
      to: "Morada de Destino",
      date: "Data Pretendida",
      type: "Tipologia",
      typePlaceholder: "Selecione...",
      types: ["T0/T1", "T2", "T3", "T4", "T5+"],
      notes: "Observações",
      notesPlaceholder:
        "Descreva detalhes adicionais (andar, elevador, objetos especiais, etc.)",
      submit: "Enviar Pedido",
      sending: "A enviar...",
      success: "Pedido enviado com sucesso! Entraremos em contacto em breve.",
      error: "Erro ao enviar. Por favor tente novamente ou ligue para 932 844 460.",
    },
    footer: {
      description:
        "Serviço profissional de mudanças e transporte. Cuidamos da sua mudança com dedicação e profissionalismo.",
      quickLinks: "Links Rápidos",
      contactInfo: "Contacto",
      rights: "Todos os direitos reservados.",
    },
  },
  en: {
    nav: {
      services: "Services",
      howItWorks: "How It Works",
      quote: "Quote",
      contact: "Contact",
      getQuote: "Get a Quote",
    },
    hero: {
      title: "Simple, fast, stress-free moves",
      subtitle:
        "Professional household moving services across Portugal and Europe. We take care of your move as if it were our own.",
      cta: "Get a Free Quote",
    },
    services: {
      title: "Our Services",
      subtitle: "Everything you need for a smooth move",
      residential: {
        title: "Household Moves",
        description:
          "Apartment and house moves with care and professionalism. From studios to 5+ bedrooms, we handle it all.",
      },
      packing: {
        title: "Packing & Protection",
        description:
          "We pack your belongings with quality materials to ensure everything arrives in perfect condition.",
      },
      assembly: {
        title: "Assembly & Disassembly",
        description:
          "We disassemble and reassemble your furniture at the destination. Fast, efficient, and damage-free.",
      },
      transport: {
        title: "National & European Transport",
        description:
          "Safe transport to any destination in Portugal and Europe. Full coverage with proper vehicles.",
      },
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "3 simple steps to your move",
      step1: {
        title: "Fill the Form",
        description:
          "Tell us about your move: origin, destination, date, and property type.",
      },
      step2: {
        title: "Get Your Quote",
        description:
          "We'll contact you within 24 hours with a personalized, no-obligation quote.",
      },
      step3: {
        title: "Move Complete!",
        description:
          "On the scheduled day, our team handles everything. 1, 2, 3... we're there!",
      },
    },
    form: {
      title: "Get a Quote",
      subtitle: "Fill in the form and receive a no-obligation proposal",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      from: "Origin Address",
      to: "Destination Address",
      date: "Preferred Date",
      type: "Property Type",
      typePlaceholder: "Select...",
      types: ["Studio/1 Bed", "2 Bed", "3 Bed", "4 Bed", "5+ Bed"],
      notes: "Notes",
      notesPlaceholder:
        "Describe additional details (floor, elevator, special items, etc.)",
      submit: "Send Request",
      sending: "Sending...",
      success: "Request sent successfully! We'll be in touch soon.",
      error: "Error sending. Please try again or call 932 844 460.",
    },
    footer: {
      description:
        "Professional moving and transport services. We take care of your move with dedication and professionalism.",
      quickLinks: "Quick Links",
      contactInfo: "Contact",
      rights: "All rights reserved.",
    },
  },
} as const;

export type Locale = keyof typeof translations;
export type Translations = (typeof translations)[Locale];

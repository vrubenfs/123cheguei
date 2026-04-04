import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A5F",
};

export const metadata: Metadata = {
  title: "123cheguei | Mudanças e Transporte Profissional em Portugal",
  description:
    "Serviço profissional de mudanças residenciais em Portugal e Europa. Mudanças de apartamentos e moradias com cuidado. Peça o seu orçamento grátis! Ligue 932 844 460.",
  keywords: [
    "mudanças",
    "transporte",
    "mudanças residenciais",
    "mudanças Portugal",
    "mudanças Lisboa",
    "mudanças Porto",
    "empresa de mudanças",
    "transporte de móveis",
    "mudanças baratas",
    "orçamento mudanças",
    "123cheguei",
  ],
  authors: [{ name: "123cheguei" }],
  creator: "123cheguei",
  publisher: "123cheguei",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    alternateLocale: "en_GB",
    siteName: "123cheguei",
    title: "123cheguei | Mudanças e Transporte Profissional",
    description:
      "Mudanças residenciais em Portugal e Europa. Serviço profissional, rápido e sem stress. Orçamento grátis!",
    url: "https://123cheguei.pt",
    images: [
      {
        url: "https://123cheguei.pt/og-image.svg",
        width: 1200,
        height: 630,
        alt: "123cheguei - Mudanças e Transporte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "123cheguei | Mudanças e Transporte",
    description:
      "Mudanças residenciais em Portugal e Europa. Peça o seu orçamento grátis!",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: "https://123cheguei.pt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "123cheguei",
    description:
      "Serviço profissional de mudanças residenciais em Portugal e Europa",
    telephone: "+351932844460",
    email: "info@123cheguei.pt",
    url: "https://123cheguei.pt",
    areaServed: [
      { "@type": "Country", name: "Portugal" },
      { "@type": "Continent", name: "Europe" },
    ],
    serviceType: [
      "Mudanças Residenciais",
      "Transporte de Móveis",
      "Embalagem",
      "Montagem e Desmontagem",
    ],
    priceRange: "$$",
  };

  return (
    <html lang="pt" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

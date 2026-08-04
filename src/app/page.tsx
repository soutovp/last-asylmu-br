import { Metadata } from "next";
import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";

export const metadata: Metadata = {
  title: "Last Asylum BR - Portal, Calculadoras e Guias de Last Asylum Plague",
  description: "O hub brasileiro definitivo para Last Asylum Plague. Encontre calculadoras de recursos (Antitoxina, Fragmentos, Insígnias), calendário de eventos semanais, guias de sobrevivência e notícias oficiais.",
  keywords: [
    "Last Asylum Plague",
    "Last Asylum BR",
    "Last Asylum jogo",
    "Last Asylum guia",
    "Last Asylum calculadoras",
    "Last Asylum dicas",
    "Last Asylum sobrevivência",
    "Last Asylum Brasil",
    "Last Asylum Plague game",
    "Last Asylum Plague dicas"
  ],
  openGraph: {
    title: "Last Asylum BR - Portal, Calculadoras e Guias de Last Asylum Plague",
    description: "O hub brasileiro definitivo para Last Asylum Plague. Encontre calculadoras de recursos, calendário de eventos semanais, guias de sobrevivência e notícias oficiais.",
    url: "https://lastasylum.com.br",
    siteName: "Last Asylum BR",
    images: [
      {
        url: "/images/last-asylum-br-logo.png",
        width: 1200,
        height: 630,
        alt: "Last Asylum BR Logo"
      }
    ],
    locale: "pt_BR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Last Asylum BR - Portal, Calculadoras e Guias de Last Asylum Plague",
    description: "O hub brasileiro definitivo para Last Asylum Plague. Encontre calculadoras de recursos, calendário de eventos semanais e muito mais.",
    images: ["/images/last-asylum-br-logo.png"]
  }
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-[#00ff88] selection:text-slate-950">
      {/* BANNER PRINCIPAL COM BARRA DE NAVEGAÇÃO FLUTUANTE */}
      <Hero />

      {/* SEÇÃO DA CENTRAL DE NOTÍCIAS & ATUALIZAÇÕES BRASIL */}
      <NewsSection />
    </div>
  );
}

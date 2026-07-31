import Image from "next/image";
import Header from "@/components/Header";
import Calculators from "@/components/Calculators";

export const metadata = {
  title: "Calculadoras - Last Asylum BR",
  description: "Calcule os custos de Antitoxina, Estrelas e Habilidades de Heróis no Last Asylum Plague.",
};

export default function CalculadorasPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-[#00ff88] selection:text-slate-950 overflow-x-hidden">
      
      {/* BACKGROUND FIXO DA VILA COM ALTA INTENSIDADE E OPACIDADE (85%) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/village_banner_2.png"
          alt="Background Fixo da Vila"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85 scale-105"
        />
        {/* OVERLAYS LEVES APENAS PARA CONSERVAR O CONTRASTE DOS TEXTOS */}
        <div className="absolute inset-0 bg-[#080c14]/25 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/70 via-transparent to-[#080c14]/80"></div>
      </div>

      {/* CONTEÚDO PRINCIPAL (SOBREPOSTO AO BACKGROUND FIXO) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 py-4">
          <Calculators />
        </main>
      </div>
    </div>
  );
}

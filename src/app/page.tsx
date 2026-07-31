import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";

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






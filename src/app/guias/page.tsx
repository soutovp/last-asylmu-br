import Image from "next/image";
import Header from "@/components/Header";

export const metadata = {
  title: "Guias & Tutoriais - Last Asylum BR",
  description: "Guias estratégicos, tutoriais para iniciantes e dicas avançadas para Last Asylum Plague.",
};

export default function GuiasPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-[#00ff88] selection:text-slate-950 overflow-x-hidden">
      
      {/* BACKGROUND FIXO DA VILA PARA PÁGINAS INTERNAS (OPACIDADE 85%) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/village_banner_2.png"
          alt="Background Fixo da Vila"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85 scale-105"
        />
        <div className="absolute inset-0 bg-[#080c14]/25 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/70 via-transparent to-[#080c14]/80"></div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-400 mb-4">
              <span>📚 Base de Conhecimento</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-md">
              Guias & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">Tutoriais</span>
            </h1>
            <p className="mt-3 text-slate-300 drop-shadow-sm font-medium">
              Aprenda estratégias de evolução rápida, defesa de base e otimização de recursos.
            </p>
          </div>

          <div className="bg-[#101623]/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl text-center space-y-4 shadow-2xl">
            <span className="text-4xl block">📖</span>
            <h3 className="text-xl font-bold text-white">Central de Guias em Construção</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Em breve esta seção reunirá tutoriais detalhados e guias passo a passo produzidos pela comunidade.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  category: "Atualizações" | "Eventos" | "Guias" | "Manutenção";
  date: string;
  readTime: string;
  summary: string;
  isFeatured?: boolean;
  tagColor: string;
}

export default function NewsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const newsList: NewsItem[] = [
    {
      id: "invasao-praga-2026",
      title: "Invasão Global de Praga: Guia de Recompensas e Estratégia de Defesa do Santuário",
      category: "Eventos",
      date: "31 de Julho, 2026",
      readTime: "4 min de leitura",
      summary:
        "O novo evento sazonal de invasão começou! Confira os horários das ondas de ataque de ratos e como maximizar os pontos de recompensa com seus heróis de defesa.",
      isFeatured: true,
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    {
      id: "patch-notes-v2-4",
      title: "Notas do Patch v2.4: Balanceamento de Heróis e Novos Níveis de Antitoxina",
      category: "Atualizações",
      date: "28 de Julho, 2026",
      readTime: "3 min de leitura",
      summary:
        "A desenvolvedora lançou ajustes de equilíbrio para os Médicos da Praga e expandiu o limite máximo de atributos no laboratório.",
      tagColor: "bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30",
    },
    {
      id: "guia-herois-iniciantes",
      title: "Melhores Composições de Heróis para Iniciantes no Last Asylum: Plague",
      category: "Guias",
      date: "25 de Julho, 2026",
      readTime: "6 min de leitura",
      summary:
        "Aprenda a montar um time eficiente sem gastar recursos desnecessários e otimize sua progressão nos primeiros 30 dias de jogo.",
      tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "manutencao-servidores",
      title: "Manutenção Programada dos Servidores Globais e Correções de Bugs",
      category: "Manutenção",
      date: "20 de Julho, 2026",
      readTime: "2 min de leitura",
      summary:
        "Servidores passarão por otimização de infraestrutura. Jogadores receberão caixas de suprimento de compensação após a conclusão.",
      tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
  ];

  const categories = ["Todos", "Eventos", "Atualizações", "Guias", "Manutenção"];

  const filteredNews =
    selectedCategory === "Todos"
      ? newsList
      : newsList.filter((item) => item.category === selectedCategory);

  const featuredNews = newsList.find((item) => item.isFeatured);

  return (
    <section id="noticias" className="relative py-16 sm:py-24 bg-[#080c14]">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00ff88]/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-[#00ff88]/30 text-xs font-semibold text-[#00ff88] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              <span>Central da Comunidade BR</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Notícias & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00e5ff] toxic-text-glow">Atualizações</span>
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl">
              Fique por dentro das últimas novidades, patches do jogo, anúncios oficiais da desenvolvedora e guias da comunidade brasileira.
            </p>
          </div>

          {/* FILTROS DE CATEGORIA */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-[#00ff88] text-slate-950 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* NOTÍCIA EM DESTAQUE (HERO NEWS CARD) */}
        {featuredNews && selectedCategory === "Todos" && (
          <div className="mb-12 group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#101623] via-[#101623]/80 to-slate-950 border border-[#00ff88]/30 shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:border-[#00ff88]/60 transition-all duration-300">
            <div className="p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-center">
              
              {/* ÁREA VISUAL DO DESTAQUE */}
              <div className="w-full md:w-1/2 aspect-[16/9] rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff88]/10 via-transparent to-amber-500/10"></div>
                
                <div className="relative z-10">
                  <span className="text-4xl sm:text-6xl mb-3 block">☣️</span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#00ff88] font-bold">
                    Destaque da Semana
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    Last Asylum: Plague Update
                  </h4>
                </div>
              </div>

              {/* DETALHES DO DESTAQUE */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${featuredNews.tagColor}`}>
                    {featuredNews.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{featuredNews.date}</span>
                  <span className="text-xs font-mono text-slate-500">• {featuredNews.readTime}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#00ff88] transition-colors leading-tight">
                  {featuredNews.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {featuredNews.summary}
                </p>

                <div className="pt-2">
                  <Link
                    href={`#`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00ff88] text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:bg-[#15ff96] transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Ler Matéria Completa</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GRID DE NOTÍCIAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#101623]/80 border border-slate-800/90 hover:border-[#00ff88]/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${news.tagColor}`}>
                    {news.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{news.date}</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#00ff88] transition-colors leading-snug">
                  {news.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{news.readTime}</span>
                <span className="text-xs font-bold text-[#00ff88] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Leia mais</span>
                  <span>→</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

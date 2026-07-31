"use client";

import { useState } from "react";
import Image from "next/image";
import {
  calcularAntitoxinTotal,
  calcularShardsTotal,
  calcularSkillBadgesTotal,
} from "@/lib/calculators";

// COMPONENTE DE ILUSTRAÇÃO VISUAL DAS 5 ESTRELAS (DIVISÃO POR PERNAS DE 0.2 A 1.0)
function StarDisplay({ val }: { val: number }) {
  const isRed = val > 5.0;
  const effectiveVal = isRed ? Number((val - 5.0).toFixed(1)) : val;

  const fullStars = Math.floor(effectiveVal);
  const fraction = Number((effectiveVal - fullStars).toFixed(1));

  // AS 5 PERNAS DA ESTRELA NA ORDEM EXATA SOLICITADA:
  // 0.2: Perna superior esquerda
  // 0.4: Perna inferior esquerda
  // 0.6: Perna inferior direita
  // 0.8: Perna superior direita
  // 1.0: Perna central superior
  const legs = [
    { req: 0.2, d: "M 12,12.5 L 8.01,13.80 L 2.49,9.41 L 9.53,9.10 Z", name: "Superior Esquerda" },
    { req: 0.4, d: "M 12,12.5 L 12,16.70 L 6.12,20.59 L 8.01,13.80 Z", name: "Inferior Esquerda" },
    { req: 0.6, d: "M 12,12.5 L 15.99,13.80 L 17.88,20.59 L 12,16.70 Z", name: "Inferior Direita" },
    { req: 0.8, d: "M 12,12.5 L 14.47,9.10 L 21.51,9.41 L 15.99,13.80 Z", name: "Superior Direita" },
    { req: 1.0, d: "M 12,12.5 L 9.53,9.10 L 12,2.5 L 14.47,9.10 Z", name: "Central Superior" },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-2">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFull = starIndex <= fullStars;
        const isCurrentFractional = starIndex === fullStars + 1;

        return (
          <div key={starIndex} className="relative flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-9 sm:h-9 transition-all duration-300"
              viewBox="0 0 24 24"
            >
              {legs.map((leg, legIdx) => {
                let isActive = false;
                if (isFull) {
                  isActive = true;
                } else if (isCurrentFractional) {
                  isActive = fraction >= leg.req;
                }

                const activeFill = isRed ? "#ef4444" : "#fbbf24";
                const activeStroke = isRed ? "#b91c1c" : "#d97706";
                const inactiveFill = isRed ? "rgba(127, 29, 29, 0.25)" : "rgba(120, 53, 15, 0.25)";
                const inactiveStroke = isRed ? "rgba(239, 68, 68, 0.35)" : "rgba(245, 158, 11, 0.35)";

                return (
                  <path
                    key={legIdx}
                    d={leg.d}
                    fill={isActive ? activeFill : inactiveFill}
                    stroke={isActive ? activeStroke : inactiveStroke}
                    strokeWidth="0.75"
                    strokeLinejoin="round"
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 0 4px ${isRed ? "rgba(239,68,68,0.85)" : "rgba(251,191,36,0.85)"})`
                        : "none",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                );
              })}
            </svg>
          </div>
        );
      })}
    </div>
  );
}

export default function Calculators() {
  // 1. ESTADO ANTITOXINA
  const [nivelAtual, setNivelAtual] = useState(1);
  const [nivelDesejado, setNivelDesejado] = useState(50);

  // 2. ESTADO ESTRELAS (STEP DE 0.2)
  const [estrelaAtual, setEstrelaAtual] = useState(0.0);
  const [estrelaDesejada, setEstrelaDesejada] = useState(5.0);

  // 3. ESTADO HABILIDADES (BADGES)
  const [skillAtual, setSkillAtual] = useState(1);
  const [skillDesejada, setSkillDesejada] = useState(10);

  const resAntitoxina = calcularAntitoxinTotal(nivelAtual, nivelDesejado);
  const resShards = calcularShardsTotal(estrelaAtual, estrelaDesejada);
  const resSkill = calcularSkillBadgesTotal(skillAtual, skillDesejada);

  // FUNÇÕES AUXILIARES DE PASSO 0.2 PARA ESTRELAS
  const incEstrela = (val: number, max: number) => Number(Math.min(max, val + 0.2).toFixed(1));
  const decEstrela = (val: number, min: number) => Number(Math.max(min, val - 0.2).toFixed(1));

  return (
    <section className="relative py-12 sm:py-20 bg-transparent">
      {/* GLOW DECORATIVO DE FUNDO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00ff88]/5 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TÍTULO DA PÁGINA DE CALCULADORAS */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-[#00ff88]/30 text-xs font-semibold text-[#00ff88] mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m-6 4h4m-6-10h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
            </svg>
            <span>Central de Otimização e Recursos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Calculadoras de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00e5ff] toxic-text-glow">Upgrades</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            Calcule os custos exatos de Nível, Estrelas e Habilidades para planejar seus heróis.
          </p>
        </div>

        {/* GRID DE CARDS PARA CADA PROCESSO DE CÁLCULO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* ======================================================== */}
          {/* CARD 1: CALCULADORA DE ANTITOXINAS (LEVEL UPGRADES)      */}
          {/* ======================================================== */}
          <div className="rounded-3xl bg-[#101623]/90 border border-[#00ff88]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden flex flex-col justify-between">
            
            {/* 1. TOPO DO CARD: IMAGEM REPRESENTATIVA */}
            <div className="relative w-full h-44 bg-gradient-to-b from-slate-900 to-[#101623] p-5 flex items-center justify-center border-b border-slate-800">
              <div className="absolute inset-0 bg-[#00ff88]/5 pointer-events-none"></div>

              <div className="relative z-10 flex items-center gap-3">
                <div className="relative w-24 h-24 drop-shadow-[0_0_20px_rgba(0,255,136,0.4)]">
                  <Image
                    src="/images/antitoxin_image.png"
                    alt="Frasco de Antitoxina"
                    fill
                    sizes="96px"
                    className="object-contain"
                    style={{ transform: "rotate(-35deg)" }}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#00ff88] font-bold">
                    Heróis
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    Antitoxinas (Nível)
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Níveis 1 ao 148
                  </span>
                </div>
              </div>
            </div>

            {/* 2. ÁREA DE CONFIGURAÇÃO DE NÍVEL */}
            <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* NÍVEL INICIAL */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Nível Inicial
                    </span>
                    <span className="text-xs font-mono text-[#00ff88]">Nível {nivelAtual}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNivelAtual(Math.max(1, nivelAtual - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-[#00ff88] text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={147}
                      value={nivelAtual}
                      onChange={(e) => setNivelAtual(Number(e.target.value))}
                      className="w-full h-10 text-center text-xl font-extrabold text-white bg-slate-950 rounded-xl border border-slate-700 focus:outline-none focus:border-[#00ff88]"
                    />

                    <button
                      onClick={() => setNivelAtual(Math.min(nivelDesejado - 1, nivelAtual + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-[#00ff88] text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* NÍVEL DESEJADO */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Nível Desejado
                    </span>
                    <span className="text-xs font-mono text-[#00ff88]">Nível {nivelDesejado}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNivelDesejado(Math.max(nivelAtual + 1, nivelDesejado - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-[#00ff88] text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min={2}
                      max={148}
                      value={nivelDesejado}
                      onChange={(e) => setNivelDesejado(Number(e.target.value))}
                      className="w-full h-10 text-center text-xl font-extrabold text-white bg-slate-950 rounded-xl border border-slate-700 focus:outline-none focus:border-[#00ff88]"
                    />

                    <button
                      onClick={() => setNivelDesejado(Math.min(148, nivelDesejado + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-[#00ff88] text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. CAMPO DE RESULTADO */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-[#00ff88]/40 text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
                <span className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                  Total de Antitoxinas
                </span>

                {resAntitoxina.erro ? (
                  <span className="text-red-400 text-xs font-semibold">{resAntitoxina.erro}</span>
                ) : (
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="relative w-9 h-9 flex-shrink-0">
                      <Image
                        src="/images/antitoxin_image.png"
                        alt="Icone Antitoxina"
                        fill
                        sizes="36px"
                        className="object-contain"
                        style={{ transform: "rotate(-35deg)" }}
                      />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-[#00ff88] toxic-text-glow tracking-tight">
                      {resAntitoxina.totalFormatado}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* ======================================================== */}
          {/* CARD 2: CALCULADORA DE ESTRELAS (FRAÇÕES DE 0.2 A 10.0)  */}
          {/* ======================================================== */}
          <div className="rounded-3xl bg-[#101623]/90 border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden flex flex-col justify-between">
            
            {/* 1. TOPO DO CARD: IMAGEM REPRESENTATIVA */}
            <div className="relative w-full h-44 bg-gradient-to-b from-slate-900 to-[#101623] p-5 flex items-center justify-center border-b border-slate-800">
              <div className="absolute inset-0 bg-amber-500/5 pointer-events-none"></div>

              <div className="relative z-10 flex items-center gap-3">
                <div className="relative w-24 h-24 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <Image
                    src="/images/recruit_shard.png"
                    alt="Fragmento de Herói"
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    Estrelas
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    Fragmentos de Herói
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Passos de 0.2 (0.0 a 10.0)
                  </span>
                </div>
              </div>
            </div>

            {/* 2. ÁREA DE CONFIGURAÇÃO DE ESTRELAS */}
            <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ESTRELAS ATUAIS */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Estrelas Atuais
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {estrelaAtual.toFixed(1)} ⭐
                    </span>
                  </div>

                  {/* ILUSTRAÇÃO DAS ESTRELAS ATUAIS */}
                  <StarDisplay val={estrelaAtual} />

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setEstrelaAtual(decEstrela(estrelaAtual, 0.0))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      step={0.2}
                      min={0.0}
                      max={9.8}
                      value={estrelaAtual.toFixed(1)}
                      onChange={(e) => setEstrelaAtual(Number(e.target.value))}
                      className="w-full h-10 text-center text-xl font-extrabold text-white bg-slate-950 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                    />

                    <button
                      onClick={() => setEstrelaAtual(incEstrela(estrelaAtual, estrelaDesejada - 0.2))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ESTRELAS DESEJADAS */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Estrelas Desejadas
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {estrelaDesejada.toFixed(1)} ⭐
                    </span>
                  </div>

                  {/* ILUSTRAÇÃO DAS ESTRELAS DESEJADAS */}
                  <StarDisplay val={estrelaDesejada} />

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setEstrelaDesejada(decEstrela(estrelaDesejada, estrelaAtual + 0.2))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      step={0.2}
                      min={0.2}
                      max={10.0}
                      value={estrelaDesejada.toFixed(1)}
                      onChange={(e) => setEstrelaDesejada(Number(e.target.value))}
                      className="w-full h-10 text-center text-xl font-extrabold text-white bg-slate-950 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                    />

                    <button
                      onClick={() => setEstrelaDesejada(incEstrela(estrelaDesejada, 10.0))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. CAMPO DE RESULTADO */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
                <span className="block text-xs font-mono text-amber-400 uppercase tracking-widest mb-1.5">
                  Total de Fragmentos Necessários
                </span>

                {resShards.erro ? (
                  <span className="text-red-400 text-xs font-semibold">{resShards.erro}</span>
                ) : (
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="relative w-9 h-9 flex-shrink-0">
                      <Image
                        src="/images/recruit_shard.png"
                        alt="Icone Fragmento"
                        fill
                        sizes="36px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                      {resShards.totalFormatado}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* ======================================================== */}
          {/* CARD 3: CALCULADORA DE HABILIDADES (SKILL BADGES)        */}
          {/* ======================================================== */}
          <div className="rounded-3xl bg-[#101623]/90 border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden flex flex-col justify-between">
            
            {/* 1. TOPO DO CARD: IMAGEM REPRESENTATIVA */}
            <div className="relative w-full h-44 bg-gradient-to-b from-slate-900 to-[#101623] p-5 flex items-center justify-center border-b border-slate-800">
              <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>

              <div className="relative z-10 flex items-center gap-3">
                <div className="relative w-24 h-24 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <Image
                    src="/images/sign_medal.png"
                    alt="Medalha de Habilidade"
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    Habilidades
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    Skill Badges
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Níveis 1 ao 22
                  </span>
                </div>
              </div>
            </div>

            {/* 2. ÁREA DE CONFIGURAÇÃO DE HABILIDADES */}
            <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* NÍVEL ATUAL DE HABILIDADE */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Nível Inicial
                    </span>
                    <span className="text-xs font-mono text-cyan-400">Nível {skillAtual}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSkillAtual(Math.max(1, skillAtual - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-400 text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={21}
                      value={skillAtual}
                      onChange={(e) => setSkillAtual(Number(e.target.value))}
                      className="w-full h-10 text-center text-xl font-extrabold text-white bg-slate-950 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                    />

                    <button
                      onClick={() => setSkillAtual(Math.min(skillDesejada - 1, skillAtual + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-400 text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* NÍVEL DESEJADO DE HABILIDADE */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Nível Desejado
                    </span>
                    <span className="text-xs font-mono text-cyan-400">Nível {skillDesejada}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSkillDesejada(Math.max(skillAtual + 1, skillDesejada - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-400 text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min={2}
                      max={22}
                      value={skillDesejada}
                      onChange={(e) => setSkillDesejada(Number(e.target.value))}
                      className="w-full h-10 text-center text-xl font-extrabold text-white bg-slate-950 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                    />

                    <button
                      onClick={() => setSkillDesejada(Math.min(22, skillDesejada + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-400 text-xl font-bold flex items-center justify-center border border-slate-700 select-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. CAMPO DE RESULTADO HABILIDADES */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-500/40 text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
                <span className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
                  Total de Skill Badges
                </span>

                {resSkill.erro ? (
                  <span className="text-red-400 text-xs font-semibold">{resSkill.erro}</span>
                ) : (
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="relative w-9 h-9 flex-shrink-0">
                      <Image
                        src="/images/sign_medal.png"
                        alt="Icone Medalha Habilidade"
                        fill
                        sizes="36px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      {resSkill.totalFormatado}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

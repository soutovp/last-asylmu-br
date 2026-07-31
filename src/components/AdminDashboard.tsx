"use client";

import { useState } from "react";
import { UserSession, logoutAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

interface AdminDashboardProps {
  session: UserSession;
  onLogout: () => void;
}

export default function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"noticias" | "eventos" | "herois" | "config">("noticias");

  const handleLogout = async () => {
    await logoutAdmin();
    onLogout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* CABEÇALHO DO DASHBOARD COM SESSÃO E LOGOUT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#101623]/95 border border-[#00ff88]/30 shadow-2xl backdrop-blur-2xl mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-2xl">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Painel Administrativo</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30">
                SESSÃO ATIVA
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Conectado como: <span className="text-white font-semibold">{session.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-[11px] font-mono text-slate-400">Status do Banco</span>
            <span className={`text-xs font-mono font-bold ${isSupabaseConfigured ? "text-[#00ff88]" : "text-amber-400"}`}>
              {isSupabaseConfigured ? "● Supabase Conectado" : "● Modo Fallback"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      {/* CARDS DE RESUMO DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-2xl bg-[#101623]/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Notícias Publicadas</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-white">4</span>
            <span className="text-xs font-mono text-[#00ff88]">Ativo</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101623]/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Eventos Programados</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-white">2</span>
            <span className="text-xs font-mono text-amber-400">Em Breve</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101623]/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Heróis no Banco</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-white">18</span>
            <span className="text-xs font-mono text-cyan-400">Atualizado</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101623]/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Provedor Auth</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-lg font-bold text-white">{isSupabaseConfigured ? "Supabase Auth" : "Local Security"}</span>
          </div>
        </div>
      </div>

      {/* ABAS DE NAVEGAÇÃO INTERNA DO ADMIN */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
        {[
          { id: "noticias", label: "📰 Gerenciar Notícias" },
          { id: "eventos", label: "📅 Gerenciar Eventos" },
          { id: "herois", label: "🛡️ Gerenciar Heróis" },
          { id: "config", label: "⚙️ Configuração Supabase" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#00ff88] text-slate-950 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO DAS ABAS */}
      <div className="p-8 rounded-3xl bg-[#101623]/90 border border-slate-800 backdrop-blur-xl">
        {activeTab === "noticias" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Notícias & Atualizações</h3>
              <button className="px-4 py-2 rounded-xl bg-[#00ff88] text-slate-950 font-bold text-xs">
                + Nova Notícia
              </button>
            </div>
            <p className="text-sm text-slate-400">
              Aqui você poderá adicionar, editar ou remover posts da Central de Notícias da página inicial.
            </p>
          </div>
        )}

        {activeTab === "eventos" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Gerenciamento de Eventos</h3>
            <p className="text-sm text-slate-400">
              Configure contagens regressivas, regras de invasão e recompensas para a página de eventos.
            </p>
          </div>
        )}

        {activeTab === "herois" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Banco de Dados de Heróis</h3>
            <p className="text-sm text-slate-400">
              Cadastre novos heróis, edite atributos de combate e vincule fotos dos personagens.
            </p>
          </div>
        )}

        {activeTab === "config" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Status da Conexão com o Supabase</h3>
            
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400">Variáveis de Ambiente Atuais:</span>
              <div className="text-xs font-mono text-slate-300">
                NEXT_PUBLIC_SUPABASE_URL: <span className="text-[#00ff88]">{process.env.NEXT_PUBLIC_SUPABASE_URL || "Não configurado"}</span>
              </div>
              <div className="text-xs font-mono text-slate-300">
                NEXT_PUBLIC_SUPABASE_ANON_KEY: <span className="text-[#00ff88]">{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "••••••••••••••••" : "Não configurado"}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
              <strong>Como conectar ao seu projeto Supabase:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Crie um arquivo chamado <code className="bg-slate-950 px-1.5 py-0.5 rounded text-white font-mono">.env.local</code> na raiz do projeto.</li>
                <li>Adicione suas chaves do Supabase obtidas em <em>Project Settings ➔ API</em>:
                  <pre className="mt-2 p-3 bg-slate-950 rounded text-slate-200 font-mono text-[11px] overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui`}
                  </pre>
                </li>
                <li>Crie usuários administradores diretamente em <em>Supabase ➔ Authentication ➔ Users</em>.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

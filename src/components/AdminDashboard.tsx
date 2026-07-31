"use client";

import { useState } from "react";
import { UserSession } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";
import AdminUserManagement from "./AdminUserManagement";
import { canUserAccessPage, getAccessiblePagesForUser } from "@/lib/permissions";

interface AdminDashboardProps {
  session: UserSession;
  onLogout: () => void;
  onSessionUpdate: (updated: UserSession) => void;
}

export default function AdminDashboard({
  session,
  onLogout,
  onSessionUpdate,
}: AdminDashboardProps) {
  const accessiblePages = getAccessiblePagesForUser(session.role);
  const defaultPageId = accessiblePages.length > 0 ? accessiblePages[0].id : "herois";

  const [activePageId, setActivePageId] = useState<string>(defaultPageId);

  // Garante que se o papel for alterado para um que não tenha acesso à página atual, ajusta para a 1ª liberada
  const hasAccess = canUserAccessPage(session.role, activePageId);
  const currentPageId = hasAccess ? activePageId : defaultPageId;

  return (
    <div className="min-h-screen flex bg-[#080c14] text-slate-100 selection:bg-[#00ff88] selection:text-slate-950">
      
      {/* SIDEBAR ADMINISTRATIVA PROFISSIONAL */}
      <AdminSidebar
        session={session}
        activePageId={currentPageId}
        onSelectPage={(id) => setActiveTabAndPage(id)}
        onLogout={onLogout}
        onSessionUpdate={(updated) => {
          onSessionUpdate(updated);
          const newPages = getAccessiblePagesForUser(updated.role);
          if (newPages.length > 0 && !newPages.some((p) => p.id === currentPageId)) {
            setActivePageId(newPages[0].id);
          }
        }}
      />

      {/* ÁREA DE CONTEÚDO PRINCIPAL DO DASHBOARD */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          
          {/* RENDERIZAÇÃO CONFORME A PÁGINA SELECIONADA */}
          {currentPageId === "herois" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#101623]/90 border border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Catálogo & Atributos de Heróis</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Cadastre novos heróis, edite atributos de combate e vincule fotos dos personagens.
                  </p>
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-[#00ff88] text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:bg-[#15ff96]">
                  + Novo Herói
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-[#101623]/80 border border-slate-800 backdrop-blur-xl text-center space-y-3">
                <span className="text-4xl block">🛡️</span>
                <h3 className="text-lg font-bold text-white">Módulo de Gestão de Heróis</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Utilize o formulário de cadastro para publicar novos heróis com imagem e estatísticas.
                </p>
              </div>
            </div>
          )}

          {currentPageId === "noticias" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#101623]/90 border border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Central de Notícias & Matérias</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Gerencie os artigos, comunicados da praga e notas de patch da página inicial.
                  </p>
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-[#00ff88] text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:bg-[#15ff96]">
                  + Nova Matéria
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-[#101623]/80 border border-slate-800 backdrop-blur-xl text-center space-y-3">
                <span className="text-4xl block">📰</span>
                <h3 className="text-lg font-bold text-white">Módulo de Redação de Notícias</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Crie comunicados com categorias (Eventos, Atualizações, Guias) e destaques.
                </p>
              </div>
            </div>
          )}

          {currentPageId === "eventos" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#101623]/90 border border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Histórico & Calendário de Eventos</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Configure os eventos da semana, pontuações de aliança e cronômetros regressivos.
                  </p>
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  + Programar Evento
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-[#101623]/80 border border-slate-800 backdrop-blur-xl text-center space-y-3">
                <span className="text-4xl block">📅</span>
                <h3 className="text-lg font-bold text-white">Módulo de Histórico de Eventos</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Agende as fases semanais de invasão para exibição na página de eventos.
                </p>
              </div>
            </div>
          )}

          {currentPageId === "tutoriais" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#101623]/90 border border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Tutoriais & Guias Estratégicos</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Crie guias passo a passo para iniciantes e estratégias avançadas de base.
                  </p>
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  + Criar Tutorial
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-[#101623]/80 border border-slate-800 backdrop-blur-xl text-center space-y-3">
                <span className="text-4xl block">📚</span>
                <h3 className="text-lg font-bold text-white">Módulo de Base de Tutoriais</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Escreva guias ilustrados com imagens e estratégias de evolução de tropas.
                </p>
              </div>
            </div>
          )}

          {currentPageId === "usuarios" && (
            <AdminUserManagement />
          )}

        </main>
      </div>
    </div>
  );

  function setActiveTabAndPage(id: string) {
    if (canUserAccessPage(session.role, id)) {
      setActivePageId(id);
    }
  }
}

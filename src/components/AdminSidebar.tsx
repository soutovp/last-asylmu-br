"use client";

import { useState } from "react";
import Link from "next/link";
import { UserSession, logoutAdmin, updateSessionRole } from "@/lib/auth";
import { getAccessiblePagesForUser, ROLES_REGISTRY, UserRole } from "@/lib/permissions";

interface AdminSidebarProps {
  session: UserSession;
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onLogout: () => void;
  onSessionUpdate: (updated: UserSession) => void;
}

export default function AdminSidebar({
  session,
  activePageId,
  onSelectPage,
  onLogout,
  onSessionUpdate,
}: AdminSidebarProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const accessiblePages = getAccessiblePagesForUser(session.role);
  const pagesToRender = accessiblePages.length > 0 ? accessiblePages : getAccessiblePagesForUser("ADM");
  const roleInfo = ROLES_REGISTRY[session.role] || ROLES_REGISTRY.ADM;

  const handleSwitchRole = (newRole: UserRole) => {
    const updated = updateSessionRole(newRole);
    if (updated) {
      onSessionUpdate(updated);
      // Se a página atual não for acessível no novo papel, ajusta para a primeira liberada
      const newPages = getAccessiblePagesForUser(newRole);
      if (!newPages.some((p) => p.id === activePageId) && newPages.length > 0) {
        onSelectPage(newPages[0].id);
      }
    }
    setShowRoleMenu(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    onLogout();
  };

  return (
    <>
      {/* BOTÃO MOBILE HAMBÚRGUER (EXIBIDO APENAS EM DISPOSITIVOS MÓVEIS) */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#101623]/95 border-b border-slate-800 p-4 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg text-white">LAST ASYLUM</span>
          <sup className="text-xs font-mono font-bold text-[#00ff88] align-super border border-[#00ff88]/40 px-1.5 py-0.5 rounded bg-[#101623]">
            BR
          </sup>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[#00ff88] text-sm font-bold"
        >
          {mobileMenuOpen ? "✕ Fechar" : "☰ Menu Admin"}
        </button>
      </div>

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#101623]/98 border-r border-slate-800/90 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* 1. TOPO DA SIDEBAR: BRANDING & TÍTULO */}
            <div className="p-6 border-b border-slate-800/80">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-black text-xl tracking-wider text-white group-hover:text-[#00ff88] transition-colors">
                  LAST ASYLUM
                </span>
                <sup className="text-xs font-mono font-bold text-[#00ff88] align-super border border-[#00ff88]/40 px-2 py-0.5 rounded bg-[#101623] toxic-text-glow">
                  BR
                </sup>
              </Link>
              <span className="mt-1.5 block text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                Painel Administrativo
              </span>
            </div>

            {/* 2. NAVEGAÇÃO DE PÁGINAS ADMINISTRATIVAS */}
            <div className="p-4 space-y-1.5">
              <span className="px-3 text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400 block mb-2">
                Módulos de Sistema
              </span>

              {pagesToRender.map((page) => {
                const isActive = activePageId === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      onSelectPage(page.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group text-left ${
                      isActive
                        ? "bg-[#00ff88] text-slate-950 shadow-[0_0_20px_rgba(0,255,136,0.35)] transform translate-x-1"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{page.icon}</span>
                      <span>{page.label}</span>
                    </div>

                    {page.allowedRoles.includes("ADM") && page.id === "usuarios" && (
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                        ADM
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. RODAPÉ DA SIDEBAR: INFORMAÇÕES DE USUÁRIO E CONFIGURAÇÕES */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 relative">
            
            {/* DROPDOWN MENU PARA ALTERNÂNCIA RÁPIDA DE PERFIL */}
            {showRoleMenu && (
              <div className="absolute bottom-full left-4 right-4 mb-2 p-2 rounded-2xl bg-[#101623] border border-[#00ff88]/30 shadow-2xl space-y-1 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <span className="block px-3 py-1 text-[10px] font-mono text-slate-400 font-bold uppercase">
                  Alternar Função (Simulador RBAC)
                </span>
                {(Object.keys(ROLES_REGISTRY) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleSwitchRole(r)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors ${
                      session.role === r
                        ? "bg-[#00ff88]/20 text-[#00ff88]"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{ROLES_REGISTRY[r].name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${ROLES_REGISTRY[r].badgeColor}`}>
                      {r}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* CARD DE INFORMAÇÕES DO USUÁRIO LOGADO */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center font-bold text-sm text-[#00ff88]">
                    {session.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-xs font-bold text-white truncate max-w-[130px]">
                      {session.email}
                    </span>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${roleInfo.badgeColor}`}>
                      {roleInfo.shortName}
                    </span>
                  </div>
                </div>
              </div>

              {/* AÇÕES DO RODAPÉ (CONFIGURAÇÃO DE PERFIL E LOGOUT) */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  title="Alterar Função de Acesso"
                >
                  <span>⚙️ Cargo</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold border border-red-500/30 flex items-center justify-center gap-1 transition-colors"
                  title="Encerrar Sessão"
                >
                  <span>Sair</span>
                  <span>↳</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

"use client";

import { useState } from "react";
import { UserRole, ROLES_REGISTRY, ADMIN_PAGES, canUserAccessPage } from "@/lib/permissions";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([
    { id: "1", name: "Fernando (Super Admin)", email: "admin@lastasylum.br", role: "ADM", createdAt: "2026-07-31" },
    { id: "2", name: "Carlos Supervisor", email: "carlos.super@lastasylum.br", role: "SUPER", createdAt: "2026-07-30" },
    { id: "3", name: "Mariana Redatora", email: "mariana.news@lastasylum.br", role: "R", createdAt: "2026-07-28" },
    { id: "4", name: "Lucas Editor", email: "lucas.heroes@lastasylum.br", role: "E", createdAt: "2026-07-25" },
  ]);

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="space-y-8">
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#101623]/90 border border-red-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 mb-2">
            <span>👑 Acesso Exclusivo ADM</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Gestão de Usuários & Níveis de Acesso</h2>
          <p className="text-xs text-slate-400 mt-1">
            Atribua cargos e gerencie a matriz de permissões do portal administrativo.
          </p>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
          + Convidar Novo Usuário
        </button>
      </div>

      {/* MATRIZ AUTOMÁTICA DE PERMISSÕES POR FUNÇÃO */}
      <div className="p-6 rounded-3xl bg-[#101623]/80 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-1">Matriz de Permissões Automatizada</h3>
        <p className="text-xs text-slate-400 mb-6">
          Qualquer nova página adicionada ao registro é herdada automaticamente por Administradores e Supervisores.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                <th className="py-3 px-4">Página / Módulo</th>
                {(Object.keys(ROLES_REGISTRY) as UserRole[]).map((r) => (
                  <th key={r} className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full border ${ROLES_REGISTRY[r].badgeColor}`}>
                      {ROLES_REGISTRY[r].shortName}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {ADMIN_PAGES.map((page) => (
                <tr key={page.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span>{page.icon}</span>
                    <span>{page.label}</span>
                  </td>
                  {(Object.keys(ROLES_REGISTRY) as UserRole[]).map((r) => {
                    const hasAccess = canUserAccessPage(r, page.id);
                    return (
                      <td key={r} className="py-3.5 px-4 text-center">
                        {hasAccess ? (
                          <span className="inline-flex items-center gap-1 text-[#00ff88] font-bold">
                            <span>✓</span>
                            <span className="text-[10px] text-slate-400 font-mono">Liberado</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 font-mono text-[10px]">Bloqueado</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LISTA DE USUÁRIOS E GERENCIAMENTO DE CARGOS */}
      <div className="p-6 rounded-3xl bg-[#101623]/80 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Usuários Cadastrados no Sistema</h3>

        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-slate-200">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{u.name}</h4>
                  <span className="text-xs font-mono text-slate-400">{u.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">Cargo:</span>
                <select
                  value={u.role}
                  onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-[#00ff88]"
                >
                  {(Object.keys(ROLES_REGISTRY) as UserRole[]).map((r) => (
                    <option key={r} value={r}>
                      {ROLES_REGISTRY[r].name} ({r})
                    </option>
                  ))}
                </select>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${ROLES_REGISTRY[u.role].badgeColor}`}>
                  {ROLES_REGISTRY[u.role].shortName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

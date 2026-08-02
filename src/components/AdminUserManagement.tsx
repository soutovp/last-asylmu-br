"use client";

import { useState } from "react";
import { UserRole, ROLES_REGISTRY, ADMIN_PAGES, getDynamicAdminPages, AdminPageDefinition } from "@/lib/permissions";

interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  birthDate: string;
  region: string;
  createdAt: string;
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: "1",
      firstName: "Fernando",
      lastName: "Silva",
      email: "admin@lastasylum.br",
      role: "ADM",
      birthDate: "1990-05-15",
      region: "Sudeste",
      createdAt: "2026-07-31"
    },
    {
      id: "2",
      firstName: "Carlos",
      lastName: "Oliveira",
      email: "carlos.super@lastasylum.br",
      role: "SUPER",
      birthDate: "1988-10-22",
      region: "Sul",
      createdAt: "2026-07-30"
    },
    {
      id: "3",
      firstName: "Mariana",
      lastName: "Santos",
      email: "mariana.news@lastasylum.br",
      role: "R",
      birthDate: "1995-02-12",
      region: "Nordeste",
      createdAt: "2026-07-28"
    },
    {
      id: "4",
      firstName: "Lucas",
      lastName: "Mendes",
      email: "lucas.heroes@lastasylum.br",
      role: "E",
      birthDate: "1993-08-05",
      region: "Centro-Oeste",
      createdAt: "2026-07-25"
    },
  ]);

  const [pageMatrix, setPageMatrix] = useState<AdminPageDefinition[]>(() => {
    return getDynamicAdminPages();
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("R");

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Deseja realmente deletar este usuário?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !newFirstName || !newLastName || !newBirthDate || !newRegion) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const newUser: UserRecord = {
      id: String(users.length + 1),
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      role: newRole,
      birthDate: newBirthDate,
      region: newRegion,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setUsers([...users, newUser]);

    // Reset inputs
    setNewEmail("");
    setNewPassword("");
    setNewFirstName("");
    setNewLastName("");
    setNewBirthDate("");
    setNewRegion("");
    setNewRole("R");
    setShowCreateForm(false);
  };

  // Alterna o acesso de um cargo a um módulo específico na matriz dinâmica
  const handleToggleMatrix = (pageId: string, role: UserRole) => {
    if (role === "ADM") return;
    const updated = pageMatrix.map((page) => {
      if (page.id === pageId) {
        const alreadyAllowed = page.allowedRoles.includes(role);
        const nextAllowed = alreadyAllowed
          ? page.allowedRoles.filter((r) => r !== role)
          : [...page.allowedRoles, role];
        return { ...page, allowedRoles: nextAllowed };
      }
      return page;
    });
    setPageMatrix(updated);
    localStorage.setItem("admin_page_permissions_matrix", JSON.stringify(updated));
    // Envia sinal em tempo real para os componentes que dependem de permissões
    window.dispatchEvent(new Event("permissions_updated"));
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
            Cadastre novos usuários, atribua cargos e gerencie a matriz de permissões do portal.
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
        >
          {showCreateForm ? "Fechar Cadastro" : "+ Criar Novo Usuário"}
        </button>
      </div>

      {/* FORMULÁRIO DE CADASTRO DE NOVO USUÁRIO */}
      {showCreateForm && (
        <div className="p-6 rounded-3xl bg-[#101623]/90 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Formulário de Cadastro</h3>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Nome
              </label>
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                placeholder="Ex: João"
                required
                className="w-full h-10 px-4 text-xs font-medium text-white bg-slate-900 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Sobrenome
              </label>
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                placeholder="Ex: Silva"
                required
                className="w-full h-10 px-4 text-xs font-medium text-white bg-slate-900 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Ex: joao.silva@lastasylum.br"
                required
                className="w-full h-10 px-4 text-xs font-medium text-white bg-slate-900 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-10 px-4 text-xs font-medium text-white bg-slate-900 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={newBirthDate}
                onChange={(e) => setNewBirthDate(e.target.value)}
                required
                className="w-full h-10 px-4 text-xs font-medium text-white bg-slate-900 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Região
              </label>
              <input
                type="text"
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                placeholder="Ex: Sudeste"
                required
                className="w-full h-10 px-4 text-xs font-medium text-white bg-slate-900 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Cargo / Nível de Acesso
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full h-10 px-4 text-xs font-bold text-white bg-slate-900 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88]"
              >
                {(Object.keys(ROLES_REGISTRY) as UserRole[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLES_REGISTRY[r].name} ({r})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#00ff88] text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:bg-[#15ff96] transition-all"
              >
                Salvar Cadastro
              </button>
            </div>
          </form>
        </div>
      )}

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
                  {u.firstName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {u.firstName} {u.lastName}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs font-mono text-slate-400">
                    <span>E-mail: {u.email}</span>
                    <span>Nascimento: {u.birthDate}</span>
                    <span>Região: {u.region}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-mono text-slate-400">Cargo:</span>
                <select
                  value={u.role}
                  onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-[#00ff88] mr-1"
                >
                  {(Object.keys(ROLES_REGISTRY) as UserRole[]).map((r) => (
                    <option key={r} value={r}>
                      {ROLES_REGISTRY[r].name} ({r})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleDeleteUser(u.id)}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 transition-colors"
                  title="Deletar Usuário"
                >
                  🗑️ Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO DE ALTERAÇÃO DE ACESSOS (MATRIZ DINÂMICA DE PERMISSÕES) */}
      <div className="p-6 rounded-3xl bg-[#101623]/80 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-1">Alterar Acessos por Cargo</h3>
        <p className="text-xs text-slate-400 mb-6">
          Selecione as caixas abaixo para conceder ou revogar o acesso de cada nível de privilégio aos respectivos módulos administrativos em tempo real.
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
              {pageMatrix.map((page) => (
                <tr key={page.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span>{page.icon}</span>
                    <span>{page.label}</span>
                  </td>
                  {(Object.keys(ROLES_REGISTRY) as UserRole[]).map((r) => {
                    const isAllowed = page.allowedRoles.includes(r);
                    return (
                      <td key={r} className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={r === "ADM" ? true : isAllowed}
                          disabled={r === "ADM"}
                          onChange={() => handleToggleMatrix(page.id, r)}
                          className="w-4 h-4 accent-[#00ff88] cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

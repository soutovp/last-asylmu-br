"use client";

import { useState, useEffect } from "react";
import { UserRole, ROLES_REGISTRY, ADMIN_PAGES, getDynamicAdminPages, AdminPageDefinition } from "@/lib/permissions";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        if (data) {
          setUsers(
            data.map((u: any) => ({
              id: u.email,
              firstName: u.first_name,
              lastName: u.last_name,
              email: u.email,
              role: u.role as UserRole,
              birthDate: u.birth_date || "",
              region: u.region || "",
              createdAt: new Date(u.created_at).toISOString().split("T")[0]
            }))
          );
        }
      } else {
        const stored = localStorage.getItem("local_profiles");
        if (stored) {
          setUsers(JSON.parse(stored));
        } else {
          // Inicializa com o seed e salva
          const seed = [
            {
              id: "admin@lastasylum.br",
              firstName: "Fernando",
              lastName: "Silva",
              email: "admin@lastasylum.br",
              role: "ADM" as UserRole,
              birthDate: "1990-05-15",
              region: "Sudeste",
              createdAt: "2026-07-31"
            }
          ];
          localStorage.setItem("local_profiles", JSON.stringify(seed));
          setUsers(seed);
        }
      }
    } catch (err: any) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from("profiles")
          .update({ role: newRole })
          .eq("email", userId);
        if (error) throw error;
      } else {
        const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
        localStorage.setItem("local_profiles", JSON.stringify(updated));
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      alert("Erro ao alterar cargo: " + err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Deseja realmente deletar este usuário?")) {
      try {
        if (isSupabaseConfigured) {
          const { error } = await supabase
            .from("profiles")
            .delete()
            .eq("email", userId);
          if (error) throw error;
        } else {
          const filtered = users.filter((u) => u.id !== userId);
          localStorage.setItem("local_profiles", JSON.stringify(filtered));
        }
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } catch (err: any) {
        alert("Erro ao deletar usuário: " + err.message);
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !newFirstName || !newLastName || !newBirthDate || !newRegion) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const avatarUrl = `https://lastasylumplague.com/wp-content/uploads/2026/04/nicole-full-image-300x266.webp`; // padrão

      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from("profiles")
          .insert([{
            email: newEmail.trim().toLowerCase(),
            first_name: newFirstName,
            last_name: newLastName,
            role: newRole,
            birth_date: newBirthDate,
            region: newRegion,
            avatar_url: avatarUrl
          }]);
        if (error) throw error;
      } else {
        const newUser: UserRecord = {
          id: newEmail.trim().toLowerCase(),
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail.trim().toLowerCase(),
          role: newRole,
          birthDate: newBirthDate,
          region: newRegion,
          createdAt: new Date().toISOString().split("T")[0]
        };
        const updated = [...users, newUser];
        localStorage.setItem("local_profiles", JSON.stringify(updated));
      }

      await fetchUsers();

      // Reset inputs
      setNewEmail("");
      setNewPassword("");
      setNewFirstName("");
      setNewLastName("");
      setNewBirthDate("");
      setNewRegion("");
      setNewRole("R");
      setShowCreateForm(false);
    } catch (err: any) {
      alert("Erro ao criar usuário: " + err.message);
    }
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

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">Nenhum usuário cadastrado.</p>
        ) : (
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
        )}
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

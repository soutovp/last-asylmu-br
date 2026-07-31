"use client";

import { useState, FormEvent } from "react";
import { loginAdmin, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASS, UserSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { UserRole, ROLES_REGISTRY } from "@/lib/permissions";

interface AdminLoginProps {
  onSuccess: (session: UserSession) => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("ADM");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await loginAdmin(email, password, selectedRole);
      if (res.success && res.session) {
        onSuccess(res.session);
      } else {
        setErrorMessage(res.error || "Falha na autenticação.");
      }
    } catch {
      setErrorMessage("Ocorreu um erro ao tentar realizar o login.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (role: UserRole) => {
    setEmail(DEMO_ADMIN_EMAIL);
    setPassword(DEMO_ADMIN_PASS);
    setSelectedRole(role);
    setErrorMessage("");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-[#101623]/95 border border-[#00ff88]/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
      
      {/* CABEÇALHO DO LOGIN */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-[#00ff88]/30 text-xs font-semibold text-[#00ff88] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
          <span>Acesso Restrito ao Painel</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <span>LAST ASYLUM</span>
          <sup className="text-sm font-mono font-bold text-[#00ff88] align-super border border-[#00ff88]/40 px-2 py-0.5 rounded bg-[#101623]">
            BR
          </sup>
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Autenticação administrativa segura para gestão do portal.
        </p>
      </div>

      {/* ALERTA DE ERRO */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FORMULÁRIO DE LOGIN */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            E-mail do Usuário
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@lastasylum.br"
            required
            className="w-full h-12 px-4 text-sm font-medium text-white bg-slate-900/90 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-12 pl-4 pr-12 text-sm font-medium text-white bg-slate-900/90 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors"
              title={showPassword ? "Ocultar senha" : "Exibir senha"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.68-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* SELEÇÃO DE PERFIL / CARGO PARA TESTES */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            Perfil / Função de Acesso
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ROLES_REGISTRY) as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                  selectedRole === r
                    ? "bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <span>{ROLES_REGISTRY[r].name}</span>
                <span className="font-mono text-[10px] uppercase">({r})</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#00ff88] text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:bg-[#15ff96] active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Acessar Painel</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>

      {/* NOTA INFORMATIVA DE TESTES */}
      {!isSupabaseConfigured && (
        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-[11px] text-slate-400">
            Modo de Testes RBAC Ativo (Selecione um perfil acima).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {(Object.keys(ROLES_REGISTRY) as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleFillDemo(r)}
                type="button"
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-[#00ff88] border border-slate-800"
              >
                Testar {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

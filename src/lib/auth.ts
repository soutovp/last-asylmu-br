import { supabase, isSupabaseConfigured } from "./supabase";
import { UserRole } from "./permissions";

export interface UserSession {
  email: string;
  role: UserRole;
  authenticatedAt: string;
}

const LOCAL_STORAGE_KEY = "last_asylum_admin_session";

// DEMO / FALLBACK ADMIN CREDENTIALS FOR DEVELOPMENT
export const DEMO_ADMIN_EMAIL = "admin@lastasylum.br";
export const DEMO_ADMIN_PASS = "admin123";

/**
 * Tenta realizar o login via Supabase ou via Fallback Local
 */
export async function loginAdmin(
  email: string,
  pass: string,
  selectedRole: UserRole = "ADM"
): Promise<{ success: boolean; error?: string; session?: UserSession }> {
  // SE O SUPABASE ESTIVER CONFIGURADO COM CHAVES REAIS, USA SUPABASE AUTH
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Mapeia role do metadata do Supabase ou usa a selecionada
        const userRole = (data.user.user_metadata?.role as UserRole) || selectedRole || "ADM";
        const session: UserSession = {
          email: data.user.email || email,
          role: userRole,
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
        return { success: true, session };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro na autenticação do Supabase.";
      return { success: false, error: message };
    }
  }

  // FALLBACK DE DESENVOLVIMENTO (QUANDO AINDA NÃO HÁ CHAVES NO .env.local)
  if (email.trim().toLowerCase() === DEMO_ADMIN_EMAIL && pass === DEMO_ADMIN_PASS) {
    const session: UserSession = {
      email: DEMO_ADMIN_EMAIL,
      role: selectedRole,
      authenticatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
    return { success: true, session };
  }

  return {
    success: false,
    error: "Credenciais inválidas. Verifique o e-mail e a senha informados.",
  };
}

/**
 * Atualiza o cargo da sessão atual para testes rápidos
 */
export function updateSessionRole(newRole: UserRole): UserSession | null {
  const current = getSavedSession();
  if (!current) return null;

  const updated: UserSession = {
    ...current,
    role: newRole,
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Obtém a sessão salva no localStorage
 */
export function getSavedSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return null;
    const session = JSON.parse(data) as UserSession;
    // Normalização de papéisLegados/indefinidos para "ADM"
    if (!session.role || session.role === ("administrator" as any)) {
      session.role = "ADM";
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Efetua o logout do administrador
 */
export async function logoutAdmin(): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

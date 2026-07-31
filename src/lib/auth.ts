import { supabase, isSupabaseConfigured } from "./supabase";

export interface UserSession {
  email: string;
  role: string;
  authenticatedAt: string;
}

const LOCAL_STORAGE_KEY = "last_asylum_admin_session";

// DEMO / FALLBACK ADMIN CREDENTIALS FOR DEVELOPMENT
export const DEMO_ADMIN_EMAIL = "admin@lastasylum.br";
export const DEMO_ADMIN_PASS = "admin123";

/**
 * Tenta realizar o login via Supabase ou via Fallback Local
 */
export async function loginAdmin(email: string, pass: string): Promise<{ success: boolean; error?: string; session?: UserSession }> {
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
        const session: UserSession = {
          email: data.user.email || email,
          role: "administrator",
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
      role: "administrator",
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
 * Obtém a sessão salva no localStorage
 */
export function getSavedSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as UserSession;
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

import { supabase, isSupabaseConfigured } from "./supabase";
import { UserRole } from "./permissions";

export interface UserSession {
  email: string;
  role: UserRole;
  authenticatedAt: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  birthDate?: string;
  region?: string;
}

const LOCAL_STORAGE_KEY = "last_asylum_admin_session";

// Lista de URLs fixas de imagens dos heróis para fallback
export const HERO_AVATARS = [
  "https://lastasylumplague.com/wp-content/uploads/2026/04/nicole-full-image-300x266.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/annie-full-image-226x300.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/marlena-full-image-300x281.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/jester-full-image-275x300.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/red-lady-full-image-284x300.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/billy-full-image-300x289.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/cynthia-full-image-247x300.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/zoya-full-image-281x300.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/bell-full-image-285x300.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/harper-full-image-296x300.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/brian-full-image-292x300.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/louis-full-image-290x300.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/shadow-full-image-300x245.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/daskal-last-asylum-plague.webp",
  "https://lastasylumplague.com/wp-content/uploads/2026/03/arthur-last-asylum-plague.webp",
];

/**
 * Retorna uma imagem determinística a partir do e-mail do usuário
 */
export function getDeterministicHeroAvatar(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % HERO_AVATARS.length;
  return HERO_AVATARS[index];
}

// DEMO / FALLBACK ADMIN CREDENTIALS FOR DEVELOPMENT
export const DEMO_ADMIN_EMAIL = "admin@lastasylum.br";
export const DEMO_ADMIN_PASS = "admin123";

/**
 * Tenta realizar o login via Supabase ou via Fallback Local
 */
export async function loginAdmin(
  email: string,
  pass: string
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
        // Mapeia role do metadata do Supabase ou usa o padrão
        const userRole = (data.user.user_metadata?.role as UserRole) || "ADM";
        const session: UserSession = {
          email: data.user.email || email,
          role: userRole,
          authenticatedAt: new Date().toISOString(),
          firstName: data.user.user_metadata?.first_name || "Fernando",
          lastName: data.user.user_metadata?.last_name || "Silva",
          avatarUrl: data.user.user_metadata?.avatar_url || getDeterministicHeroAvatar(data.user.email || email),
          birthDate: data.user.user_metadata?.birth_date || "1990-05-15",
          region: data.user.user_metadata?.region || "Sudeste",
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
      role: "ADM",
      authenticatedAt: new Date().toISOString(),
      firstName: "Fernando",
      lastName: "Silva",
      avatarUrl: getDeterministicHeroAvatar(DEMO_ADMIN_EMAIL),
      birthDate: "1990-05-15",
      region: "Sudeste",
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
 * Envia um e-mail de recuperação de senha (Supabase ou Fallback Demo)
 */
export async function resetAdminPassword(
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin?view=reset-password`,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro no envio do e-mail de recuperação.";
      return { success: false, error: message };
    }
  }

  // Fallback demo
  if (email.trim().toLowerCase() === DEMO_ADMIN_EMAIL) {
    return { success: true };
  }

  return {
    success: false,
    error: "E-mail não encontrado no sistema.",
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
 * Atualiza o e-mail da sessão atual para persistência local
 */
export function updateSessionEmail(newEmail: string): UserSession | null {
  const current = getSavedSession();
  if (!current) return null;

  const updated: UserSession = {
    ...current,
    email: newEmail,
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Atualiza as informações do perfil do usuário na sessão persistida
 */
export function updateSessionProfile(updates: Partial<UserSession>): UserSession | null {
  const current = getSavedSession();
  if (!current) return null;

  const updated: UserSession = {
    ...current,
    ...updates,
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

/**
 * Retorna o e-mail formatado de forma resumida (ex: fer***@hotmail.com)
 */
export function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 3) {
    return `${local}***@${domain}`;
  }
  return `${local.substring(0, 3)}***@${domain}`;
}

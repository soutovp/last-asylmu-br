/**
 * Sistema de Controle de Acesso Baseado em Papéis (RBAC - Role Based Access Control)
 * para o Painel Administrativo do Last Asylum BR.
 */

export type UserRole = "ADM" | "SUPER" | "R" | "E";

export interface RoleInfo {
  id: UserRole;
  name: string;
  shortName: string;
  description: string;
  badgeColor: string;
}

export const ROLES_REGISTRY: Record<UserRole, RoleInfo> = {
  ADM: {
    id: "ADM",
    name: "Administrador",
    shortName: "ADM",
    description: "Acesso total irrestrito a todas as páginas e funções do portal.",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  SUPER: {
    id: "SUPER",
    name: "Supervisor",
    shortName: "SUPER",
    description: "Acesso de supervisão a todas as páginas de Redatores e Editores.",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  R: {
    id: "R",
    name: "Redator",
    shortName: "REDATOR",
    description: "Acesso exclusivo à gestão de Notícias e Tutoriais.",
    badgeColor: "bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30",
  },
  E: {
    id: "E",
    name: "Editor",
    shortName: "EDITOR",
    description: "Acesso à gestão de Heróis e Tutoriais.",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
};

export interface AdminPageDefinition {
  id: string;
  label: string;
  icon: string;
  description: string;
  allowedRoles: UserRole[]; // Permissões explícitas atribuídas à página
}

/**
 * Registro Centralizado de Páginas Administrativas.
 * Para adicionar uma nova página no futuro, basta adicioná-la a esta lista!
 * ADM e SUPER herdarão o acesso automaticamente sem necessidade de duplicar regras.
 */
export const ADMIN_PAGES: AdminPageDefinition[] = [
  {
    id: "herois",
    label: "Heróis",
    icon: "🛡️",
    description: "Configuração do catálogo, atributos e especialidades dos heróis.",
    allowedRoles: ["E"],
  },
  {
    id: "noticias",
    label: "Notícias",
    icon: "📰",
    description: "Publicação e gestão de notícias e anúncios da comunidade.",
    allowedRoles: ["R"],
  },
  {
    id: "eventos",
    label: "Eventos",
    icon: "📅",
    description: "Histórico de eventos da semana, invasões e pontuações.",
    allowedRoles: ["R", "E"],
  },
  {
    id: "tutoriais",
    label: "Tutoriais",
    icon: "📚",
    description: "Elaboração e revisão de guias estratégicos para jogadores.",
    allowedRoles: ["R", "E"],
  },
  {
    id: "usuarios",
    label: "Gestão de Usuários",
    icon: "👑",
    description: "Controle de usuários e distribuição de cargos de acesso (Exclusivo ADM).",
    allowedRoles: ["ADM"],
  },
];

/**
 * Função de Validação Automática de Acesso por Página e Cargo:
 * 1. ADM possui acesso a absolutamente TODAS as páginas.
 * 2. SUPER possui acesso a todas as páginas permitidas para Redatores (R) e Editores (E), além de SUPER.
 * 3. R e E possuem acesso se seu cargo constar na lista allowedRoles da página.
 */
export function canUserAccessPage(userRole: UserRole, pageId: string): boolean {
  const page = ADMIN_PAGES.find((p) => p.id === pageId);
  if (!page) return false;

  // 1. ADM tem acesso total
  if (userRole === "ADM") return true;

  // 2. SUPER herda tudo que for liberado para R ou E
  if (userRole === "SUPER") {
    return page.allowedRoles.some((r) => r === "R" || r === "E" || r === "SUPER");
  }

  // 3. Permissão direta
  return page.allowedRoles.includes(userRole);
}

/**
 * Retorna a lista de páginas que o usuário logado tem permissão para visualizar no menu.
 */
export function getAccessiblePagesForUser(userRole: UserRole): AdminPageDefinition[] {
  return ADMIN_PAGES.filter((page) => canUserAccessPage(userRole, page.id));
}

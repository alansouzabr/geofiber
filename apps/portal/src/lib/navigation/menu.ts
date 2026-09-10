import type {
  Permission
} from "@/lib/rbac";

export type MenuItem = {
  label: string;
  href: string;
  perm: Permission;
  icon?: string;
};

export const menu:
  MenuItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      perm: "dashboard.view",
      icon: "📊",
    },

    {
      label: "Projetos",
      href: "/projetos",
      perm: "projects.view",
      icon: "📁",
    },

    {
      label: "Empresas",
      href: "/companies",
      perm: "companies.manage",
      icon: "🏢",
    },

    {
      label: "Planos (SaaS)",
      href: "/financeiro",
      perm: "plans.manage",
      icon: "💳",
    },

    {
      label: "Usuários",
      href: "/usuarios",
      perm: "users.manage",
      icon: "👥",
    },
  ];

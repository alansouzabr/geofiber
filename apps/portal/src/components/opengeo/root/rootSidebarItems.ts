export interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
}

export const rootSidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/root"
  },
  {
    label: "Empresas",
    href: "/dashboard/root/companies"
  },
  {
    label: "Usuários Globais",
    href: "/dashboard/root/users"
  },
  {
    label: "Produtos",
    href: "/dashboard/root/products"
  },
  {
    label: "Planos",
    href: "/dashboard/root/plans"
  },
  {
    label: "Licenciamento",
    href: "/dashboard/root/licensing"
  },
  {
    label: "Financeiro",
    href: "/dashboard/root/billing"
  },
  {
    label: "GED Global",
    href: "/dashboard/root/documents"
  },
  {
    label: "Auditoria",
    href: "/dashboard/root/audit"
  },
  {
    label: "Logs",
    href: "/dashboard/root/logs"
  },
  {
    label: "Integrações",
    href: "/dashboard/root/integrations"
  },
  {
    label: "Configurações",
    href: "/dashboard/root/settings"
  }
];

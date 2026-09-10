export interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
}

export const masterSidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/master"
  },
  {
    label: "Empresas",
    href: "/dashboard/master/companies"
  },
  {
    label: "Clientes",
    href: "/dashboard/master/customers"
  },
  {
    label: "Financeiro",
    href: "/dashboard/master/billing"
  },
  {
    label: "GED Global",
    href: "/dashboard/master/documents"
  },
  {
    label: "Auditoria",
    href: "/dashboard/master/audit"
  },
  {
    label: "Configurações",
    href: "/dashboard/master/settings"
  }
];

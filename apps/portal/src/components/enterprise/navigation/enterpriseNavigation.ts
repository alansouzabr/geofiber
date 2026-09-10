import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  GraduationCap,
  Shield,
  Users,
  CreditCard,
  Settings
} from "lucide-react";

export const enterpriseNavigation = [

  {
    label: "Dashboard",
    tab: "dashboard",
    icon: LayoutDashboard
  },{
    label: "Treinamentos",
    tab: "treinamentos",
    icon: GraduationCap
  },

{
    label: "Telecomunicação",
    tab: "arquivos",
    icon: FileText
  },

  {
    label: "Projetos",
    tab: "projetos",
    icon: FolderKanban
    },

    {
      label: "Execução",
      tab: "execucao",
      icon: Shield
    },

  {
    label: "Empresa",
    tab: "empresa",
    icon: Users
  },

  {
    label: "Financeiro",
    tab: "financeiro",
    icon: CreditCard
  },

  {
    label: "Configurações",
    tab: "configuracoes",
    icon: Settings
  }

];

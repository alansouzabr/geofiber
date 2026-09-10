import {
  LayoutDashboard,
  FolderOpen,
  FolderKanban,
  Map,
  Building2,
  CreditCard,
  Settings,
  FileText,
  ClipboardCheck,
  Image,
  FileArchive,
  Users,
  ShieldCheck,
  Unlock,
  GraduationCap
} from "lucide-react";

export interface SidebarItem {

  label: string;

  href?: string;

  icon: any;

  children?: SidebarItem[];

  /**
   * Permissão RBAC necessária para visualizar o item.
   * Quando ausente, o item é público dentro do menu autenticado.
   */
  perm?: string;

  /**
   * Item exclusivo da plataforma ROOT/MASTER.
   */
  platformOnly?: boolean;

}

export const sidebarItems: SidebarItem[] = [

  {
label: "Dashboard",
icon: LayoutDashboard,
platformOnly: true,

children: [

  {
    label: "KMZ / DWG / GED",
    href: "/dashboard/plataformas",
    icon: LayoutDashboard,
    platformOnly: true,
  },

  {
    label: "Liberação",
    href: "/dashboard/liberacao",
    icon: Unlock,
    platformOnly: true,
  }

]
},


  {
    label: "Treinamentos",
    icon: GraduationCap,
      perm: "training.view",

    children: [

      {
        label: "Normas Regulamentadoras",
        href: "/seg/treinamentos",
        icon: FileText
      },

      {
        label: "TI / Redes / Telecom",
        href: "/telecom/treinamentos",
        icon: FileText
      }

    ]

  },

  {
    label: "Telecomunicação",
    icon: FolderOpen,
      perm: "files.view",

    children: [

        {
          label: "Documentos",
          href: "/arquivos/documentos",
          icon: FileText,
      perm: "files.view"
        },

        {
          label: "Contabilidade",
          href: "/arquivos/contabilidade",
          icon: FileText,
      perm: "files.view"
        },

        {
          label: "Feninfra",
          href: "/arquivos/feninfra",
          icon: FileText,
      perm: "files.view"
        },

        {
          label: "Anatel / Enel",
          href: "/arquivos/anatel",
          icon: FileText,
      perm: "files.view"
        },

        {
          label: "CFT / TRT / ART",
          href: "/arquivos/cft",
          icon: ClipboardCheck,
      perm: "trt.view"
        },

        {
          label: "Certidões",
          href: "/arquivos/certidoes",
          icon: FileText,
      perm: "files.view"
        }

      ]

  },

  
{
    label: "Projetos",
    icon: FolderKanban,
      perm: "projects.view",

    children: [

  {
    label: "KMZ / DWG / GED",
    href: "/projetos/plataformas",
    icon: FolderKanban
  },


      {
        label: "KMZ / DWG",
        href: "/projetos/kmz",
        icon: FileArchive,
      perm: "kmz.view"
      },

      {
        label: "GED",
        href: "/arquivos/ged",
        icon: FolderOpen,
      perm: "files.view"
      },

      {
        label: "GEOMAPS",
        href: "/execucao/mapas",
        icon: Map,
      perm: "kmz.view"
      }

    ]

  }
,

  
{
    label: "Execução",
    icon: Map,
      perm: "projects.view",

    children: [

      {
        label: "KMZ / DWG / GED",
        href: "/execucao/plataformas",
        icon: Map
      },



      {
        label: "Checklist",
        href: "/dashboard/maps",
        icon: ClipboardCheck,
      perm: "kmz.view"
      },

      {
        label: "Ferramentas",
        href: "/dashboard/maps",
        icon: Map,
      perm: "kmz.view"
      }

    ]

  }
,

  {
    label: "Empresa",
    icon: Building2,
      perm: "company.view",

    children: [

      {
        label: "Dados da Empresa",
        href: "/empresa/dados",
        icon: Building2,
      perm: "company.view"
      },

      {
        label: "Cadastro de Usuários",
        href: "/usuarios",
        icon: Users,
      perm: "company.users"
      }

    ]

  },

  
{
    // ETAPA30A1_FINANCEIRO_CONFIG
    label: "Configurações",
    icon: Settings,

    children: [

      {
        label: "Financeiro",
        href: "/financeiro",
        icon: CreditCard,
        perm: "finance.view"
      },

      {
        label: "Permissões",
        href: "/configuracoes/permissoes",
        icon: ShieldCheck,
        platformOnly: true,
      },

      {
        label: "Auditoria",
        href: "/dashboard/audit",
        icon: ClipboardCheck,
        platformOnly: true,
      }

    ]
  }


];

import {
  LayoutDashboard,
  Building2,
  FileText,
  FolderKanban,
  FolderOpen,
  GraduationCap,
  Shield,
  Users,
  CreditCard,
  Settings,
  Network
} from "lucide-react";


export interface ClientNavigationChild {
  label: string;
  href?: string;
  tab?: string;
  icon: any;

  /*
   * Permissão específica opcional
   * do item visual.
   */
  permissionKey?: string;

  adminOnly?: boolean;
  platformOnly?: boolean;

  /*
   * ETAPA35A13B:
   * terceiro nível real.
   */
  children?: ClientNavigationChild[];
}


export interface ClientNavigationItem {
  key: string;
  permissionKey?: string;
  label: string;
  tab: string;
  icon: any;
  children: ClientNavigationChild[];
}


/*
 * ETAPA35A13B_CLIENT_NAVIGATION
 *
 * Segurança:
 * module.training
 *
 * Telecom:
 * treinamento -> module.training
 * documentos  -> module.files + files.view
 *
 * Nenhuma nova permission key.
 */
export const clientNavigation:
  ClientNavigationItem[] = [

  {
    key: "module.dashboard",
    label: "Dashboard",
    tab: "dashboard",
    icon: LayoutDashboard,

    children: [

      {
        label: "KMZ / DWG / GED",
        tab: "dashboard-plataformas",
        icon: Network
      },

      {
        label: "Liberação",
        href: "/dashboard/liberacao",
        icon: Shield,
        platformOnly: true
      }

    ]
  },


  {
    key: "group.safety",
    permissionKey: "module.training",
    label: "Segurança do Trabalho",
    tab: "seguranca",
    icon: Shield,

    children: [

      {
        label: "Treinamentos",
        icon: GraduationCap,
        permissionKey: "module.training",

        children: [

          {
            label: "Normas Regulamentadoras",
            href: "/seg/treinamentos",
            tab: "seguranca-normas",
            icon: FileText,
            permissionKey: "module.training"
          }

        ]
      },

      {
        label: "SST / PGR / PCMSO",
        tab: "seguranca-sst",
        icon: Shield,
        permissionKey: "module.training"
      }

    ]
  },


  /*
   * Grupo composto.
   *
   * Não recebe permissionKey no pai,
   * porque pode aparecer por:
   *
   * - module.training
   * OU
   * - module.files + files.view
   */
  {
    key: "group.telecom",
    label: "Telecomunicação",
    tab: "telecom",
    icon: FolderOpen,

    children: [

      {
        label: "Treinamentos",
        icon: GraduationCap,
        permissionKey: "module.training",

        children: [

          {
            label: "TI / Redes / Telecom",
            href: "/telecom/treinamentos",
            tab: "treinamentos-telecom",
            icon: Network,
            permissionKey: "module.training"
          }

        ]
      },

      {
        label: "KMZ / DWG / GED",
        tab: "telecom-kmz-dwg-ged",
        icon: Network,
        permissionKey: "module.files"
      },

      {
        label: "Documentos",
        tab: "arquivos-documentos",
        icon: FileText,
        permissionKey: "module.files"
      },

      {
        label: "Contabilidade",
        tab: "arquivos-contabilidade",
        icon: FileText,
        permissionKey: "module.files"
      },

      {
        label: "CREA / CFT",
        tab: "telecom-crea-cft",
        icon: FileText,
        permissionKey: "module.files"
      },

      {
        label: "Certidões",
        tab: "arquivos-certidoes",
        icon: FileText,
        permissionKey: "module.files"
      },

      {
        label: "Feninfra",
        tab: "arquivos-feninfra",
        icon: FileText,
        permissionKey: "module.files"
      },

      {
        label: "Anatel / Enel",
        tab: "arquivos-anatel",
        icon: FileText,
        permissionKey: "module.files"
      }

    ]
  },


  {
    key: "module.projects",
    label: "Projetos",
    tab: "projetos",
    icon: FolderKanban,

    children: [

      {
        label: "KMZ / DWG / GED",
        tab: "projetos-kmz-dwg-ged",
        icon: FolderKanban
      }

    ]
  },


  {
    key: "module.execution",
    label: "Execução",
    tab: "execucao",
    icon: Shield,

    children: [

      {
        label: "KMZ / DWG / GED",
        tab: "execucao-kmz-dwg-ged",
        icon: FolderOpen
      },

      {
        label: "Mapas",
        tab: "execucao-mapas",
        icon: Network
      },

      {
        label: "Checklist",
        tab: "execucao-checklist",
        icon: FileText
      },

      {
        label: "Técnico Padrão",
        tab: "execucao-tecnico",
        icon: Users
      },

      {
        label: "Ferramentas",
        tab: "execucao-ferramentas",
        icon: Settings
      },

      {
        label: "Carro",
        tab: "execucao-carro",
        icon: Settings
      }

    ]
  },


  {
    key: "module.company",
    label: "Empresa",
    tab: "empresa",
    icon: Users,

    children: [

      /*
       * Empresa ADMIN:
       * representa a própria organização,
       * não o cadastro global MASTER.
       */
      {
        label: "Dados da Empresa",
        tab: "empresa",
        icon: Building2
      },

      {
        label: "Usuários",
        tab: "empresa-usuarios",
        icon: Users
      },

      {
        label: "Alvará / AVCB",
        tab: "empresa-alvara-avcb",
        icon: FileText,
        permissionKey: "module.files"
      },]
  },


  {
    key: "module.settings",
    label: "Configurações",
    tab: "configuracoes",
    icon: Settings,

    children: [

      {
        label: "Permissões",
        tab: "configuracoes-permissoes",
        icon: Shield,
        adminOnly: true
      },

      {
        label: "Auditoria",
        href: "/auditoria",
        icon: FileText,
        platformOnly: true
      },

      {
        label: "Financeiro",
        tab: "financeiro",
        icon: CreditCard
      }

    ]
  }

];

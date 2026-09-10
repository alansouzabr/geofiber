import type {
  LucideIcon
} from "lucide-react";

import {
  Building2,
  ClipboardCheck,
  CreditCard,
  FileArchive,
  FileClock,
  FileText,
  FolderKanban,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Map,
  Settings,
  ShieldCheck,
  Unlock,
  Users
} from "lucide-react";


export type MasterNavigationItem = {
  key: string;
  label: string;
  description: string;
  href?: string;
  icon: LucideIcon;
  children?: MasterNavigationItem[];
};


export type MasterNavigationGroup = {
  key: string;
  label: string;
  items: MasterNavigationItem[];
};


/*
 * ETAPA35A13B_MASTER_NAVIGATION
 *
 * Fonte única do menu MASTER.
 *
 * A estrutura suporta:
 *
 * grupo
 * └── item
 *     └── subitem
 *
 * Nenhuma permission key nova é criada.
 */
export const masterNavigationGroups:
  MasterNavigationGroup[] = [

    {
      key: "dashboard",
      label: "Dashboard",

      items: [

        {
          key: "dashboard-technical",
          label: "KMZ / DWG / GED",
          description:
            "Acesso central às plataformas técnicas, arquivos geográficos e documentos de engenharia.",
          href: "/dashboard/plataformas",
          icon: LayoutDashboard
        },

        {
          key: "dashboard-release",
          label: "Liberação",
          description:
            "Gerenciamento e liberação de empresas da plataforma.",
          href: "/dashboard/liberacao",
          icon: Unlock
        }

      ]
    },


    {
      key: "safety",
      label: "Segurança do Trabalho",

      items: [

        {
          key: "safety-training",
          label: "Treinamentos",
          description:
            "Treinamentos de Segurança do Trabalho.",
          icon: GraduationCap,

          children: [

            {
              key: "safety-training-norms",
              label: "Normas Regulamentadoras",
              description:
                "Treinamentos e documentação das Normas Regulamentadoras.",
              href: "/seg/treinamentos",
              icon: ShieldCheck
            }

          ]
        },

        {
          key: "safety-sst",
          label: "SST / PGR / PCMSO",
          description:
            "Documentação e treinamentos de segurança e saúde ocupacional.",
          href: "/seg/pgr",
          icon: ClipboardCheck
        }

      ]
    },


    {
      key: "telecom",
      label: "Telecomunicação",

      items: [

        {
          key: "telecom-training",
          label: "Treinamentos",
          description:
            "Treinamentos técnicos de Telecomunicação.",
          icon: GraduationCap,

          children: [

            {
              key: "telecom-training-ti",
              label: "TI / Redes / Telecom",
              description:
                "Treinamentos técnicos de TI, redes e telecomunicações.",
              href: "/telecom/treinamentos",
              icon: GraduationCap
            }

          ]
        },

        {
          key: "telecom-technical",
          label: "KMZ / DWG / GED",
          description:
            "Arquivos técnicos e geográficos da operação de telecomunicações.",
          href: "/telecom/plataformas",
          icon: Map
        },

        {
          key: "telecom-documents",
          label: "Documentos",
          description:
            "Documentos empresariais e operacionais.",
          href: "/telecom/documentos",
          icon: FileText
        },

        {
          key: "telecom-accounting",
          label: "Contabilidade",
          description:
            "Arquivos e documentos contábeis.",
          href: "/telecom/contabilidade",
          icon: FileText
        },

        {
          key: "telecom-crea-cft",
          label: "CREA / CFT",
          description:
            "ART, CREA, TRT, CFT e documentação técnica profissional.",
          href: "/telecom/crea-cft",
          icon: ClipboardCheck
        },

        {
          key: "telecom-certificates",
          label: "Certidões",
          description:
            "Certidões e documentos comprobatórios.",
          href: "/telecom/certidoes",
          icon: FileText
        },

        {
          key: "telecom-feninfra",
          label: "Feninfra",
          description:
            "Documentação relacionada à Feninfra.",
          href: "/telecom/feninfra",
          icon: FileArchive
        },

        {
          key: "telecom-anatel-enel",
          label: "Anatel / Enel",
          description:
            "Documentação regulatória relacionada à Anatel e Enel.",
          href: "/telecom/anatel-enel",
          icon: FileText
        }

      ]
    },


    {
      key: "projects",
      label: "Projetos",

      items: [

        {
          key: "projects-technical",
          label: "KMZ / DWG / GED",
          description:
            "Arquivos técnicos e documentação vinculada aos projetos.",
          href: "/projetos/plataformas",
          icon: FolderKanban
        }

      ]
    },


    {
      key: "execution",
      label: "Execução",

      items: [

        {
          key: "execution-technical",
          label: "KMZ / DWG / GED",
          description:
            "Documentação técnica utilizada durante a execução.",
          href: "/execucao/plataformas",
          icon: FolderOpen
        },

        {
          key: "execution-maps",
          label: "Mapas",
          description:
            "GeoFiber Maps para operação e documentação da rede.",
          href: "/execucao/mapas",
          icon: Map
        },

        {
          key: "execution-checklist",
          label: "Checklist",
          description:
            "Padrões operacionais e acompanhamento da execução.",
          href: "/execucao/checklist",
          icon: ClipboardCheck
        },

        {
          key: "execution-standard-technician",
          label: "Técnico Padrão",
          description:
            "Gestão dos padrões e técnicos da operação.",
          href: "/execucao/tecnico",
          icon: FileText
        },

        {
          key: "execution-tools",
          label: "Ferramentas",
          description:
            "Inventário operacional das ferramentas.",
          href: "/execucao/ferramentas",
          icon: Settings
        },

        {
          key: "execution-car",
          label: "Carro",
          description:
            "Gestão do veículo operacional.",
          href: "/execucao/carro",
          icon: Settings
        }

      ]
    },


    {
      key: "company",
      label: "Empresa",

      items: [

        {
          key: "company-profile",
          label: "Dados da Empresa",
          description:
            "Cadastro institucional da empresa vinculada ao contexto atual.",
          href: "/empresa/dados",
          icon: Building2
        },


        {
          key: "company-users",
          label: "Usuários",
          description:
            "Gestão multiempresa de usuários.",
          href: "/empresa/usuarios",
          icon: Users
        },

        {
          key: "company-alvara-avcb",
          label: "Alvará / AVCB",
          description:
            "Publicação global de Alvará e AVCB para as empresas.",
          href: "/empresa/alvara-avcb",
          icon: FileText
        }

      ]
    },


    {
      key: "settings",
      label: "Configurações",

      items: [

        {
          key: "settings-permissions",
          label: "Permissões",
          description:
            "Liberação de módulos e permissões por empresa.",
          href: "/configuracoes/permissoes",
          icon: ShieldCheck
        },

        {
          key: "settings-audit",
          label: "Auditoria",
          description:
            "Rastreabilidade das ações da plataforma.",
          href: "/auditoria",
          icon: FileClock
        },

        {
          key: "settings-finance",
          label: "Financeiro",
          description:
            "Planos, cobrança e governança financeira.",
          href: "/financeiro",
          icon: CreditCard
        }

      ]
    }

  ];


/*
 * Compatibilidade de rotas equivalentes.
 */
export function masterPathIsActive(
  pathname: string,
  href: string
): boolean {

  if (href === "/master") {
    return pathname === "/master";
  }


  if (
    href ===
    "/telecom/crea-cft"
  ) {

    return (

      pathname ===
        "/telecom/crea-cft"

      ||

      pathname.startsWith(
        "/telecom/crea-cft/"
      )

      ||

      pathname ===
        "/telecom/crea"

      ||

      pathname.startsWith(
        "/telecom/crea/"
      )

      ||

      pathname ===
        "/telecom/cft"

      ||

      pathname.startsWith(
        "/telecom/cft/"
      )

      ||

      pathname ===
        "/telecom/trt"

      ||

      pathname.startsWith(
        "/telecom/trt/"
      )

    );
  }


  if (
    href ===
    "/telecom/anatel-enel"
  ) {

    return (

      pathname ===
        "/telecom/anatel-enel"

      ||

      pathname.startsWith(
        "/telecom/anatel-enel/"
      )

      ||

      pathname ===
        "/telecom/anatel"

      ||

      pathname.startsWith(
        "/telecom/anatel/"
      )

      ||

      pathname ===
        "/telecom/enel"

      ||

      pathname.startsWith(
        "/telecom/enel/"
      )

    );
  }


  if (
    href ===
    "/telecom/contabilidade"
  ) {

    return (

      pathname ===
        "/telecom/contabilidade"

      ||

      pathname.startsWith(
        "/telecom/contabilidade/"
      )

      ||

      pathname ===
        "/telecom/contabil"

      ||

      pathname.startsWith(
        "/telecom/contabil/"
      )

    );
  }


  /*
   * ETAPA35A13B_R2_TRAINING_ACTIVE_ALIASES
   *
   * Rotas antigas continuam válidas.
   * O menu destaca o novo caminho canônico
   * também quando um alias antigo é acessado.
   */
  if (
    href ===
    "/seg/treinamentos"
  ) {

    return (

      pathname ===
        "/seg/treinamentos"

      ||

      pathname.startsWith(
        "/seg/treinamentos/"
      )

      ||

      pathname ===
        "/seg/normas"

      ||

      pathname.startsWith(
        "/seg/normas/"
      )

      ||

      pathname ===
        "/treinamentos/normas"

      ||

      pathname ===
        "/seguranca-do-trabalho/normas"

      ||

      pathname ===
        "/normas"

      ||

      pathname ===
        "/dashboard/training/safety"

      ||

      pathname.startsWith(
        "/dashboard/training/safety/"
      )

    );
  }


  if (
    href ===
    "/telecom/treinamentos"
  ) {

    return (

      pathname ===
        "/telecom/treinamentos"

      ||

      pathname.startsWith(
        "/telecom/treinamentos/"
      )

      ||

      pathname ===
        "/treinamentos/telecom"

      ||

      pathname.startsWith(
        "/treinamentos/telecom/"
      )

      ||

      pathname ===
        "/dashboard/training/technology"

      ||

      pathname.startsWith(
        "/dashboard/training/technology/"
      )

    );
  }


  return (
    pathname === href ||
    pathname.startsWith(
      `${href}/`
    )
  );
}


export function masterNavigationItemIsActive(
  pathname: string,
  item: MasterNavigationItem
): boolean {

  if (
    item.href &&
    masterPathIsActive(
      pathname,
      item.href
    )
  ) {
    return true;
  }


  return Boolean(
    item.children?.some(
      child =>
        masterNavigationItemIsActive(
          pathname,
          child
        )
    )
  );
}

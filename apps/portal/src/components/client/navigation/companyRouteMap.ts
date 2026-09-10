/*
 * ETAPA35A11C2D_R1B_COMPANY_ROUTE_MAP
 *
 * Fonte canônica de compatibilidade entre
 * rotas globais antigas e tabs do
 * /dashboard/[company].
 *
 * ATENÇÃO:
 * - /auditoria NÃO entra aqui.
 * - /dashboard/liberacao NÃO entra aqui.
 *
 * Ambas permanecem platformOnly.
 */

export const companyPathToTab:
  Readonly<Record<string, string>> =
  Object.freeze({

    "/dashboard":
      "dashboard",

    "/dashboard/plataformas":
      "dashboard-plataformas",

    "/treinamentos":
      "treinamentos",

    "/seg/treinamentos":
      "seguranca-normas",

    "/seg/normas":
      "seguranca-normas",

    "/treinamentos/normas":
      "seguranca-normas",

    "/seguranca-do-trabalho/normas":
      "seguranca-normas",

    "/normas":
      "seguranca-normas",

    "/dashboard/training/safety":
      "seguranca-normas",

    "/dashboard/training/safety/nr":
      "seguranca-normas",

    "/seg/pgr":
      "seguranca-sst",

    "/seguranca-do-trabalho/sst-pgr-pcmso":
      "seguranca-sst",

    "/telecom/treinamentos":
      "treinamentos-telecom",

    "/treinamentos/telecom":
      "treinamentos-telecom",

    "/dashboard/training/technology":
      "treinamentos-telecom",

    "/dashboard/training/technology/noc":
      "treinamentos-telecom",

    "/telecom":
      "telecom",

    "/telecom/plataformas":
      "telecom-kmz-dwg-ged",

    "/telecom/kmz-dwg-ged":
      "telecom-kmz-dwg-ged",

    "/telecom/kmz":
      "telecom-kmz-dwg-ged",

    "/telecom/dwg":
      "telecom-kmz-dwg-ged",

    "/telecom/documentos":
      "arquivos-documentos",

    "/telecom/contabilidade":
      "arquivos-contabilidade",

    "/telecom/contabil":
      "arquivos-contabilidade",

    "/telecom/crea":
      "telecom-crea-cft",

    "/telecom/cft":
      "telecom-crea-cft",

    "/telecom/crea-cft":
      "telecom-crea-cft",

    "/telecom/trt":
      "telecom-crea-cft",

    "/telecom/certidoes":
      "arquivos-certidoes",

    "/telecom/feninfra":
      "arquivos-feninfra",

    "/telecom/anatel":
      "arquivos-anatel",

    "/telecom/anatel-enel":
      "arquivos-anatel",

    "/projetos":
      "projetos",

    "/projetos/plataformas":
      "projetos-kmz-dwg-ged",

    "/projetos/kmz":
      "projetos-kmz",

    "/projetos/geomaps":
      "projetos-geomaps",

    "/execucao":
      "execucao",

    "/execucao/plataformas":
      "execucao-kmz-dwg-ged",

    "/execucao/mapas":
      "execucao-mapas",

    "/maps":
      "execucao-mapas",

    "/execucao/checklist":
      "execucao-checklist",

    "/execucao/tecnico":
      "execucao-tecnico",

    "/execucao/ferramentas":
      "execucao-ferramentas",

    "/execucao/carro":
      "execucao-carro",

    "/arquivos":
      "arquivos-documentos",

    "/usuarios":
      "empresa-usuarios",

    "/empresa/usuarios":
      "empresa-usuarios",

    "/empresa":
      "empresa",

    "/empresa/dados":
      "empresa",

      "/empresa/alvara-avcb":
        "empresa-alvara-avcb",

    "/configuracoes/permissoes":
      "configuracoes-permissoes",

    "/financeiro":
      "financeiro"
  });


export function buildCompanyDashboardHref(
  companyId: string,
  tab?: string
) {

  const normalizedCompanyId =
    String(
      companyId || ""
    ).trim();

  if (!normalizedCompanyId) {
    return "/dashboard";
  }

  const base =
    `/dashboard/${
      encodeURIComponent(
        normalizedCompanyId
      )
    }`;

  if (!tab) {
    return base;
  }

  return (
    `${base}?tab=${
      encodeURIComponent(tab)
    }`
  );
}

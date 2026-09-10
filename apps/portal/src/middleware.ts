import {
  NextResponse
} from "next/server";

import type {
  NextRequest
} from "next/server";


const legacyRouteRedirects:
  Record<string, string> = {

    "/treinamentos/normas":
      "/seg/normas",

    "/seguranca-do-trabalho/normas":
      "/seg/normas",

    "/seguranca-do-trabalho/sst-pgr-pcmso":
      "/seg/pgr",

    "/normas":
      "/seg/normas",

    "/dashboard/training/safety/nr":
      "/seg/normas",

  
    "/dashboard/kmz-dwg-ged":
      "/dashboard/plataformas",


    "/telecom/kmz-dwg-ged":
      "/telecom/plataformas",


    "/projetos/kmz-dwg-ged":
      "/projetos/plataformas",


    "/execucao/kmz-dwg-ged":
      "/execucao/plataformas",


    "/arquivos/documentos":
      "/telecom/documentos",

    "/arquivos/crea":
      "/telecom/crea",

    "/arquivos/cft":
      "/telecom/cft",

    "/telecom/trt":
      "/telecom/cft",

    "/telecom/contabilidade":
      "/telecom/contabil",

    "/arquivos/contabilidade":
      "/telecom/contabil",

    "/arquivos/certidoes":
      "/telecom/certidoes",

    "/arquivos/feninfra":
      "/telecom/feninfra",

    "/arquivos/anatel":
      "/telecom/anatel",

    "/arquivos/dwg":
      "/telecom/dwg",

    "/arquivos/kmz":
      "/telecom/kmz",
};


export function middleware(
  req: NextRequest
) {

  const pathname =
    req.nextUrl.pathname;


  /*
   * Primeiro normaliza as rotas antigas.
   * O redirect ocorre antes da renderização
   * do App Router/AppShell.
   */
  const canonicalTarget =
    legacyRouteRedirects[
      pathname
    ];


  if (canonicalTarget) {

    const url =
      req.nextUrl.clone();

    url.pathname =
      canonicalTarget;

    url.search = "";

    return NextResponse.redirect(
      url
    );

  }


  /*
   * Depois protege as áreas privadas.
   */
  const token =
    req.cookies.get(
      "gf_token"
    );

  /*
   * Perímetro privado GeoFiber.
   *
   * A normalização de URLs ocorre antes deste bloco.
   * Este guard verifica somente autenticação.
   *
   * RBAC continua no AppShell/backend.
   */
  const protectedPrefixes = [

    "/root",

    "/master",

    "/admin",

    "/dashboard",

    "/configuracoes",

    "/telecom",

    "/projetos",

    "/execucao",

    "/seg",

    "/empresa",

    "/usuarios",

    "/auditoria",

    "/financeiro",

    "/treinamentos",

    "/arquivos",

    "/maps"

  ];


  const isProtectedRoute =
    protectedPrefixes.some(
      prefix =>
        pathname === prefix ||
        pathname.startsWith(
          `${prefix}/`
        )
    );


  if (
    isProtectedRoute &&
    !token
  ) {

    const loginUrl =
      req.nextUrl.clone();

    loginUrl.pathname =
      "/login";

    loginUrl.search = "";

    return NextResponse.redirect(
      loginUrl
    );

  }


  return NextResponse.next();

}


export const config = {

  matcher: [

    "/root",
    "/root/:path*",

    "/master",
    "/master/:path*",

    "/admin",
    "/admin/:path*",

    "/dashboard",
    "/dashboard/:path*",

    "/configuracoes",
    "/configuracoes/:path*",

    "/telecom",
    "/telecom/:path*",

    "/projetos",
    "/projetos/:path*",

    "/execucao",
    "/execucao/:path*",

    "/seg",
    "/seg/:path*",

    "/empresa",
    "/empresa/:path*",

    "/usuarios",
    "/usuarios/:path*",

    "/auditoria",
    "/auditoria/:path*",

    "/financeiro",
    "/financeiro/:path*",

    "/treinamentos",
    "/treinamentos/:path*",

    "/arquivos",
    "/arquivos/:path*",

    "/maps",
    "/maps/:path*",

    /*
     * Aliases que ficam fora dos prefixos acima.
     */
    "/normas",

    "/seguranca-do-trabalho/normas",

    "/seguranca-do-trabalho/sst-pgr-pcmso"

  ]

};

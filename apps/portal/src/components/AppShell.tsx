"use client";

import {
  useContext,
  useEffect,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import MasterHeader
  from "@/components/master/header/MasterHeader";

import RootHeader
  from "@/components/root/header/RootHeader";

import AdminHeader
  from "@/components/admin/header/AdminHeader";

import EnterpriseShell
  from "@/components/enterprise/shell/EnterpriseShell";

import MasterSidebar
  from "@/components/master/sidebar/MasterSidebar";

import RootSidebar
  from "@/components/root/RootSidebar";

import AdminSidebar
  from "@/components/admin/sidebar/AdminSidebar";

import {
  AuthContext,
} from "@/context/AuthContext";

import {
  buildCompanyDashboardHref,
  companyPathToTab,
} from "@/components/client/navigation/companyRouteMap";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {

  /*
   * Hooks sempre são chamados antes de qualquer
   * retorno condicional.
   *
   * Isso evita violação da ordem de Hooks do React.
   */
  const router =
    useRouter();

  const pathname =
    usePathname();

  const auth =
    useContext(AuthContext);

  const user =
    auth?.user ?? null;

  const loading =
    auth?.loading ?? true;

  const role =
    user
      ? String(
          user.role || "TECNICO"
        )
      : null;

  /*
   * Rotas estáticas existentes em /dashboard.
   *
   * Elas pertencem ao AppShell normal e NÃO podem
   * ser confundidas com /dashboard/[company].
   *
   * O antigo regex:
   *
   *   /^\/dashboard\/[^/]+$/
   *
   * classificava, por exemplo,
   * /dashboard/plataformas como se "plataformas"
   * fosse uma empresa.
   */
  const dashboardStaticSegments =
    new Set([
      "admin",
      "audit",
      "billing",
      "ged",
      "geofiber",
      "liberacao",
      "maps",
      "plataformas",
      "projetos",
      "training",
      "trt",
      "users",
      "usuario",
    ]);


  const dashboardSingleSegmentMatch =
    pathname.match(
      /^\/dashboard\/([^/]+)$/
    );


  const dashboardSegment =
    dashboardSingleSegmentMatch?.[1] ??
    null;


  const isCompanyDashboard =
    dashboardSegment !== null &&
    !dashboardStaticSegments.has(
      dashboardSegment
    );


  /*
   * ETAPA35A18B_ROOT_PLATFORM_GUARD
   *
   * /root pertence ao perímetro de plataforma.
   *
   * Middleware garante autenticação.
   * AppShell separa plataforma de tenant.
   *
   * ROOT / MASTER:
   * acesso de plataforma.
   *
   * ADMIN e demais perfis:
   * nunca renderizam conteúdo /root.
   */
  const isRootRoute =
    pathname === "/root" ||
    pathname.startsWith(
      "/root/"
    );

  const isMasterRoute =
    pathname === "/master" ||
    pathname.startsWith(
      "/master/"
    );

  const hasPlatformAccess =
    role === "ROOT" ||
    role === "MASTER";

  /*
   * ETAPA35A11C2D_R1B_ADMIN_COMPANY_CANONICAL
   *
   * Para ADMIN vinculado a uma empresa,
   * qualquer rota global compatível volta
   * ao /dashboard/[company] canônico.
   *
   * companyId vem da sessão autenticada.
   * Nunca de ID hardcoded.
   */
  const companyId =
    String(
      (user as any)?.companyId ||
      ""
    ).trim();

  const adminCompanyTargetTab =
    (
      role === "ADMIN" &&
      companyId &&
      pathname
    )
      ? companyPathToTab[
          pathname
        ]
      : undefined;

  useEffect(() => {

    if (!loading && !user) {
      router.replace(
        "/login"
      );

      return;
    }

    /*
     * ETAPA35A18B_ROOT_PLATFORM_GUARD
     *
     * Middleware valida presença de autenticação.
     * Aqui validamos o perímetro de plataforma.
     *
     * Mantemos ROOT e MASTER como papéis de
     * plataforma, sem conceder bypass ao ADMIN.
     */
    if (
      !loading &&
      user &&
      isRootRoute &&
      !hasPlatformAccess
    ) {

      router.replace(
        role === "ADMIN"
          ? "/admin"
          : "/dashboard"
      );

      return;
    }

    /*
     * ETAPA35A11C2D_R1B_ADMIN_ROUTE_REDIRECT
     */
    if (
      !loading &&
      user &&
      companyId &&
      adminCompanyTargetTab
    ) {

      router.replace(
        buildCompanyDashboardHref(
          companyId,
          adminCompanyTargetTab
        )
      );

      return;
    }

    /*
     * /master é reservado para administração
     * de Plataforma.
     *
     * O backend continua sendo a autoridade real
     * de segurança.
     */
    if (
      !loading &&
      user &&
      isMasterRoute &&
      !hasPlatformAccess
    ) {
      router.replace(
        role === "ADMIN"
          ? "/admin"
          : "/dashboard"
      );
    }

  }, [
    loading,
    user,
    router,
    isRootRoute,
    isMasterRoute,
    hasPlatformAccess,
    role,
    companyId,
    adminCompanyTargetTab,
  ]);

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-950
          text-white
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">

          <div className="text-lg font-semibold">
            GeoFiber Enterprise
          </div>

          <div className="mt-2 text-sm text-slate-400">
            Carregando sessão...
          </div>

        </div>
      </div>
    );
  }

  if (!user || !role) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-950
          text-white
          flex
          items-center
          justify-center
        "
      >
        <div className="text-sm text-slate-400">
          Redirecionando para o login...
        </div>
      </div>
    );
  }

  /*
   * ETAPA35A18B_ROOT_PLATFORM_RENDER_GUARD
   *
   * O redirect acontece no useEffect,
   * mas não permitimos que o conteúdo ROOT
   * seja renderizado durante esse intervalo.
   */
  if (
    isRootRoute &&
    !hasPlatformAccess
  ) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-950
          text-white
          flex
          items-center
          justify-center
        "
      >
        <div className="text-sm text-slate-400">
          Redirecionando...
        </div>
      </div>
    );
  }

  /*
   * ETAPA35A11C2D_R1B_ADMIN_REDIRECT_SCREEN
   *
   * Não renderizar AdminSidebar reduzido
   * enquanto a rota está sendo
   * canonicalizada.
   */
  if (
    companyId &&
    adminCompanyTargetTab
  ) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-950
          text-white
          flex
          items-center
          justify-center
        "
      >
        <div className="text-sm text-slate-400">
          Redirecionando para a empresa...
        </div>
      </div>
    );
  }

  if (
    isMasterRoute &&
    !hasPlatformAccess
  ) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-950
          text-white
          flex
          items-center
          justify-center
        "
      >
        <div className="text-sm text-slate-400">
          Redirecionando...
        </div>
      </div>
    );
  }

  /*
   * /dashboard/[company]
   *
   * A rota possui ClientLayout /
   * ClientSidebar / ClientHeader próprios.
   *
   * Não duplicar shell.
   */
  if (isCompanyDashboard) {
    return (
      <>
        {children}
      </>
    );
  }

  /*
   * Perfis corporativos comuns usam
   * EnterpriseShell.
   */
  if (
    role !== "ROOT" &&
    role !== "MASTER" &&
    role !== "ADMIN"
  ) {
    return (
      <EnterpriseShell>
        {children}
      </EnterpriseShell>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-slate-950
      "
    >
      <div className="flex">

        {role === "ROOT" ? (
          <RootSidebar />
        ) : role === "MASTER" ? (
          <MasterSidebar />
        ) : (
          <AdminSidebar />
        )}

        <main
          className="
            flex-1
            min-w-0
            min-h-screen
          "
        >

          {role === "ROOT" ? (
            <RootHeader />
          ) : role === "MASTER" ? (
            <MasterHeader />
          ) : (
            <AdminHeader
              context="ADMIN"

              /*
               * ETAPA35A13D_ADMIN_IDENTITY
               *
               * Identidade visual da sessão.
               * Não interfere em role/RBAC.
               */
              name={String(
                (user as any)?.name ||
                (user as any)?.fullName ||
                (user as any)?.displayName ||
                (user as any)?.email ||
                "ADMIN"
              )}
              email={String(
                (user as any)?.email ||
                "Administrador"
              )}
            />
          )}

          <div className="p-4 sm:p-6">
            {children}
          </div>

        </main>

      </div>
    </div>
  );
}

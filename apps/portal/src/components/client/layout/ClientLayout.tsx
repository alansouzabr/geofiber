"use client";

import { ReactNode, useContext, useState } from "react";

import ClientHeader
from "@/components/client/header/ClientHeader";

import ClientSidebar
from "@/components/client/sidebar/ClientSidebar";

import ClientMobileDrawer
from "@/components/client/mobile/ClientMobileDrawer";

import {
  AuthContext,
} from "@/context/AuthContext";

import {
  companyPathToTab,
} from "@/components/client/navigation/companyRouteMap";

interface Props {
  company?: any;
  tab: string;
  setTab: (tab: string) => void;
  children: ReactNode;
}

export default function ClientLayout({
  company,
  tab,
  setTab,
  children
}: Props) {

  const [mobileOpen, setMobileOpen] =
    useState(false);

  /*
   * ETAPA 35A.6
   *
   * O shell representa a pessoa autenticada.
   *
   * A empresa original continua sendo entregue
   * aos componentes internos do Dashboard
   * através de `children`.
   */
  const auth =
    useContext(AuthContext);

  const user =
    auth?.user ?? null;

  const identityName =
    user?.name?.trim() ||
    user?.email?.trim() ||
    "Usuário";

  /*
   * Sidebar / Header / MobileDrawer esperam
   * atualmente um objeto `company`.
   *
   * Mantemos todos os dados originais,
   * alterando apenas o campo visual `name`
   * dentro do shell.
   *
   * Desta forma não espalhamos alterações
   * pelos componentes e não modificamos
   * a identidade institucional do Dashboard.
   */
  const identityCompany = {
    ...(company ?? {}),
    name: identityName,
  };

  /*
   * ETAPA35A11C2D_R1B_COMPANY_LINK_CAPTURE
   *
   * Links históricos presentes em componentes
   * reutilizados são convertidos em tabs quando
   * estamos dentro do ClientLayout.
   *
   * Assim não existe troca de AppShell.
   */
  function handleCompanyNavigationCapture(
    event: any
  ) {

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target =
      event.target as
        HTMLElement | null;

    const anchor =
      target?.closest?.(
        "a[href]"
      ) as HTMLAnchorElement | null;

    if (!anchor) {
      return;
    }

    if (
      anchor.target &&
      anchor.target !== "_self"
    ) {
      return;
    }

    const href =
      anchor.getAttribute(
        "href"
      );

    if (!href) {
      return;
    }

    const url =
      new URL(
        href,
        window.location.origin
      );

    if (
      url.origin !==
      window.location.origin
    ) {
      return;
    }

    const nextTab =
      companyPathToTab[
        url.pathname
      ];

    if (!nextTab) {
      return;
    }

    event.preventDefault();

    setTab(nextTab);
  }

  return (

    <div
      onClickCapture={
        handleCompanyNavigationCapture
      }
      className="
        min-h-screen
        flex
        bg-slate-950
      "
    >

      <ClientSidebar
        company={identityCompany}
        tab={tab}
        setTab={setTab}
      />

      <ClientMobileDrawer
        company={identityCompany}
        tab={tab}
        setTab={setTab}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main
        className="
          flex-1
          flex
          flex-col
          min-h-screen
        "
      >

        <ClientHeader
          company={identityCompany}
          onOpenMenu={() => setMobileOpen(true)}
        />

        <div
          className="
            flex-1
            p-4
            lg:p-8
          "
        >
          {children}
        </div>

      </main>

    </div>

  );

}

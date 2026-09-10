"use client";

import {
  ReactNode,
  useContext,
  useState,
} from "react";

import {
  AuthContext,
} from "@/context/AuthContext";

import EnterpriseSidebar
  from "@/components/enterprise/sidebar/EnterpriseSidebar";

import EnterpriseHeader
  from "@/components/enterprise/header/EnterpriseHeader";

import EnterpriseMobileDrawer
  from "@/components/enterprise/mobile/EnterpriseMobileDrawer";

interface Props {
  children: ReactNode;
}

export default function EnterpriseShell({
  children,
}: Props) {

  const auth =
    useContext(AuthContext);

  const user =
    auth?.user ?? null;

  const company =
    user?.company ??
    {
      name:
        user?.companyName ||
        "Empresa",
      email:
        user?.email ||
        "",
    };

  const [tab, setTab] =
    useState("dashboard");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div
      className="
        min-h-screen
        bg-slate-950
        text-white
      "
    >

      <EnterpriseMobileDrawer
        company={company}
        tab={tab}
        setTab={setTab}
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />

      <div className="flex min-h-screen">

        <EnterpriseSidebar
          company={company}
          tab={tab}
          setTab={setTab}
        />

        <main
          className="
            flex-1
            min-w-0
            min-h-screen
          "
        >

          <EnterpriseHeader
            company={company}
            onOpenMenu={() =>
              setMobileOpen(true)
            }
          />

          <div
            className="
              p-4
              sm:p-6
              lg:p-8
              overflow-x-hidden
            "
          >
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}

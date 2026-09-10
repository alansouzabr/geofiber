"use client";

import { ReactNode, useState } from "react";

import BaseLayout from "@/components/layout/BaseLayout";

import EnterpriseHeader
from "@/components/enterprise/header/EnterpriseHeader";

import EnterpriseSidebar
from "@/components/enterprise/sidebar/EnterpriseSidebar";

import EnterpriseMobileDrawer
from "@/components/enterprise/mobile/EnterpriseMobileDrawer";

interface Props {
  company?: any;
  tab: string;
  setTab: (tab: string) => void;
  children: ReactNode;
}

export default function EnterpriseLayout({
  company,
  tab,
  setTab,
  children,
}: Props) {

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <EnterpriseMobileDrawer
        company={company}
        tab={tab}
        setTab={setTab}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <BaseLayout
        sidebar={
          <EnterpriseSidebar
            company={company}
            tab={tab}
            setTab={setTab}
          />
        }
        header={
          <EnterpriseHeader
            company={company}
            onOpenMenu={() => setMobileOpen(true)}
          />
        }
      >
        {children}
      </BaseLayout>
    </>
  );
}

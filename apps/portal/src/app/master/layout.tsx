import type { ReactNode } from "react";

import AppShell from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default function MasterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}

import type { ReactNode } from "react";

import AppShell
  from "@/components/AppShell";

export const dynamic =
  "force-dynamic";

export default function ProjetosLayout({
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

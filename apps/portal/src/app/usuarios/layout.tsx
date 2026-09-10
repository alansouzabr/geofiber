import type { ReactNode } from "react";

import MasterLayoutShell
  from "@/components/master/layout/MasterLayout";

export const dynamic = "force-dynamic";

export default function UsuariosLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MasterLayoutShell>
      {children}
    </MasterLayoutShell>
  );
}

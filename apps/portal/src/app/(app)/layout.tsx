import type { ReactNode } from 'react';
export const dynamic = 'force-dynamic';

import AppShell from '@/components/AppShell';

export default function AppLayout({ children }: { children: ReactNode }) {
  // depois você troca isso para vir do token /me e companyId selecionado
  const role = 'ROOT';
  const companyName = 'KriptoNet (Demo)';

  return (
    <AppShell role={role} companyName={companyName}>
      {children}
    </AppShell>
  );
}

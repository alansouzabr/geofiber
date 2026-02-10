export const dynamic = 'force-dynamic';

import AppShell from '@/components/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // depois você troca isso para vir do token /me e companyId selecionado
  const role = 'ROOT';
  const companyName = 'KriptoNet (Demo)';

  return (
    <AppShell role={role as any} companyName={companyName}>
      {children}
    </AppShell>
  );
}

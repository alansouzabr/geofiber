'use client';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

/**
 * Compatibilidade legada.
 *
 * A autenticação e o contexto da aplicação são
 * responsabilidade do AuthContext/AppShell atual.
 *
 * Este componente permanece temporariamente para
 * não quebrar eventuais referências externas.
 */
export default function AppProvider({
  children,
}: Props) {
  return <>{children}</>;
}

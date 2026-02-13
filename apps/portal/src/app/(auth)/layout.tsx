import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="gf-shell">
      <div className="gf-card">{children}</div>
    </div>
  );
}

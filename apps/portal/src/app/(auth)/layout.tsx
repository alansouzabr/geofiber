import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="gf-shell gf-auth">
      <div className="gf-card gf-auth-card">
        {children}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';

export default function AuthNoSidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="gf-shell">
      <div className="gf-card">
        <section className="gf-right" style={{ width: '100%' }}>
          {children}
        </section>
      </div>
    </div>
  );
}

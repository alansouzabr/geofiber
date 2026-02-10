import Link from 'next/link';

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="gf-shell">
      <div className="gf-card">
        <aside className="gf-left">
          <div className="gf-brand">
            <div className="gf-logo" aria-hidden />
            <div>
              <h1 className="gf-h1">GeoFiber</h1>
              <div style={{ color: 'var(--gf-muted)', fontSize: 13, marginTop: 2 }}>
                NOC • FTTH • Backbone • Datacenter
              </div>
            </div>
          </div>

          <p className="gf-sub">
            Plataforma de gestão técnica para redes ópticas — com rastreabilidade, permissões por função e visão geográfica.
          </p>

          <div className="gf-badges">
            <span className="gf-badge">Módulos isolados</span>
            <span className="gf-badge">Auditoria pronta</span>
            <span className="gf-badge">Fluxo PJ Telecom</span>
            <span className="gf-badge">Segurança JWT</span>
          </div>

          <div style={{ marginTop: 18, color: 'var(--gf-muted)', fontSize: 13 }}>
            <div style={{ marginBottom: 10 }}>
              <strong style={{ color: 'rgba(255,255,255,.88)' }}>Dica:</strong> você pode testar o cadastro PJ em{' '}
              <Link href="/register-company">/register-company</Link>.
            </div>
            <div>© {new Date().getFullYear()} GeoFiber</div>
          </div>
        </aside>

        <section className="gf-right">
          <h2 className="gf-title">{title}</h2>
          <div style={{ color: 'var(--gf-muted)', fontSize: 13, marginBottom: 14, lineHeight: 1.4 }}>
            {subtitle}
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}

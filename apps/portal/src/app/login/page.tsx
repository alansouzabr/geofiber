import AuthShell from '@/components/auth/AuthShell';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginPage() {
  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse sua conta para gerenciar sua empresa e operações (FTTH/Backbone/Datacenter)."
    >
      <form>
        <div className="gf-field">
          <label className="gf-label">E-mail</label>
          <input className="gf-input" placeholder="voce@empresa.com" />
        </div>

        <div className="gf-field">
          <label className="gf-label">Senha</label>
          <input className="gf-input" type="password" placeholder="••••••••" />
        </div>

        <button className="gf-btn" type="button">
          Entrar
        </button>

        <div className="gf-linkrow">
          <span>Sem conta?</span>
          <Link href="/register-company">Cadastrar empresa</Link>
        </div>

        <div className="gf-msg" style={{ display: 'none' }}>
          {/* reservado para mensagens */}
        </div>
      </form>
    </AuthShell>
  );
}

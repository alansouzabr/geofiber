'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch, setToken } from '@/lib/api';

type LoginResp = {
  accessToken: string;
  error?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setErr('');
      setLoading(true);

      const res = await apiFetch<LoginResp>('/auth/login', {
        method: 'POST',
        json: { email, password },
      });

      if (!res?.accessToken) {
        throw new Error(res?.error || 'Login inválido (sem token).');
      }

      setToken(res.accessToken);
      router.replace('/dashboard');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gf-shell">
      <div className="gf-card">
        <aside className="gf-left">
          <div className="gf-brand">
            <div className="gf-logo" aria-hidden="true" />
            <div className="gf-title">GeoFiber</div>
            <div className="gf-sub">Acesso ao Portal</div>
          </div>
        </aside>

        <section className="gf-right">
          <h1 className="gf-h1">Entrar</h1>

          <p className="gf-right-sub">
            Acesse sua conta para gerenciar sua empresa e operações (FTTH/Backbone/Datacenter).
          </p>

          {err ? (
            <div className="gf-alert" role="alert">
              {err}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="gf-form">
            <label className="gf-label">
              E-mail
              <input
                className="gf-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="gf-label">
              Senha
              <input
                className="gf-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button className="gf-btn" type="submit" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>

            <div className="gf-foot">
              <Link className="gf-link" href="/register-company">
                Cadastrar empresa
              </Link>
              <span style={{ opacity: 0.6 }}>•</span>
              <Link className="gf-link" href="/">
                Voltar
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

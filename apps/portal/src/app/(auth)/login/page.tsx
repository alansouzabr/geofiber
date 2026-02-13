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
    <section>
      <h1 className="gf-h1">Bem vindo,</h1>
      <p className="gf-right-sub">faça login para acessar o sistema.</p>

      {err ? (
        <div className="gf-alert" role="alert">
          {err}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="gf-form">
        <label className="gf-label">
          Usuário
          <input
            className="gf-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={loading}
            placeholder="voce@empresa.com"
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
            disabled={loading}
            placeholder="••••••••"
          />
        </label>

        <div className="gf-row">
          {/* se você não tiver rota ainda, pode deixar como # por enquanto */}
          <Link className="gf-link" href="#">
            Esqueci minha senha
          </Link>
        </div>

        <button className="gf-btn" type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        {/* se quiser, pode manter também um link de cadastro aqui */}
        <div className="gf-foot" style={{ justifyContent: 'space-between' }}>
          <Link className="gf-link" href="/register-company">
            Cadastrar empresa
          </Link>
          <Link className="gf-link" href="/">
            Voltar
          </Link>
        </div>
      </form>

      <div className="gf-auth-foot">
        <a href="mailto:suporte@futurecloud.com.br">suporte@futurecloud.com.br</a>
        <a href="tel:+5511952343399">(11) 91412-4464</a>
      </div>
    </section>
  );
}

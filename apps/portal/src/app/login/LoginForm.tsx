'use client';

import { useState } from 'react';
import { setToken } from '@/lib/api';

export default function LoginForm() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.message || data?.error || 'Falha no login');
        return;
      }

      if (data?.token) setToken(data.token);

      window.location.href = '/dashboard';
    } catch (err: any) {
      setMsg(err?.message || String(err));
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>GeoFiber Maps</h1>

      <form onSubmit={onSubmit} style={{ maxWidth: 360, display: 'grid', gap: 10 }}>
        <input
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoComplete="username"
        />
        <input
          placeholder="Senha"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit">Entrar</button>

        {msg ? <div style={{ color: 'crimson' }}>{msg}</div> : null}
      </form>
    </main>
  );
}

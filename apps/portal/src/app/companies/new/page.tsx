'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function NewCompanyPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);
    try {
      const res = await apiFetch('/root/companies', {
        method: 'POST',
        body: JSON.stringify({
          company: { name, cnpj: cnpj || null },
          admin: { email: adminEmail, name: adminName, password: adminPassword },
        }),
      });

      setOk(`Empresa criada: ${res?.data?.company?.name || name}`);
      setTimeout(() => router.push('/companies'), 800);
    } catch (e: any) {
      setErr(e?.message || 'Erro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 700, margin: '40px auto', padding: 16 }}>
      <h1 style={{ fontSize: 22 }}>Cadastrar empresa (ROOT)</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10, marginTop: 16 }}>
        <h2 style={{ fontSize: 16 }}>Empresa</h2>
        <input placeholder="Nome da empresa" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 10 }} />
        <input placeholder="CNPJ (opcional)" value={cnpj} onChange={(e) => setCnpj(e.target.value)} style={{ padding: 10 }} />

        <h2 style={{ fontSize: 16, marginTop: 8 }}>Admin da empresa</h2>
        <input placeholder="Nome do admin" value={adminName} onChange={(e) => setAdminName(e.target.value)} style={{ padding: 10 }} />
        <input placeholder="Email do admin" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} style={{ padding: 10 }} />
        <input placeholder="Senha do admin (mín 8)" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} style={{ padding: 10 }} />

        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button type="button" onClick={() => router.push('/companies')} style={{ padding: 10 }}>Voltar</button>
          <button disabled={loading} style={{ padding: 10 }}>
            {loading ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </form>

      {err && <p style={{ marginTop: 12, color: 'crimson' }}>{err}</p>}
      {ok && <p style={{ marginTop: 12, color: 'green' }}>{ok}</p>}
    </main>
  );
}

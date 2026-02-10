'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { clearToken } from '@/lib/auth';

type Company = { id: string; name: string; cnpj: string | null; createdAt: string };
type MineResp = { isRoot: boolean; companies: Company[] };

export default function CompaniesPage() {
  const router = useRouter();
  const [data, setData] = useState<MineResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await apiFetch('/companies/mine');
        setData(r);

        // Se só tiver 1 empresa, pula automático
        if (!r.isRoot && r.companies?.length === 1) {
          localStorage.setItem('gf_company_id', r.companies[0].id);
          router.push('/dashboard');
        }
      } catch (e: any) {
        setErr(e?.message || 'Erro');
      }
    })();
  }, [router]);

  function logout() {
    clearToken();
    localStorage.removeItem('gf_company_id');
    router.push('/login');
  }

  if (err) {
    return (
      <main style={{ maxWidth: 700, margin: '40px auto', padding: 16 }}>
        <h1 style={{ fontSize: 22 }}>Empresas</h1>
        <p style={{ color: 'crimson' }}>{err}</p>
        <button onClick={logout} style={{ padding: 10, marginTop: 12 }}>Sair</button>
      </main>
    );
  }

  if (!data) return <main style={{ padding: 16 }}>Carregando...</main>;

  return (
    <main style={{ maxWidth: 700, margin: '40px auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 22 }}>Selecione a empresa</h1>
        <button onClick={logout} style={{ padding: 10 }}>Sair</button>
      </div>

      {data.isRoot && (
        <div style={{ marginTop: 12 }}>
          <button onClick={() => router.push('/companies/new')} style={{ padding: 10 }}>
            + Cadastrar empresa
          </button>
        </div>
      )}

      <ul style={{ marginTop: 16, display: 'grid', gap: 10, padding: 0, listStyle: 'none' }}>
        {data.companies.map((c) => (
          <li key={c.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{c.name}</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>CNPJ: {c.cnpj || '-'}</div>
            <div style={{ marginTop: 10 }}>
              <button
                style={{ padding: 10 }}
                onClick={() => {
                  localStorage.setItem('gf_company_id', c.id);
                  router.push('/dashboard');
                }}
              >
                Entrar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function CompanySelect() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setErr('');
        const data = await apiFetch('/api/companies');
        setCompanies(Array.isArray(data) ? data : (data?.items || []));
      } catch (e: any) {
        setErr(e?.message || String(e));
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Selecionar Empresa</h1>
          <Link className="text-slate-700 hover:underline" href="/dashboard">Voltar</Link>
        </div>

        {err ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 text-sm">{err}</div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.length ? companies.map((c) => (
            <button
              key={c.id || c.companyId || c.name}
              className="text-left rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:bg-slate-50 transition"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem('geofiber_companyId', String(c.id || c.companyId));
                  window.location.href = '/dashboard';
                }
              }}
            >
              <div className="text-xs text-slate-500">Empresa</div>
              <div className="text-lg font-bold text-slate-900">{c.name || 'Sem nome'}</div>
              <div className="text-sm text-slate-600 mt-1">{c.cnpj ? `CNPJ: ${c.cnpj}` : '—'}</div>
            </button>
          )) : (
            <div className="rounded-3xl bg-white border border-slate-200 p-6 text-slate-600">
              Nenhuma empresa carregada ainda (endpoint pode não existir).
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

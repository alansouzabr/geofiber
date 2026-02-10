'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterCompany() {
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [out, setOut] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOut('');
    try {
      // esse endpoint é do ROOT: /root/companies
      const r = await fetch('/api/root/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: { name, cnpj: cnpj || null },
          admin: { email: adminEmail, name: adminName, password: adminPassword },
        }),
      });

      const txt = await r.text();
      setOut(`HTTP ${r.status}\n${txt}`);
    } catch (err: any) {
      setOut(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EEF5FF] flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Cadastrar Empresa</h1>
          <Link className="text-blue-600 hover:underline" href="/">Voltar</Link>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Nome da empresa</label>
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm text-slate-600">CNPJ (opcional)</label>
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
          </div>

          <div className="pt-2 border-t border-slate-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">Admin nome</label>
              <input className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
                value={adminName} onChange={(e) => setAdminName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-slate-600">Admin e-mail</label>
              <input className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
                value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600">Admin senha</label>
            <input type="password" className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
          </div>

          <button disabled={loading}
            className="w-full rounded-2xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Enviando...' : 'Criar empresa + admin'}
          </button>
        </form>

        {out ? (
          <pre className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4 text-xs overflow-auto">{out}</pre>
        ) : null}

        <p className="mt-6 text-xs text-slate-500">
          * Este cadastro usa <code>/root/companies</code> (precisa estar logado como ROOT no token).
        </p>
      </div>
    </main>
  );
}

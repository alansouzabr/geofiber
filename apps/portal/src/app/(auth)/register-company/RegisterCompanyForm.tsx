'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Op = 'FTTH' | 'BACKBONE' | 'DATACENTER';

export default function RegisterCompanyForm() {
  const ops: { key: Op; label: string }[] = useMemo(
    () => [
      { key: 'FTTH', label: 'Provedor FTTH' },
      { key: 'BACKBONE', label: 'Backbone' },
      { key: 'DATACENTER', label: 'Datacenter' },
    ],
    [],
  );

  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [responsavelTecnico, setResponsavelTecnico] = useState('');
  const [registroProfissional, setRegistroProfissional] = useState('');
  const [tiposOperacao, setTiposOperacao] = useState<Op[]>(['FTTH']);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  function toggle(op: Op) {
    setTiposOperacao((prev) =>
      prev.includes(op) ? prev.filter((x) => x !== op) : [...prev, op],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setOk(false);

    if (!razaoSocial) return setMsg('Informe a Razão Social');
    if (!cnpj) return setMsg('Informe o CNPJ');
    if (!responsavelTecnico) return setMsg('Informe o Responsável técnico');
    if (!registroProfissional) return setMsg('Informe o CREA/CFT');

    setLoading(true);
    try {
      const res = await apiFetch('/companies/register-telecom', {
        method: 'POST',
        body: JSON.stringify({
          razaoSocial,
          cnpj,
          responsavelTecnico,
          registroProfissional,
          tiposOperacao,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setOk(false);
        setMsg(data?.message || 'Erro ao cadastrar empresa');
        return;
      }

      setOk(true);
      setMsg('Empresa cadastrada com sucesso! Volte para o login.');
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
        <div className="mb-6">
          <h1 className="text-xl font-black">Cadastro PJ Telecom</h1>
          <p className="text-sm opacity-80 mt-1">
            Cadastre sua empresa para acessar o GeoFiber Maps
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="input"
            placeholder="Razão Social"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
          />

          <input
            className="input"
            placeholder="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />

          <input
            className="input"
            placeholder="Responsável técnico"
            value={responsavelTecnico}
            onChange={(e) => setResponsavelTecnico(e.target.value)}
          />

          <input
            className="input"
            placeholder="CREA / CFT"
            value={registroProfissional}
            onChange={(e) => setRegistroProfissional(e.target.value)}
          />

          <div className="space-y-2">
            {ops.map((op) => {
              const checked = tiposOperacao.includes(op.key);
              return (
                <button
                  type="button"
                  key={op.key}
                  onClick={() => toggle(op.key)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition
                    ${checked
                      ? 'border-emerald-400/60 bg-emerald-400/10'
                      : 'border-white/10 bg-white/5'
                    }`}
                >
                  <span className="font-semibold">{op.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 font-black text-black"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar empresa'}
          </button>

          {msg && (
            <div
              className={`text-sm font-bold ${
                ok ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {msg}
            </div>
          )}

          <div className="flex justify-between text-sm opacity-80">
            <Link href="/login">Voltar para login</Link>
          </div>
        </form>
      </div>
    );
}

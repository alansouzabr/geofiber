'use client';

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
    setTiposOperacao((prev) => (prev.includes(op) ? prev.filter((x) => x !== op) : [...prev, op]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setOk(false);

    if (!razaoSocial.trim()) return setMsg('Informe a Razão Social');
    if (!cnpj.trim()) return setMsg('Informe o CNPJ');
    if (!responsavelTecnico.trim()) return setMsg('Informe o Responsável técnico');
    if (!registroProfissional.trim()) return setMsg('Informe o CREA/CFT');
    if (!tiposOperacao.length) return setMsg('Selecione ao menos 1 tipo de operação');

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

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setMsg(data?.error || data?.message || 'Falha ao cadastrar');
        return;
      }

      setOk(true);
      setMsg('Empresa cadastrada com sucesso!');
    } catch (err: any) {
      setMsg(err?.message || 'Erro de rede');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="gf-page">
      <section className="gf-shell" style={{ gridTemplateColumns: '1fr' }}>
        <div className="gf-card gf-card-pad" style={{ maxWidth: 820, margin: '0 auto', width: '100%' }}>
          <h1 className="gf-brand" style={{ marginBottom: 6 }}>
            GeoFiber Maps
          </h1>
          <p className="gf-muted" style={{ marginTop: 0 }}>
            Cadastro de <b>Empresa PJ Telecom</b> (FTTH / Backbone / Datacenter)
          </p>

          <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
            <label className="gf-label">Razão Social</label>
            <input className="gf-input" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />

            <label className="gf-label">CNPJ</label>
            <input
              className="gf-input"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0000-00"
            />

            <label className="gf-label">Responsável técnico</label>
            <input
              className="gf-input"
              value={responsavelTecnico}
              onChange={(e) => setResponsavelTecnico(e.target.value)}
            />

            <label className="gf-label">CREA / CFT</label>
            <input
              className="gf-input"
              value={registroProfissional}
              onChange={(e) => setRegistroProfissional(e.target.value)}
              placeholder="Ex: CREA 123456 / CFT 123456"
            />

            <label className="gf-label">Tipo de operação (múltiplo)</label>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
              {ops.map((o) => (
                <label key={o.key} className="gf-card" style={{ padding: 12, boxShadow: 'none' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input type="checkbox" checked={tiposOperacao.includes(o.key)} onChange={() => toggle(o.key)} />
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--gf-text)' }}>{o.label}</div>
                      <div className="gf-muted" style={{ fontSize: 13 }}>
                        {o.key}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <button className="gf-btn" type="submit" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar empresa'}
              </button>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <a className="gf-link" href="/login">
                Voltar para login
              </a>
              {ok ? (
                <a className="gf-link" href="/login">
                  Ir para login
                </a>
              ) : null}
            </div>

            {msg ? (
              <div style={{ marginTop: 12, color: ok ? 'var(--gf-success)' : 'var(--gf-danger)', fontWeight: 800 }}>
                {msg}
              </div>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Op = 'FTTH' | 'BACKBONE' | 'DATACENTER';

export default function RegisterCompanyForm() {
  const ops: { key: Op; label: string; help: string }[] = useMemo(
    () => [
      { key: 'FTTH', label: 'Provedor FTTH', help: 'Acesso FTTH' },
      { key: 'BACKBONE', label: 'Backbone', help: 'Rede de transporte' },
      { key: 'DATACENTER', label: 'Datacenter', help: 'Infra DC' },
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
          razaoSocial: razaoSocial.trim(),
          cnpj: cnpj.trim(),
          responsavelTecnico: responsavelTecnico.trim(),
          registroProfissional: registroProfissional.trim(),
          tiposOperacao,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setOk(false);
        setMsg(data?.message || data?.error || 'Falha ao cadastrar empresa');
        return;
      }

      setOk(true);
      setMsg('Empresa cadastrada com sucesso! Você já pode voltar para o login.');
      // opcional: limpar campos
      // setRazaoSocial(''); setCnpj(''); setResponsavelTecnico(''); setRegistroProfissional('');
      // setTiposOperacao(['FTTH']);
    } catch (err: any) {
      setOk(false);
      setMsg(err?.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 18,
      }}
    >
      <section style={{ width: '100%', maxWidth: 520 }}>
        <div
          style={{
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(10, 15, 20, 0.65)',
            backdropFilter: 'blur(8px)',
            padding: 18,
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>
              Cadastro de Empresa PJ (Telecom)
            </div>
            <div style={{ opacity: 0.85, marginTop: 6, fontSize: 13 }}>
              Informe os dados abaixo e selecione os tipos de operação.
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <label style={{ display: 'block', marginTop: 10, fontSize: 13, opacity: 0.9 }}>
              Razão Social
            </label>
            <input
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              placeholder="Ex: GeoFiber Telecom LTDA"
              style={inputStyle}
              autoComplete="organization"
            />

            <label style={{ display: 'block', marginTop: 10, fontSize: 13, opacity: 0.9 }}>
              CNPJ
            </label>
            <input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0000-00"
              style={inputStyle}
              inputMode="numeric"
              autoComplete="off"
            />

            <label style={{ display: 'block', marginTop: 10, fontSize: 13, opacity: 0.9 }}>
              Responsável técnico
            </label>
            <input
              value={responsavelTecnico}
              onChange={(e) => setResponsavelTecnico(e.target.value)}
              placeholder="Nome do responsável"
              style={inputStyle}
              autoComplete="name"
            />

            <label style={{ display: 'block', marginTop: 10, fontSize: 13, opacity: 0.9 }}>
              CREA / CFT
            </label>
            <input
              value={registroProfissional}
              onChange={(e) => setRegistroProfissional(e.target.value)}
              placeholder="Ex: CREA 123456 / CFT 123456"
              style={inputStyle}
              autoComplete="off"
            />

            <div style={{ marginTop: 14, fontSize: 13, opacity: 0.9 }}>Tipos de operação</div>

            <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
              {ops.map((o) => {
                const checked = tiposOperacao.includes(o.key);
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => toggle(o.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 12,
                      borderRadius: 12,
                      border: checked
                        ? '1px solid rgba(0,255,180,0.55)'
                        : '1px solid rgba(255,255,255,0.10)',
                      background: checked ? 'rgba(0,255,180,0.10)' : 'rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      style={{ width: 16, height: 16 }}
                    />
                    <div>
                      <div style={{ fontWeight: 800 }}>{o.label}</div>
                      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{o.help}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '12px 14px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(90deg, rgba(0,200,255,1), rgba(0,255,180,1))',
                fontWeight: 900,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar empresa'}
            </button>

            {msg ? (
              <div
                style={{
                  marginTop: 12,
                  color: ok ? 'rgba(0,255,180,0.95)' : 'rgba(255,80,100,0.95)',
                  fontWeight: 800,
                }}
              >
                {msg}
              </div>
            ) : null}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <Link href="/login" style={{ fontSize: 13, opacity: 0.85 }}>
                Voltar para login
              </Link>
              <Link href="/" style={{ fontSize: 13, opacity: 0.85 }}>
                Ir para início
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 12px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'rgba(255,255,255,0.04)',
  outline: 'none',
  marginTop: 6,
};

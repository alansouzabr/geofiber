'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Op = 'FTTH' | 'BACKBONE' | 'DATACENTER';

function onlyDigits(v: string) {
  return v.replace(/\D/g, '');
}

function maskCnpj(v: string) {
  const d = onlyDigits(v).slice(0, 14);
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 5);
  const p3 = d.slice(5, 8);
  const p4 = d.slice(8, 12);
  const p5 = d.slice(12, 14);

  let out = p1;
  if (p2) out += `.${p2}`;
  if (p3) out += `.${p3}`;
  if (p4) out += `/${p4}`;
  if (p5) out += `-${p5}`;
  return out;
}

function isValidCnpj(input: string) {
  const cnpj = onlyDigits(input);
  if (cnpj.length != 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calc = (base: number[]) => {
    let sum = 0;
    let pos = base.length - 7;

    for (let i = 0; i < base.length; i++) {
      sum += base[i] * pos;
      pos -= 1;
      if (pos < 2) pos = 9;
    }

    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const nums = cnpj.split('').map((x) => Number(x));
  const d1 = calc(nums.slice(0, 12));
  const d2 = calc(nums.slice(0, 13));
  return d1 === nums[12] && d2 === nums[13];
}

export default function RegisterCompanyForm() {
  const router = useRouter();

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
  const [redirecting, setRedirecting] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  function toggle(op: Op) {
    setTiposOperacao((prev) =>
      prev.includes(op) ? prev.filter((x) => x !== op) : [...prev, op],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || redirecting) return;

    setMsg('');
    setOk(false);

    if (!razaoSocial.trim()) return setMsg('Informe a Razão Social');
    if (!cnpj.trim()) return setMsg('Informe o CNPJ');
    if (!isValidCnpj(cnpj)) return setMsg('CNPJ inválido');
    if (!responsavelTecnico.trim()) return setMsg('Informe o Responsável técnico');
    if (!registroProfissional.trim()) return setMsg('Informe o CREA / CFT');
    if (tiposOperacao.length === 0) return setMsg('Selecione ao menos um tipo de operação');

    setLoading(true);

    try {
      const payload = {
        razaoSocial: razaoSocial.trim(),
        cnpj: onlyDigits(cnpj),
        responsavelTecnico: responsavelTecnico.trim(),
        registroProfissional: registroProfissional.trim(),
        tiposOperacao,
      };

      const data = await apiFetch('/companies/register-telecom', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      if (data?.ok) {
        setOk(true);
        setMsg('Empresa cadastrada com sucesso! Redirecionando para o login...');
        setRedirecting(true);

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setOk(false);
        setRedirecting(false);
        setMsg(data?.error || 'Erro inesperado');
      }
    } catch (err: unknown) {
      setOk(false);
      setRedirecting(false);
      setMsg(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 className="gf-title">Cadastro PJ Telecom</h2>

      <div
        style={{
          color: 'var(--gf-muted)',
          fontSize: 13,
          marginBottom: 14,
          lineHeight: 1.4,
        }}
      >
        Cadastre sua empresa para acessar o GeoFiber Maps.
      </div>

      <form onSubmit={onSubmit}>
        <div className="gf-field">
          <label className="gf-label">Razão Social</label>
          <input
            className="gf-input"
            placeholder="Ex.: GeoFiber Telecom LTDA"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
            autoComplete="organization"
            disabled={loading || redirecting}
          />
        </div>

        <div className="gf-field">
          <label className="gf-label">CNPJ</label>
          <input
            className="gf-input"
            placeholder="00.000.000/0001-00"
            value={cnpj}
            onChange={(e) => setCnpj(maskCnpj(e.target.value))}
            inputMode="numeric"
            maxLength={18}
            autoComplete="off"
            disabled={loading || redirecting}
          />
        </div>

        <div className="gf-field">
          <label className="gf-label">Responsável técnico</label>
          <input
            className="gf-input"
            placeholder="Nome do responsável"
            value={responsavelTecnico}
            onChange={(e) => setResponsavelTecnico(e.target.value)}
            autoComplete="name"
            disabled={loading || redirecting}
          />
        </div>

        <div className="gf-field">
          <label className="gf-label">CREA / CFT</label>
          <input
            className="gf-input"
            placeholder="Ex.: CREA 12345 / CFT 12"
            value={registroProfissional}
            onChange={(e) => setRegistroProfissional(e.target.value)}
            autoComplete="off"
            disabled={loading || redirecting}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ color: 'var(--gf-muted)', fontSize: 12, marginBottom: 8 }}>
            Tipos de operação (múltiplo)
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {ops.map((op) => {
              const active = tiposOperacao.includes(op.key);
              const disabled = loading || redirecting;

              return (
                <button
                  key={op.key}
                  type="button"
                  onClick={() => toggle(op.key)}
                  disabled={disabled}
                  className="gf-btn"
                  style={{
                    padding: '10px 12px',
                    background: active ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.06)',
                    borderColor: active ? 'rgba(34,197,94,0.55)' : 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.92)',
                    fontWeight: 700,
                    width: 'auto',
                    opacity: disabled ? 0.7 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  {op.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="gf-btn"
          type="submit"
          disabled={loading || redirecting || tiposOperacao.length === 0}
          style={{
            marginTop: 14,
            opacity: loading || redirecting ? 0.85 : 1,
            cursor: loading || redirecting ? 'not-allowed' : 'pointer',
          }}
        >
          {redirecting ? 'Abrindo login...' : loading ? 'Cadastrando...' : 'Cadastrar empresa'}
        </button>

        <div className="gf-linkrow" style={{ marginTop: 12 }}>
          <Link href="/login">Voltar para login</Link>
        </div>

        <div
          className="gf-msg"
          style={{
            display: msg ? 'block' : 'none',
            marginTop: 12,
            color: ok ? 'rgba(34,197,94,.95)' : 'rgba(248,113,113,.95)',
          }}
        >
          {msg}
        </div>
      </form>
    </div>
  );
}


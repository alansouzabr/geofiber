'use client';

import { useEffect, useMemo, useState } from 'react';
import { setToken } from '@/lib/api';
import {
  getSignal,
  listEquipments,
  listProjects,
  listRacks,
  listStations,
  login,
  tickSignal,
  updateSignalConfig,
} from '@/lib/geofiber';
import type { FiberSignal, Rack, RackEquipment, Station } from '@/lib/geofiber';
import type { Project } from '@/lib/types';

function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object') {
    const m = (e as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  return 'Erro';
}

function fmt(n: number) {
  return Number.isFinite(n) ? n.toFixed(2) : '-';
}


function asObj<T>(v: unknown): T | null {
  return v && typeof v === 'object' ? (v as T) : null;
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}


export default function PopPage() {
  const [email, setEmail] = useState('admin@geofiber.local');
  const [password, setPassword] = useState('Admin@12345');
  const [authed, setAuthed] = useState(false);

  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [equipments, setEquipments] = useState<RackEquipment[]>([]);

  const [projectId, setProjectId] = useState('');
  const [stationId, setStationId] = useState('');
  const [rackId, setRackId] = useState('');
  const [equipmentId, setEquipmentId] = useState('');

  const [signal, setSignal] = useState<FiberSignal | null>(null);

  // config
  const [mode, setMode] = useState<'STATIC' | 'RANDOM_WALK'>('RANDOM_WALK');
  const [targetTxDbm, setTargetTxDbm] = useState('2');
  const [targetRxDbm, setTargetRxDbm] = useState('-18');
  const [attenuationDb, setAttenuationDb] = useState('0');
  const [noiseDb, setNoiseDb] = useState('0.3');
  const [steps, setSteps] = useState('30');
  const [tickCount, setTickCount] = useState('10');

  async function doLogin() {
    try {
      setLoading('Autenticando...');
      setErr(null);
      const token = await login(email, password);
      setToken(token);
      setAuthed(true);
    } catch (e: unknown) {
      setAuthed(false);
      setErr(errMsg(e) || 'Falha no login');
    } finally {
      setLoading(null);
    }
  }

  useEffect(() => {
    if (!authed) return;
    (async () => {
      try {
        setLoading('Carregando POPs...');
        setErr(null);
        setProjects(asArray<Project>(await listProjects()));
      } catch (e: unknown) {
        setErr(errMsg(e) || 'Erro');
      } finally {
        setLoading(null);
      }
    })();
  }, [authed]);

  async function onSelectProject(id: string) {
    setProjectId(id);
    setStationId('');
    setRackId('');
    setEquipmentId('');
    setStations([]);
    setRacks([]);
    setEquipments([]);
    setSignal(null);

    if (!id) return;
    try {
      setLoading('Carregando stations...');
      setErr(null);
      setStations(asArray<Station>(await listStations(id)));
    } catch (e: unknown) {
      setErr(errMsg(e) || 'Erro');
    } finally {
      setLoading(null);
    }
  }

  async function onSelectStation(id: string) {
    setStationId(id);
    setRackId('');
    setEquipmentId('');
    setRacks([]);
    setEquipments([]);
    setSignal(null);

    if (!id) return;
    try {
      setLoading('Carregando racks...');
      setErr(null);
      setRacks(asArray<Rack>(await listRacks(id)));
    } catch (e: unknown) {
      setErr(errMsg(e) || 'Erro');
    } finally {
      setLoading(null);
    }
  }

  async function onSelectRack(id: string) {
    setRackId(id);
    setEquipmentId('');
    setEquipments([]);
    setSignal(null);

    if (!id) return;
    try {
      setLoading('Carregando equipamentos...');
      setErr(null);
      setEquipments(asArray<RackEquipment>(await listEquipments(id)));
    } catch (e: unknown) {
      setErr(errMsg(e) || 'Erro');
    } finally {
      setLoading(null);
    }
  }

  async function onSelectEquipment(id: string) {
    setEquipmentId(id);
    setSignal(null);

    if (!id) return;
    try {
      setLoading('Carregando sinal...');
      setErr(null);
      const sig = asObj<FiberSignal>(await getSignal(id));
      setSignal(sig);
      if (sig) {
        
              setMode(sig.mode);
              setTargetTxDbm(String(sig.targetTxDbm));
              setTargetRxDbm(String(sig.targetRxDbm));
              setAttenuationDb(String(sig.attenuationDb));
              setNoiseDb(String(sig.noiseDb));
              setSteps(String(sig.steps));
      }

    } catch (e: unknown) {
      setErr(errMsg(e) || 'Erro');
    } finally {
      setLoading(null);
    }
  }

  async function saveConfig() {
    if (!equipmentId) return;
    try {
      setLoading('Salvando config...');
      setErr(null);
      const updated = await updateSignalConfig(equipmentId, {
        mode,
        targetTxDbm: Number(targetTxDbm),
        targetRxDbm: Number(targetRxDbm),
        attenuationDb: Number(attenuationDb),
        noiseDb: Number(noiseDb),
        steps: Number(steps),
      });
      setSignal(asObj<FiberSignal>(updated));
    } catch (e: unknown) {
      setErr(errMsg(e) || 'Erro');
    } finally {
      setLoading(null);
    }
  }

  async function doTick() {
    if (!equipmentId) return;
    try {
      setLoading('Executando tick...');
      setErr(null);
      const updated = await tickSignal(equipmentId, Number(tickCount));
      setSignal(asObj<FiberSignal>(updated));
    } catch (e: unknown) {
      setErr(errMsg(e) || 'Erro');
    } finally {
      setLoading(null);
    }
  }

  const selectedProject = useMemo(() => projects.find(p => p.id === projectId), [projects, projectId]);
  const selectedStation = useMemo(() => stations.find(s => s.id === stationId), [stations, stationId]);
  const selectedRack = useMemo(() => racks.find(r => r.id === rackId), [racks, rackId]);
  const selectedEq = useMemo(() => equipments.find(e => e.id === equipmentId), [equipments, equipmentId]);

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>GeoFiber • POP Map</h1>
      <div style={{ opacity: 0.75, marginBottom: 12 }}>API: {process.env.NEXT_PUBLIC_API_URL}</div>

      {!authed && (
        <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Login</div>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr auto' }}>
            <input value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid #ccc' }} />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" style={{ padding: 10, borderRadius: 10, border: '1px solid #ccc' }} />
            <button onClick={doLogin} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #333', cursor: 'pointer' }}>
              Entrar
            </button>
          </div>
        </div>
      )}

      {err && <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: '#ffe9e9', border: '1px solid #ffbcbc' }}>{err}</div>}
      {loading && <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: '#f2f2f2', border: '1px solid #e2e2e2' }}>{loading}</div>}

      {authed && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Navegação</div>

            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 700 }}>POP (Project)</div>
              <select value={projectId} onChange={e => onSelectProject(e.target.value)} style={{ marginTop: 6, width: '100%', padding: 10, borderRadius: 10 }}>
                <option value="">Selecione…</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700 }}>Station</div>
              <select value={stationId} onChange={e => onSelectStation(e.target.value)} disabled={!projectId} style={{ marginTop: 6, width: '100%', padding: 10, borderRadius: 10 }}>
                <option value="">Selecione…</option>
                {stations.map(s => <option key={s.id} value={s.id}>{s.name} • {s.type}</option>)}
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700 }}>Rack</div>
              <select value={rackId} onChange={e => onSelectRack(e.target.value)} disabled={!stationId} style={{ marginTop: 6, width: '100%', padding: 10, borderRadius: 10 }}>
                <option value="">Selecione…</option>
                {racks.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700 }}>Equipamento</div>
              <select value={equipmentId} onChange={e => onSelectEquipment(e.target.value)} disabled={!rackId} style={{ marginTop: 6, width: '100%', padding: 10, borderRadius: 10 }}>
                <option value="">Selecione…</option>
                {equipments.map(eq => <option key={eq.id} value={eq.id}>{eq.name} • {eq.type}</option>)}
              </select>
            </div>

            <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: '#fafafa', border: '1px solid #eee' }}>
              <div><b>Selecionado</b></div>
              <div>POP: {selectedProject?.name || '-'}</div>
              <div>Station: {selectedStation?.name || '-'}</div>
              <div>Rack: {selectedRack?.name || '-'}</div>
              <div>Equip: {selectedEq?.name || '-'}</div>
            </div>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Fiber Signal</div>

            {!signal ? (
              <div style={{ opacity: 0.7 }}>Selecione um equipamento.</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ padding: 12, borderRadius: 12, border: '1px solid #eee', background: '#fafafa' }}>
                    <div style={{ fontWeight: 700 }}>Tx (dBm)</div>
                    <div style={{ fontSize: 26, fontWeight: 900 }}>{fmt(signal.txDbm)}</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 12, border: '1px solid #eee', background: '#fafafa' }}>
                    <div style={{ fontWeight: 700 }}>Rx (dBm)</div>
                    <div style={{ fontSize: 26, fontWeight: 900 }}>{fmt(signal.rxDbm)}</div>
                  </div>
                </div>

                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Mode</div>
                    <select value={mode} onChange={e => setMode(e.target.value as FiberSignal['mode'])} style={{ width: '100%', padding: 10, borderRadius: 10 }}>
                      <option value="STATIC">STATIC</option>
                      <option value="RANDOM_WALK">RANDOM_WALK</option>
                    </select>
                  </label>
                  <label>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Steps</div>
                    <input value={steps} onChange={e => setSteps(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ccc' }} />
                  </label>

                  <label>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Target Tx</div>
                    <input value={targetTxDbm} onChange={e => setTargetTxDbm(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ccc' }} />
                  </label>
                  <label>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Target Rx</div>
                    <input value={targetRxDbm} onChange={e => setTargetRxDbm(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ccc' }} />
                  </label>

                  <label>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Attenuation (dB)</div>
                    <input value={attenuationDb} onChange={e => setAttenuationDb(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ccc' }} />
                  </label>
                  <label>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Noise (dB)</div>
                    <input value={noiseDb} onChange={e => setNoiseDb(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ccc' }} />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
                  <button onClick={saveConfig} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #333', cursor: 'pointer' }}>
                    Salvar
                  </button>

                  <input value={tickCount} onChange={e => setTickCount(e.target.value)} style={{ width: 90, padding: 10, borderRadius: 10, border: '1px solid #ccc' }} />
                  <button onClick={doTick} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #333', cursor: 'pointer' }}>
                    Tick
                  </button>

                  <div style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>
                    updated: {new Date(signal.updatedAt).toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

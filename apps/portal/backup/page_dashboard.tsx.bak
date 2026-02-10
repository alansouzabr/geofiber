'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';

function StatCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
      {hint ? <div className="mt-2 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [racks, setRacks] = useState<any[]>([]);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        setErr('');
        setLoading(true);

        const [p, s, r] = await Promise.allSettled([
          apiFetch('/api/projects'),
          apiFetch('/api/stations'),
          apiFetch('/api/racks'),
        ]);

        setProjects(p.status === 'fulfilled' ? (p.value as any[]) : []);
        setStations(s.status === 'fulfilled' ? (s.value as any[]) : []);
        setRacks(r.status === 'fulfilled' ? (r.value as any[]) : []);

        if (p.status === 'rejected' || s.status === 'rejected' || r.status === 'rejected') {
          setErr('Alguns endpoints ainda não existem no backend (normal nesta fase).');
        }
      } catch (e: any) {
        setErr(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => {
    return {
      projects: projects?.length ?? 0,
      stations: stations?.length ?? 0,
      racks: racks?.length ?? 0,
    };
  }, [projects, stations, racks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Visão geral: Projects • Stations • Racks.</p>
      </div>

      {err ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm">{err}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Projects" value={loading ? '...' : String(counts.projects)} hint="Projetos cadastrados" />
        <StatCard title="Stations" value={loading ? '...' : String(counts.stations)} hint="Estações cadastradas" />
        <StatCard title="Racks" value={loading ? '...' : String(counts.racks)} hint="Racks cadastrados" />
      </div>
    </div>
  );
}

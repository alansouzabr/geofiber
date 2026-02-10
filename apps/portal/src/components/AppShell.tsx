'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menu, type Role, hasPermission } from '@/lib/rbac';

export default function AppShell({
  role,
  companyName,
  children,
}: {
  role: Role;
  companyName?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = menu.filter((i) => hasPermission(role, i.perm));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="w-72 border-r border-slate-200 bg-white min-h-screen p-5">
          <div className="mb-6">
            <div className="text-xs text-slate-500">GeoFiber</div>
            <div className="text-xl font-bold text-slate-900">Maps</div>
            <div className="mt-2 text-sm text-slate-600">
              {companyName ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {companyName}
                </span>
              ) : (
                <span className="text-slate-400">Sem empresa selecionada</span>
              )}
            </div>
          </div>

          <nav className="space-y-1">
            {items.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={[
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                    active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
                  ].join(' ')}
                >
                  <span className="text-base">{it.icon || '•'}</span>
                  <span className="font-medium">{it.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500">Perfil</div>
            <div className="text-sm font-semibold text-slate-900">{role}</div>
            <div className="mt-3 text-xs text-slate-500">Menu dinâmico por permissão.</div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-sm text-slate-600">Multiempresa • SaaS-ready</div>
              <div className="flex items-center gap-3">
                <Link className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold" href="/company">
                  Trocar empresa
                </Link>
                <Link className="rounded-xl bg-slate-100 text-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-200" href="/login">
                  Sair
                </Link>
              </div>
            </div>
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

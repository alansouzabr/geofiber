'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';


import { getNavigation } from '@/lib/navigation';

type Props = {
  role?: string | null;
  permissions?: string[];
  companyName?: string;
};

export default function SidebarNavigation({
  role,
  permissions,
  companyName,
}: Props) {

  const pathname = usePathname();

  const items =
    getNavigation(permissions);

  return (
    <aside className="w-72 border-r border-slate-200 bg-white min-h-screen p-5">

      <div className="mb-6">

        <div className="text-xs text-slate-500">
          GeoFiber
        </div>

        <div className="text-xl font-bold text-slate-900">
          Maps
        </div>

        <div className="mt-2 text-sm text-slate-600">

          {companyName ? (

            <span className="inline-flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-emerald-500" />

              {companyName}

            </span>

          ) : (

            <span className="text-slate-400">
              Sem empresa selecionada
            </span>

          )}

        </div>

      </div>

      <nav className="space-y-1">

        {items.map(item => {

          const active =
            pathname === item.href;

          return (

            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100',
              ].join(' ')}
            >

              <span className="text-base">
                {item.icon || '•'}
              </span>

              <span className="font-medium">
                {item.label}
              </span>

            </Link>

          );

        })}

      </nav>

      <div className="mt-8 rounded-2xl border border-slate-200 p-4">

        <div className="text-xs text-slate-500">
          Perfil
        </div>

        <div className="text-sm font-semibold text-slate-900">
          {role}
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Menu dinâmico por permissão.
        </div>

      </div>

    </aside>
  );

}

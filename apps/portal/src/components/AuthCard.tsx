'use client';

import { ReactNode } from 'react';

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
      <div className="mb-6">
        <h1 className="text-xl font-black">{title}</h1>
        {subtitle ? <p className="text-sm opacity-80 mt-1">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

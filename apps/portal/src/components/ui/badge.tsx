import React from 'react';
import clsx from 'clsx';

export function Badge({
  variant = 'ok',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'ok' | 'warn' | 'down' | 'info' }) {
  const v = {
    ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warn: 'bg-amber-50 text-amber-800 border-amber-200',
    down: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }[variant];

  return (
    <span
      className={clsx('inline-flex items-center px-3 py-1 text-xs font-semibold border rounded-full', v, className)}
      {...props}
    />
  );
}

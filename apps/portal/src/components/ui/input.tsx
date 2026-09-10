'use client';

import React from 'react';
import clsx from 'clsx';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, ...props }: Props) {
  return (
    <label className="block">
      {label ? <div className="text-sm font-semibold text-slate-800 mb-1">{label}</div> : null}
      <input
        className={clsx(
          'w-full h-11 rounded-2xl border px-4 outline-none transition bg-white',
          error ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500',
          className
        )}
        {...props}
      />
      {error ? (
        <div className="mt-1 text-xs text-rose-700">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-xs text-slate-500">{hint}</div>
      ) : null}
    </label>
  );
}

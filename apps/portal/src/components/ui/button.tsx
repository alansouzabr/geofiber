'use client';

import React from 'react';
import clsx from 'clsx';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  };
  const variants = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-soft',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-800 hover:bg-slate-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}

import React from 'react';
import clsx from 'clsx';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('rounded-3xl bg-white border border-slate-200 shadow-soft', className)}
      {...props}
    />
  );
}

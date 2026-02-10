'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-xl border bg-[hsl(var(--card))] px-3 py-2 text-sm hover:bg-[hsl(var(--muted))]"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      {isDark ? 'Claro' : 'Escuro'}
    </button>
  );
}

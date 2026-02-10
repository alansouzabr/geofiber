export const dynamic = 'force-dynamic';

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GeoFiber Maps',
  description: 'Next Generation High Fiber Optical - GeoFiber Maps',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

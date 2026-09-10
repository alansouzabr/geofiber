import "leaflet/dist/leaflet.css";
export const dynamic = "force-dynamic";

import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { AuthProvider } from "@/context/AuthContext";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 0.5,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
          <WhatsAppFloat />
        </AuthProvider>
      </body>
    </html>
  );
}

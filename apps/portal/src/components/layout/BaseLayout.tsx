"use client";

import { ReactNode } from "react";

interface BaseLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export default function BaseLayout({
  sidebar,
  header,
  children,
}: BaseLayoutProps) {
  return (
    <div
      className="
        flex
        min-h-screen
        bg-[#020617]
        text-white
      "
    >
      {sidebar}

      <div className="flex-1">
        {header}

        <main className="p-3 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

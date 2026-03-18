"use client";

import { Sidebar } from "./sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-000)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[var(--bg-000)]">
        {children}
      </main>
    </div>
  );
}

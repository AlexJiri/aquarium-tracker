"use client";

import { Nav } from "@/components/nav";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container py-6">{children}</main>
    </div>
  );
}


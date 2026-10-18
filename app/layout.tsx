import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'PathFinder — Hybrid Graph-Relational Professional Intelligence',
  description:
    'A Hybrid DBMS Architecture (PostgreSQL 16 + Neo4j 5) for Multi-Hop Professional Network & Warm-Path Traversal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCarritoStore } from '@/store/carrito';
import type { CarritoStore } from '@/lib/types';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCarritoStore((s: CarritoStore) => s.totalItems());

  useEffect(() => { setMounted(true); }, []);

  // Valor seguro: 0 en servidor, real en cliente
  const displayItems = mounted ? totalItems : 0;

  return (
    <>
      <header className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-600">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-3xl tracking-wider uppercase text-white group-hover:neon-text-smoke transition-all duration-300">
              AL<span className="text-smoke">SHOP</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/drops', label: 'Drops' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs uppercase tracking-[0.2em] text-dark-300 hover:text-smoke transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: cart + mobile menu */}
          <div className="flex items-center gap-4">
            <Link href="/carrito" className="relative group">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dark-200 group-hover:text-neon-cyan transition-colors duration-300">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
              {displayItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-smoke text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-neon-pulse">
                  {displayItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 w-6"
              aria-label="Menú"
            >
              <span className={`block h-0.5 bg-dark-200 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-dark-200 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-dark-200 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-dark-900/98 backdrop-blur-lg transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '52px' }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 p-6">
          {[
            { href: '/', label: 'Inicio' },
            { href: '/drops', label: 'Drops' },
            { href: '/carrito', label: `Carrito (${displayItems})` },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl uppercase tracking-wider text-dark-200 hover:text-smoke active:text-smoke transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
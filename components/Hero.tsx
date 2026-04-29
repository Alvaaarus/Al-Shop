'use client';

import Link from 'next/link';
import SmokeEffect from '@/components/SmokeEffect';
import LightningEffect from '@/components/LightningEffect';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-dark-950">
      {/* Background effects */}
      <SmokeEffect />
      <LightningEffect />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 via-transparent to-dark-950 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-smoke/5 via-transparent to-neon-cyan/5 pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(203,213,225,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(203,213,225,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Tag */}
        <p className="text-[11px] uppercase tracking-[0.3em] text-smoke mb-6 animate-neon-pulse">
          Edición Limitada · Streetwear
        </p>

        {/* Main title with glitch effect */}
        <h1 className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] uppercase leading-[0.85] tracking-wider text-white mb-4">
          <span className="glitch-text" data-text="AL SHOP">AL SHOP</span>
        </h1>

        {/* Subtitle */}
        <p className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.15em] text-dark-300 mb-2">
          Urban <span className="text-neon-cyan">Caps</span>
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-dark-400 max-w-md mx-auto mb-10 leading-relaxed">
          Gorras que hablan por ti. Diseños exclusivos, materiales premium,
          actitud sin límites. Cada pieza es una declaración.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/#catalogo"
            className="group relative px-10 py-4 bg-smoke text-white text-sm uppercase tracking-[0.2em] font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(203,213,225,0.3)]"
          >
            <span className="relative z-10">Ver Catálogo</span>
            <div className="absolute inset-0 bg-smoke-dim transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </Link>

          <Link
            href="/#drops"
            className="px-10 py-4 border border-neon-cyan text-neon-cyan text-sm uppercase tracking-[0.2em] font-medium hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300"
          >
            New Drops
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-dark-500">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-smoke/50 to-transparent" />
    </section>
  );
}
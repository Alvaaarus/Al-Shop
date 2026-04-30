'use client';

import Link from 'next/link';
import SmokeEffect from '@/components/SmokeEffect';
import LightningEffect from '@/components/LightningEffect';
import SilverStarsBackground from '@/components/SilverStarsBackground';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black from-[30%] to-[#001a33]">
      {/* Cielo nocturno: puntos + destellos tipo cruz (muy sutiles) */}
      <SilverStarsBackground dotCount={48} sparkleCount={12} />

      {/* Background effects (atenuados para no competir con las estrellas) */}
      <div className="absolute inset-0 opacity-[0.2]">
        <SmokeEffect />
      </div>
      <div className="absolute inset-0 opacity-[0.12]">
        <LightningEffect />
      </div>

      {/* Vignette ligera para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[#001a33]/55 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-smoke/[0.04] via-transparent to-neon-cyan/[0.06] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(203,213,225,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(203,213,225,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-3xl mx-auto">

        {/* Main title with glitch effect */}
        <h1 className="font-display text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] uppercase leading-[0.85] tracking-wider text-white mb-6 w-full text-center">
          <span className="glitch-text" data-text="AL SHOP">AL SHOP</span>
        </h1>

        {/* Subtitle */}
        <p className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] text-dark-300 mb-10 text-center">
          Urban <span className="text-smoke">Caps</span>
        </p>

        {/* Línea decorativa plata */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-smoke to-transparent mb-10" />

        {/* CTA Buttons — apilados verticalmente */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
          {/* Botón primario — plata sólido */}
          <Link
            href="/drops"
            className="group relative w-full flex items-center justify-center gap-2 px-10 py-4 overflow-hidden transition-all duration-300 active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 40%, #94a3b8 100%)',
              boxShadow: '0 0 18px rgba(203,213,225,0.25), inset 0 1px 0 rgba(255,255,255,0.35)',
            }}
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" className="relative z-10 shrink-0">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="relative z-10 text-[#0a0a0a] text-sm uppercase tracking-[0.25em] font-semibold">
              Ver Limited Drop
            </span>
          </Link>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-dark-500">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-smoke/50 to-transparent" />
    </section>
  );
}
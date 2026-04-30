'use client';

import { useState } from 'react';
import SilverStarsBackground from '@/components/SilverStarsBackground';
import SmokeEffect from '@/components/SmokeEffect';
import LightningEffect from '@/components/LightningEffect';
import ProductCard from '@/components/ProductCard';
import CloudDescentTransition from '@/components/CloudDescentTransition';
import { productos } from '@/data/productos';

export default function DropsPageClient() {
  const [filter, setFilter] = useState<'all' | 'new'>('all');

  const filtered = filter === 'new'
    ? productos.filter((p) => p.nuevo)
    : productos;

  return (
    <>
      {/* Transición de entrada — descenso entre nubes */}
      <CloudDescentTransition />
      {/* ── HERO DROP ─────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black from-[25%] to-[#001a33]">
        <SilverStarsBackground dotCount={60} sparkleCount={16} />

        <div className="absolute inset-0 opacity-[0.18]">
          <SmokeEffect />
        </div>
        <div className="absolute inset-0 opacity-[0.10]">
          <LightningEffect />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#001a33]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-smoke/[0.03] via-transparent to-neon-cyan/[0.05] pointer-events-none" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(203,213,225,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(203,213,225,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <span className="inline-block text-[10px] uppercase tracking-[0.35em] text-neon-yellow mb-6 border border-neon-yellow/30 px-4 py-1.5 animate-neon-pulse">
            Drop Activo · Edición Limitada
          </span>

          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl uppercase leading-[0.85] tracking-wider text-white mb-4">
            <span className="glitch-text" data-text="LIMITED">LIMITED</span>
            <br />
            <span className="text-smoke">DROPS</span>
          </h1>

          <p className="text-sm sm:text-base text-dark-400 max-w-md mx-auto mt-6 leading-relaxed">
            Piezas únicas, cantidades limitadas. Una vez que se agoten, no regresan.
            Asegura la tuya antes que alguien más.
          </p>

          {/* Scroll cue */}
          <div className="mt-10 flex justify-center animate-float">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-dark-500">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-smoke/50 to-transparent" />
      </section>

      {/* ── PRODUCTOS ─────────────────────────────────────────────── */}
      <section id="productos" className="bg-dark-900 py-14 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-14">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neon-yellow mb-2">
                {filtered.length} modelo{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-white">
                Todos los Drops
              </h2>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              {(['all', 'new'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 border ${
                    filter === f
                      ? 'bg-smoke text-dark-950 border-smoke'
                      : 'border-dark-500 text-dark-400 hover:border-smoke hover:text-smoke'
                  }`}
                >
                  {f === 'all' ? 'Todos' : 'Nuevos'}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 animate-stagger">
              {filtered.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-dark-500 text-sm uppercase tracking-widest">Sin resultados</p>
            </div>
          )}

          {/* Divider */}
          <div className="mt-20 h-px bg-gradient-to-r from-transparent via-smoke/25 to-transparent" />
        </div>
      </section>

      {/* ── CTA WhatsApp ──────────────────────────────────────────── */}
      <section className="relative bg-dark-800 py-14 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-smoke/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neon-cyan mb-3">¿Tienes dudas?</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl uppercase tracking-wider text-white mb-4">
            Escríbenos por <span className="text-smoke">WhatsApp</span>
          </h2>
          <p className="text-sm text-dark-400 mb-8 max-w-md mx-auto">
            Respondemos en minutos. Te ayudamos a elegir tu gorra perfecta.
          </p>
          <a
            href="https://wa.me/521XXXXXXXXXX?text=Hola,%20me%20interesa%20una%20gorra%20de%20AL%20SHOP"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-smoke text-white text-sm uppercase tracking-[0.2em] font-medium hover:shadow-[0_0_20px_rgba(203,213,225,0.3)] transition-all duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chatear ahora
          </a>
        </div>
      </section>
    </>
  );
}

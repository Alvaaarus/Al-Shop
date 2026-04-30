'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import SmokePageTransition from '@/components/SmokePageTransition';
import { productos } from '@/data/productos';

const SMOKE_MS = 1180;
const SCROLL_AT_MS = 380;

export default function HomePageClient() {
  const todosLosProductos = productos;
  const [smokeActive, setSmokeActive] = useState(false);
  const [smokeAnimKey, setSmokeAnimKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const transitionTimersRef = useRef<number[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    const frame = window.requestAnimationFrame(() => sync());
    mq.addEventListener('change', sync);
    return () => {
      window.cancelAnimationFrame(frame);
      mq.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
      transitionTimersRef.current = [];
    };
  }, []);

  const scrollToDrops = useCallback(() => {
    const el = document.getElementById('drops');
    el?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, [reducedMotion]);

  const handleLimitedDrop = useCallback(() => {
    if (reducedMotion) {
      scrollToDrops();
      return;
    }

    transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
    transitionTimersRef.current = [];

    setSmokeAnimKey((k) => k + 1);
    setSmokeActive(true);

    transitionTimersRef.current.push(
      window.setTimeout(() => scrollToDrops(), SCROLL_AT_MS)
    );
    transitionTimersRef.current.push(
      window.setTimeout(() => setSmokeActive(false), SMOKE_MS)
    );
  }, [reducedMotion, scrollToDrops]);

  return (
    <>
      <SmokePageTransition
        active={smokeActive}
        reducedMotion={reducedMotion}
        animationKey={smokeAnimKey}
      />

      <Hero onLimitedDropClick={handleLimitedDrop} />

      {todosLosProductos.length > 0 && (
        <section id="drops" className="bg-dark-900 py-14 sm:py-16 md:py-20 scroll-mt-[52px]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8 md:mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neon-yellow mb-2">Todos los modelos</p>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-white">
                  Limited Drops
                </h2>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:mx-0 md:px-0">
              {todosLosProductos.map((producto) => (
                <div key={producto.id} className="flex-shrink-0 w-[82vw] sm:w-[48vw] md:w-auto snap-start">
                  <ProductCard producto={producto} />
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 mt-16">
            <div className="h-px bg-gradient-to-r from-transparent via-smoke/30 to-transparent" />
          </div>
        </section>
      )}

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

'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, use, useMemo, useRef } from 'react';
import { getProductoById, productos } from '@/data/productos';
import { useCarritoStore } from '@/store/carrito';
import { formatPrice, cn } from '@/lib/utils';
import type { Producto } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

type MediaKind = 'imagen' | 'video';

interface MediaSlot {
  kind: MediaKind;
  src: string;
}

function buildMediaSlots(producto: Producto): MediaSlot[] {
  const imagenPrincipal = producto.imagen;
  const lista = producto.imagenes?.length ? producto.imagenes : [imagenPrincipal];
  const img1 = lista[0] ?? imagenPrincipal;
  const img2 = lista.length > 1 ? lista[1] : undefined;
  const slots: MediaSlot[] = [{ kind: 'imagen', src: img1 }];
  if (img2 && img2 !== img1) {
    slots.push({ kind: 'imagen', src: img2 });
  }
  if (producto.video) {
    slots.push({ kind: 'video', src: producto.video });
  }
  return slots;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductoPage({ params }: Props) {
  const { id } = use(params);
  const producto = getProductoById(Number(id));
  if (!producto) notFound();

  const imagenPrincipal = producto.imagen;
  const mediaSlots = useMemo(() => buildMediaSlots(producto), [producto]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = mediaSlots[activeIndex] ?? mediaSlots[0];

  const [agregado, setAgregado] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const agregarItem = useCarritoStore((s) => s.agregarItem);

  // ── Swipe en mobile ──────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Swipe horizontal: dx mayor que dy y al menos 40px
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) {
      setActiveIndex((i) => (i + 1) % mediaSlots.length);
    } else {
      setActiveIndex((i) => (i - 1 + mediaSlots.length) % mediaSlots.length);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) agregarItem(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const relacionados = productos.filter((p) => p.id !== producto.id).slice(0, 4);

  const materialesTexto =
    producto.materiales ??
    [producto.color, producto.talla].filter(Boolean).join(' · ');

  const caracteristicasLista =
    producto.caracteristicas?.length
      ? producto.caracteristicas
      : producto.etiquetas.map((t) => `Detalle: ${t}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-dark-500 mb-6 md:mb-8">
        <Link href="/" className="hover:text-smoke transition-colors duration-300">Inicio</Link>
        <span>/</span>
        <Link href="/drops" className="hover:text-smoke transition-colors duration-300">Limited Drop</Link>
        <span>/</span>
        <span className="text-smoke">{producto.codigo}</span>
      </nav>

      {/* Grid principal */}
      <div
        className={cn(
          'grid gap-8 lg:gap-10 lg:items-start',
          mediaSlots.length > 1
            ? 'lg:grid-cols-[minmax(0,4.5rem)_minmax(0,1fr)_minmax(0,24rem)] xl:grid-cols-[minmax(0,4.5rem)_minmax(0,1fr)_minmax(0,28rem)]'
            : 'lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] xl:max-w-[calc(100%-2rem)] xl:mx-auto'
        )}
      >
        {/* ── Miniaturas ── */}
        {mediaSlots.length > 1 && (
          <div className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 -mx-1 px-1 lg:mx-0 lg:px-0">
            {mediaSlots.map((slot, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={`${slot.kind}-${slot.src}-${idx}`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  className={cn(
                    'relative shrink-0 w-20 h-20 lg:w-full lg:aspect-square overflow-hidden border bg-dark-800 transition-all duration-200 touch-manipulation select-none',
                    isActive
                      ? 'border-smoke ring-1 ring-smoke/40'
                      : 'border-dark-600 active:border-dark-300'
                  )}
                  aria-label={slot.kind === 'video' ? 'Ver video' : `Imagen ${idx + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {slot.kind === 'imagen' ? (
                    <Image
                      src={slot.src}
                      alt={`${producto.nombre} vista ${idx + 1}`}
                      fill
                      className="object-cover pointer-events-none"
                      sizes="80px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900 text-[9px] uppercase tracking-[0.12em] text-neon-cyan gap-0.5 pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                      Video
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Visor principal ── */}
        <div className={cn('order-1 lg:order-2', mediaSlots.length <= 1 && 'xl:col-span-1')}>
          <div
            className="relative aspect-square w-full max-w-3xl mx-auto bg-[#141414] border border-dark-600 select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Badge */}
            {producto.nuevo && (
              <span className="absolute top-3 left-3 z-10 bg-smoke text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 text-white">
                New
              </span>
            )}

            {active.kind === 'imagen' ? (
              <Image
                src={active.src}
                alt={producto.nombre}
                fill
                className="object-contain sm:object-cover object-center pointer-events-none"
                sizes="(max-width: 1024px) 100vw, min(720px, 55vw)"
                priority
                onError={() => {
                  if (active.src !== imagenPrincipal && active.kind === 'imagen') {
                    setActiveIndex(0);
                  }
                }}
              />
            ) : (
              <video
                key={active.src}
                src={active.src}
                controls
                playsInline
                preload="metadata"
                controlsList="nodownload"
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            )}

            {/* Flechas laterales (mobile) */}
            {mediaSlots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => (i - 1 + mediaSlots.length) % mediaSlots.length)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-start pl-2 lg:hidden touch-manipulation z-10 bg-gradient-to-r from-black/25 to-transparent"
                  aria-label="Anterior"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-80">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => (i + 1) % mediaSlots.length)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-end pr-2 lg:hidden touch-manipulation z-10 bg-gradient-to-l from-black/25 to-transparent"
                  aria-label="Siguiente"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-80">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}

            {/* Puntos indicadores (mobile) */}
            {mediaSlots.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-10">
                {mediaSlots.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    className="w-6 h-6 flex items-center justify-center touch-manipulation"
                    aria-label={`Vista ${idx + 1}`}
                  >
                    <span className={cn(
                      'block rounded-full transition-all duration-200',
                      idx === activeIndex ? 'w-4 h-1.5 bg-smoke' : 'w-1.5 h-1.5 bg-white/40'
                    )} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Ficha producto ── */}
        <div
          className={cn(
            'order-3 space-y-6 lg:max-w-md lg:justify-self-end w-full',
            mediaSlots.length <= 1 && 'xl:max-w-md'
          )}
        >
          {producto.categoria && (
            <p className="text-sm text-dark-400 font-normal leading-snug">{producto.categoria}</p>
          )}

          <div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] uppercase tracking-wide text-white leading-tight">
              {producto.nombre}
            </h1>
            <p className="mt-1 text-sm text-dark-300">{producto.color}</p>
          </div>

          <p className="font-display text-3xl sm:text-4xl text-white tabular-nums">{formatPrice(producto.precio)}</p>
          <p className="text-[10px] text-dark-500 uppercase tracking-wider -mt-3">MXN · IVA incluido</p>

          <div className="h-px bg-dark-600" />

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-dark-400 mb-2">Modelo</h2>
            <p className="text-sm text-white">
              <span className="text-dark-500">{producto.codigo}</span>
              <span className="mx-2 text-dark-600">·</span>
              {producto.nombre}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-dark-400 mb-2">Materiales</h2>
            <p className="text-sm text-dark-200 leading-relaxed">{materialesTexto}</p>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-dark-400 mb-3">Características importantes</h2>
            <ul className="space-y-2 text-sm text-dark-200 leading-relaxed">
              {caracteristicasLista.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-smoke" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-dark-400 leading-relaxed border-l-2 border-dark-600 pl-4">
            {producto.descripcion}
          </p>

          {/* Cantidad + Agregar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex items-center border border-dark-600 h-12 bg-dark-900/50">
              <button
                type="button"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="w-12 h-full flex items-center justify-center text-xl text-dark-300 hover:bg-dark-800 active:bg-dark-700 transition-colors touch-manipulation"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium text-white">{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                className="w-12 h-full flex items-center justify-center text-xl text-dark-300 hover:bg-dark-800 active:bg-dark-700 transition-colors touch-manipulation"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAgregar}
              disabled={producto.stock === 0}
              className={cn(
                'flex-1 h-12 text-sm uppercase tracking-[0.15em] font-medium transition-all duration-300 rounded-none touch-manipulation',
                agregado
                  ? 'bg-neon-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : producto.stock === 0
                    ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                    : 'bg-white text-dark-950 active:bg-dark-200'
              )}
            >
              {agregado ? '✓ Agregado' : producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>

          {producto.stock > 0 && producto.stock <= 8 && (
            <p className="text-[10px] uppercase tracking-wider text-neon-red">
              Solo quedan {producto.stock} unidades
            </p>
          )}

          <a
            href={`https://wa.me/521XXXXXXXXXX?text=Hola,%20me%20interesa%20la%20gorra%20${producto.codigo}%20%E2%80%93%20${producto.nombre}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-dark-600 h-12 text-sm text-dark-300 hover:border-neon-cyan hover:text-neon-cyan active:border-neon-cyan active:text-neon-cyan transition-all duration-300 uppercase tracking-[0.12em] touch-manipulation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar por WhatsApp
          </a>

          <div className="flex items-center gap-2 pt-2 border-t border-dark-700">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="12" height="12" viewBox="0 0 24 24"
                  fill={star <= Math.round(producto.rating) ? '#CBD5E1' : 'none'}
                  stroke="#CBD5E1" strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-dark-500">
              {producto.rating} · {producto.reviews} reseñas
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-16 mb-12">
        {producto.etiquetas.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-dark-800 border border-dark-600 text-[10px] uppercase tracking-[0.2em] text-dark-400"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Relacionados */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wider text-white">
            También te puede gustar
          </h2>
          <Link
            href="/drops"
            className="text-[10px] uppercase tracking-[0.2em] text-dark-400 hover:text-smoke transition-colors duration-300"
          >
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {relacionados.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

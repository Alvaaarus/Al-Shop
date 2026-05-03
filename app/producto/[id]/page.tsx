'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, use, useMemo, useRef } from 'react';
import { getProductoById, productos } from '@/data/productos';
import { useCarritoStore } from '@/store/carrito';
import { formatPrice, cn, WA_NUMBER } from '@/lib/utils';
import type { Producto } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import SmokeEffect from '@/components/SmokeEffect';
import LightningEffect from '@/components/LightningEffect';
import SilverStarsBackground from '@/components/SilverStarsBackground';

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
      : producto.etiquetas;

  // ── ATMÓSFERA DINÁMICA ──────────────────────────────────────
  const atmosphere = useMemo(() => {
    const tags = producto.etiquetas.map(t => t.toLowerCase());
    const name = producto.nombre.toLowerCase();
    
    // Colores por defecto
    let glowColor = 'rgba(6, 182, 212, 0.15)'; // Cyan
    let secondaryGlow = 'rgba(203, 213, 225, 0.08)'; // Smoke
    let lightningOpacity = 0.10;
    let starsDensity = 60;
    let sparkleCount = 16;

    // Lógica por palabras clave
    if (tags.includes('rosa') || name.includes('rosa')) {
      glowColor = 'rgba(236, 72, 153, 0.18)'; // Rosa/Fuchsia
      secondaryGlow = 'rgba(192, 38, 211, 0.10)';
    } else if (tags.includes('cyan') || tags.includes('skyblue') || name.includes('skyblue')) {
      glowColor = 'rgba(34, 211, 238, 0.18)'; // Cyan brillante
    } else if (tags.includes('chrome') || tags.includes('metálico') || name.includes('chrome')) {
      glowColor = 'rgba(248, 250, 252, 0.15)'; // Blanco/Plata
      sparkleCount = 24; // Más brillo para metálicos
    } else if (tags.includes('rhinestones') || name.includes('canelo')) {
      glowColor = 'rgba(255, 255, 255, 0.12)';
      sparkleCount = 32; // Máximo brillo para joyería
      starsDensity = 80;
    }

    if (tags.includes('rudo') || tags.includes('agresivo')) {
      lightningOpacity = 0.20; // Más rayos para estilos rudos
    }

    return { glowColor, secondaryGlow, lightningOpacity, starsDensity, sparkleCount };
  }, [producto]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black from-[25%] to-[#001a33]">
      {/* ── ATMOSPHERE ────────────────────────────────────────────────── */}
      <SilverStarsBackground dotCount={atmosphere.starsDensity} sparkleCount={atmosphere.sparkleCount} />

      {/* Atmospherics */}
      <div className="absolute inset-0 opacity-[0.18] pointer-events-none">
        <SmokeEffect />
      </div>
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ opacity: atmosphere.lightningOpacity }}
      >
        <LightningEffect />
      </div>

      {/* Vignettes */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#001a33]/60 pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          background: `linear-gradient(90deg, rgba(203,213,225,0.03) 0%, transparent 50%, ${atmosphere.glowColor.replace('0.15', '0.05').replace('0.18', '0.05')} 100%)` 
        }}
      />

      {/* Dynamic Ambient Glow matching the cap's colors */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-start justify-center opacity-[0.12]">
        <div 
          className="relative w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] blur-[140px] sm:blur-[180px] rounded-full translate-y-[-20%]"
          style={{ backgroundColor: atmosphere.glowColor }}
        >
          <Image
            src={producto.imagen}
            alt=""
            fill
            className="object-cover mix-blend-screen opacity-60"
            priority
          />
        </div>
      </div>

      {/* Subtle urban grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(203,213,225,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(203,213,225,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
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
            'order-3 space-y-8 lg:max-w-md lg:justify-self-end w-full',
            mediaSlots.length <= 1 && 'xl:max-w-md'
          )}
        >
          {/* ── Header Producto ── */}
          <div className="space-y-4">
            {producto.categoria && (
              <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-neon-cyan px-2 py-0.5 border border-neon-cyan/30 bg-neon-cyan/5">
                {producto.categoria}
              </span>
            )}
            
            <div>
              <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white leading-[0.95]">
                {producto.nombre}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm text-dark-300 font-medium">{producto.color}</span>
                <span className="w-1 h-1 rounded-full bg-dark-600" />
                <span className="text-xs text-dark-500 tracking-wider uppercase">{producto.codigo}</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-3">
                <p className="font-display text-4xl text-white tabular-nums tracking-tight">
                  {formatPrice(producto.precio)}
                </p>
                <span className="text-[10px] text-dark-500 uppercase tracking-[0.15em]">MXN · IVA incluido</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-dark-600 via-dark-700 to-transparent" />

          {/* ── Detalles Técnicos ── */}
          <div className="grid gap-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center border border-dark-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-smoke">
                  <path d="M20 7h-9m9 4h-9m9 4h-9M4 7h2m-2 4h2m-2 4h2" />
                </svg>
              </div>
              <div className="space-y-1">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-500">Materiales</h2>
                <p className="text-sm text-dark-200 leading-relaxed font-light">{materialesTexto}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center border border-dark-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-smoke">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="space-y-3">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-500">Características</h2>
                <ul className="grid gap-2">
                  {caracteristicasLista.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-sm text-dark-100 group/item">
                      <div className="mt-1 flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-smoke/60 group-hover/item:text-smoke transition-colors">
                          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
                        </svg>
                      </div>
                      <span className="font-light tracking-wide uppercase text-[11px] opacity-85 group-hover/item:opacity-100 transition-opacity">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Descripción ── */}
          <div className="relative pt-2">
            <div className="absolute left-0 top-2 bottom-0 w-0.5 bg-gradient-to-b from-smoke/30 via-smoke/10 to-transparent" />
            <p className="text-[13px] text-dark-400 leading-relaxed pl-5 font-light italic">
              {producto.descripcion}
            </p>
          </div>

          {/* ── Acciones de Compra ── */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center border border-dark-600 h-14 bg-dark-950/80 backdrop-blur-sm group transition-colors hover:border-dark-400">
                <button
                  type="button"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-12 h-full flex items-center justify-center text-xl text-dark-400 hover:text-white transition-colors touch-manipulation"
                >
                  −
                </button>
                <span className="w-10 text-center text-base font-display text-white">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                  className="w-12 h-full flex items-center justify-center text-xl text-dark-400 hover:text-white transition-colors touch-manipulation"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAgregar}
                disabled={producto.stock === 0}
                className={cn(
                  'flex-1 h-14 text-xs uppercase tracking-[0.25em] font-bold transition-all duration-500 relative overflow-hidden group',
                  agregado
                    ? 'bg-neon-cyan text-white shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                    : producto.stock === 0
                      ? 'bg-dark-800 text-dark-600 cursor-not-allowed'
                      : 'bg-white text-dark-950 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]'
                )}
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none" />
                <span className="relative z-10">
                  {agregado ? '✓ Agregado con éxito' : producto.stock === 0 ? 'Agotado' : 'Añadir a la colección'}
                </span>
              </button>
            </div>

            {producto.stock > 0 && producto.stock <= 5 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-neon-red/5 border border-neon-red/20">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-red animate-pulse" />
                <p className="text-[10px] uppercase tracking-[0.15em] text-neon-red font-bold">
                  Stock crítico: Solo {producto.stock} {producto.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}
                </p>
              </div>
            )}

            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hola,%20me%20interesa%20la%20gorra%20${producto.codigo}%20%E2%80%93%20${producto.nombre}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full h-14 text-[11px] font-bold uppercase tracking-[0.2em] text-dark-300 border border-dark-700/50 hover:border-smoke/40 hover:text-smoke transition-all duration-300 group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-70 group-hover:opacity-100 transition-opacity">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Preguntar disponibilidad
            </a>
          </div>

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
    </div>
  );
}

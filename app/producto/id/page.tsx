'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, use } from 'react';
import { getProductoById, productos } from '@/data/productos';
import { useCarritoStore } from '@/store/carrito';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductoPage({ params }: Props) {
  const { id } = use(params);
  const producto = getProductoById(Number(id));
  if (!producto) notFound();

  const [agregado, setAgregado] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const agregarItem = useCarritoStore((s) => s.agregarItem);

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) agregarItem(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const relacionados = productos.filter((p) => p.id !== producto.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-dark-500 mb-8">
        <Link href="/" className="hover:text-smoke transition-colors duration-300">Inicio</Link>
        <span>/</span>
        <Link href="/#catalogo" className="hover:text-smoke transition-colors duration-300">Catálogo</Link>
        <span>/</span>
        <span className="text-smoke">{producto.codigo}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
        {/* Image */}
        <div className="relative">
          {producto.nuevo && (
            <span className="absolute top-4 left-4 z-10 bg-smoke text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 animate-neon-pulse">
              New
            </span>
          )}
          <div className="relative aspect-square bg-dark-800 border border-dark-600 overflow-hidden">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-dark-500 mb-2">{producto.codigo}</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-white mb-4">
            {producto.nombre}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill={star <= Math.round(producto.rating) ? '#CBD5E1' : 'none'}
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-dark-400">{producto.rating} ({producto.reviews} reseñas)</span>
          </div>

          {/* Price */}
          <p className="font-display text-5xl text-white mb-1">
            {formatPrice(producto.precio)}
          </p>
          <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-6">MXN · IVA incluido</p>

          {/* Description */}
          <p className="text-sm text-dark-400 leading-relaxed mb-8 border-l-2 border-smoke/30 pl-4">
            {producto.descripcion}
          </p>

          {/* Quick details */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { label: 'Talla', value: producto.talla },
              { label: 'Color', value: producto.color },
              { label: 'Material', value: '100% Algodón' },
              { label: 'Cierre', value: 'Snapback' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-dark-800 border border-dark-600 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark-500 mb-1">{label}</p>
                <p className="text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center border border-dark-600 h-12">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="w-12 h-full flex items-center justify-center text-xl text-dark-300 hover:bg-dark-700 transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium text-white">{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                className="w-12 h-full flex items-center justify-center text-xl text-dark-300 hover:bg-dark-700 transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAgregar}
              disabled={producto.stock === 0}
              className={`flex-1 h-12 text-sm uppercase tracking-[0.15em] font-medium transition-all duration-300 ${
                agregado
                  ? 'bg-neon-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : producto.stock === 0
                    ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                    : 'bg-smoke text-white hover:shadow-[0_0_20px_rgba(203,213,225,0.3)]'
              }`}
            >
              {agregado ? '✓ Agregado' : producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>

          {/* Stock warning */}
          {producto.stock > 0 && producto.stock <= 8 && (
            <p className="text-[10px] uppercase tracking-wider text-neon-red mt-3">
              Solo quedan {producto.stock} unidades
            </p>
          )}

          {/* WhatsApp */}
          <a
            href={`https://wa.me/521XXXXXXXXXX?text=Hola,%20me%20interesa%20la%20gorra%20${producto.codigo}%20–%20${producto.nombre}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 border border-dark-600 h-12 text-sm text-dark-400 hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 uppercase tracking-[0.15em]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-16">
        {producto.etiquetas.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-dark-800 border border-dark-600 text-[10px] uppercase tracking-[0.2em] text-dark-400">
            #{tag}
          </span>
        ))}
      </div>

      {/* Related products */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-wider text-white">También te puede gustar</h2>
          <Link href="/#catalogo" className="text-[10px] uppercase tracking-[0.2em] text-dark-400 hover:text-smoke transition-colors duration-300">
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
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Producto } from '@/lib/types';
import { useCarritoStore } from '@/store/carrito';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const agregarItem = useCarritoStore((s) => s.agregarItem);

  return (
    <div className="group relative bg-dark-800 border border-dark-600 overflow-hidden transition-all duration-500 hover:border-smoke/50 hover:shadow-[0_0_15px_rgba(203,213,225,0.1)]">
      {/* New badge */}
      {producto.nuevo && (
        <span className="absolute top-3 left-3 z-10 bg-smoke text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 animate-neon-pulse">
          New
        </span>
      )}

      {/* Image */}
      <Link href={`/producto/${producto.id}`} className="block relative aspect-square bg-dark-700 overflow-hidden">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 65vw, (max-width: 768px) 45vw, 25vw"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-dark-400 mb-1">{producto.codigo}</p>
        <Link href={`/producto/${producto.id}`}>
          <h3 className="font-display text-xl uppercase tracking-wide text-white group-hover:text-smoke transition-colors duration-300 truncate">
            {producto.nombre}
          </h3>
        </Link>

        {/* Color tag */}
        <p className="text-[11px] text-dark-400 mt-1">{producto.color}</p>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-4">
          <p className="font-display text-2xl text-white">
            {formatPrice(producto.precio)}
          </p>
          <button
            onClick={() => agregarItem(producto)}
            className="w-10 h-10 flex items-center justify-center border border-dark-500 text-dark-300 hover:border-neon-cyan hover:text-neon-cyan hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300"
            aria-label="Agregar al carrito"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
            </svg>
          </button>
        </div>

        {/* Stock warning */}
        {producto.stock > 0 && producto.stock <= 5 && (
          <p className="text-[10px] uppercase tracking-wider text-neon-red mt-2">
            Solo {producto.stock} left
          </p>
        )}
      </div>

      {/* Bottom neon line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-smoke via-neon-cyan to-smoke transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
}

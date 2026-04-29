'use client';

import { useState, useMemo } from 'react';
import { productos } from '@/data/productos';
import ProductCard from '@/components/ProductCard';

const FILTROS = ['Todos', 'Nuevos', 'Precio ↑', 'Precio ↓'];

export default function ProductGrid() {
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  const productosFiltrados = useMemo(() => {
    let lista = [...productos];
    switch (filtroActivo) {
      case 'Nuevos':
        return lista.filter((p) => p.nuevo);
      case 'Precio ↑':
        return lista.sort((a, b) => a.precio - b.precio);
      case 'Precio ↓':
        return lista.sort((a, b) => b.precio - a.precio);
      default:
        return lista;
    }
  }, [filtroActivo]);

  return (
    <section id="catalogo" className="py-20 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neon-cyan mb-2">Colección</p>
            <h2 className="font-display text-5xl md:text-6xl uppercase tracking-wider text-white">
              Catálogo
            </h2>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {FILTROS.map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroActivo(filtro)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] border transition-all duration-300 ${
                  filtroActivo === filtro
                    ? 'border-smoke text-smoke bg-smoke/10 shadow-[0_0_10px_rgba(203,213,225,0.12)]'
                    : 'border-dark-600 text-dark-400 hover:border-dark-400 hover:text-dark-200'
                }`}
              >
                {filtro}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-4xl uppercase text-dark-600">Sin resultados</p>
            <p className="text-sm text-dark-500 mt-2">No hay productos con este filtro</p>
          </div>
        )}
      </div>

      {/* Top decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-smoke/30 to-transparent mb-0" />
    </section>
  );
}
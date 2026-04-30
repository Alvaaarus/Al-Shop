'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCarritoStore } from '@/store/carrito';
import { formatPrice } from '@/lib/utils';

export default function CarritoPage() {
  const { items, quitarItem, actualizarCantidad, limpiarCarrito, totalPrecio } = useCarritoStore();

  const total = totalPrecio();
  const envio = total >= 500 ? 0 : 99;
  const totalFinal = total + envio;

  const mensajeWA = encodeURIComponent(
    `Hola! Quiero hacer un pedido de AL SHOP:\n\n` +
    items.map((i) => `• ${i.codigo} – ${i.nombre} x${i.cantidad} = $${(i.precio * i.cantidad).toFixed(0)} MXN`).join('\n') +
    `\n\nEnvío: $${envio === 0 ? 'GRATIS' : envio + ' MXN'}` +
    `\nTOTAL: $${totalFinal.toFixed(0)} MXN\n\n¿Cómo procedo?`
  );

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <p className="font-display text-6xl md:text-8xl uppercase text-dark-700 mb-4">Vacío</p>
        <p className="text-sm text-dark-500 mb-8">Aún no has agregado ninguna gorra.</p>
        <Link
          href="/#drops"
          className="inline-block px-10 py-4 bg-smoke text-white text-sm uppercase tracking-[0.2em] font-medium hover:shadow-[0_0_20px_rgba(203,213,225,0.3)] transition-all duration-300"
        >
          Ver drops
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neon-cyan mb-1">Mi pedido</p>
          <h1 className="font-display text-5xl md:text-6xl uppercase tracking-wider text-white">Carrito</h1>
        </div>
        <button
          onClick={limpiarCarrito}
          className="text-[10px] uppercase tracking-[0.2em] text-dark-500 hover:text-neon-red transition-colors duration-300"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border border-dark-600 bg-dark-800 p-4 hover:border-smoke/30 transition-all duration-300"
            >
              {/* Image */}
              <Link href={`/producto/${item.id}`} className="flex-shrink-0">
                <div className="relative w-20 h-20 bg-dark-700 overflow-hidden">
                  <Image
                    src={item.imagen}
                    alt={item.nombre}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark-500 mb-0.5">{item.codigo}</p>
                <Link href={`/producto/${item.id}`}>
                  <h3 className="font-display text-lg uppercase tracking-wide text-white hover:text-smoke transition-colors duration-300 truncate">
                    {item.nombre}
                  </h3>
                </Link>
                <p className="text-[11px] text-dark-500 mt-1">{item.color} · {item.talla}</p>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-dark-600 h-8">
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      className="w-8 h-full text-sm text-dark-300 hover:bg-dark-700 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-xs font-medium text-white">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      className="w-8 h-full text-sm text-dark-300 hover:bg-dark-700 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Price + delete */}
                  <div className="flex items-center gap-4">
                    <p className="font-display text-xl text-white">
                      {formatPrice(item.precio * item.cantidad)}
                    </p>
                    <button
                      onClick={() => quitarItem(item.id)}
                      className="text-dark-500 hover:text-neon-red transition-colors duration-300"
                      aria-label="Eliminar"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="border border-dark-600 bg-dark-800 p-6 sticky top-20">
            <h2 className="font-display text-2xl uppercase tracking-wider text-white mb-6">Resumen</h2>

            <div className="flex flex-col gap-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-dark-400">Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
                <span className="font-medium text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Envío</span>
                <span className={envio === 0 ? 'text-neon-cyan font-medium' : 'font-medium text-white'}>
                  {envio === 0 ? 'GRATIS' : formatPrice(envio)}
                </span>
              </div>
              {envio > 0 && (
                <p className="text-[10px] text-dark-500 bg-dark-700 p-2">
                  Agrega {formatPrice(500 - total)} más para envío gratis
                </p>
              )}
            </div>

            <div className="border-t border-dark-600 pt-4 mb-6">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium uppercase tracking-wide text-dark-300">Total</span>
                <span className="font-display text-3xl text-white">{formatPrice(totalFinal)}</span>
              </div>
              <p className="text-[10px] text-dark-500 text-right mt-1">MXN · IVA incluido</p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/521XXXXXXXXXX?text=${mensajeWA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-smoke text-white text-sm uppercase tracking-[0.15em] font-medium hover:shadow-[0_0_20px_rgba(203,213,225,0.3)] transition-all duration-300 mb-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir por WhatsApp
            </a>

            <Link
              href="/drops"
              className="w-full flex items-center justify-center py-3 border border-dark-600 text-sm text-dark-400 uppercase tracking-[0.15em] hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300"
            >
              ← Seguir comprando
            </Link>

            {/* Guarantees */}
          </div>
        </div>
      </div>
    </div>
  );
}
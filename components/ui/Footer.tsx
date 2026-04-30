'use client';

import NextLink from 'next/link';
import { Link, Separator, Button } from '@heroui/react';
import { WA_NUMBER } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="relative bg-dark-900 border-t border-dark-800 overflow-hidden">
      {/* Subtle glow background for premium feel */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] bg-smoke/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand & Description (Takes 2 columns on desktop) */}
          <div className="md:col-span-2">
            <Link as={NextLink} href="/" className="mb-4 inline-block">
              <p className="font-display text-4xl tracking-widest uppercase text-white hover:opacity-80 transition-opacity">
                AL<span className="text-smoke">SHOP</span>
              </p>
            </Link>
            <p className="text-sm text-dark-400 leading-relaxed max-w-sm mb-6">
              Gorras urbanas de edición limitada. Streetwear premium con diseños
              exclusivos. Asegura la tuya antes de que desaparezcan.
            </p>

            {/* Social Buttons with HeroUI */}
            <div className="flex gap-3">
              <Button
                as={Link}
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                isIconOnly
                variant="flat"
                radius="full"
                className="bg-dark-800 text-smoke hover:bg-smoke hover:text-dark-950 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </Button>
              <Button
                as={Link}
                href="https://instagram.com/alshop"
                target="_blank"
                rel="noopener noreferrer"
                isIconOnly
                variant="flat"
                radius="full"
                className="bg-dark-800 text-smoke hover:bg-smoke hover:text-dark-950 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neon-cyan mb-5">
              Explorar
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/drops', label: 'Limited Drop' },
                { href: '/carrito', label: 'Carrito' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    as={NextLink}
                    href={item.href}
                    className="text-sm text-dark-400 hover:text-smoke transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Info */}
         
        </div>

        {/* HeroUI Separator */}
        <Separator className="my-10 bg-dark-700/40" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] tracking-widest text-dark-500 uppercase">
            © {new Date().getFullYear()} AL SHOP. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <span className="text-[10px] text-dark-600 uppercase tracking-widest">
              Premium Streetwear
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
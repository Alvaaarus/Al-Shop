'use client';

import { useEffect, useState } from 'react';

/**
 * Overlay de entrada tipo "descenso entre nubes".
 * Se muestra al montar la página y se desmonta automáticamente
 * tras completar la animación (~1.85 s).
 * Optimizado para mobile: sin canvas, solo CSS + SVG ligero.
 */
export default function CloudDescentTransition() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Desmontamos el componente tras la duración de la animación
    const timer = window.setTimeout(() => setVisible(false), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="cloud-descent-overlay fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, rgba(180,210,235,0.07) 0%, rgba(220,235,245,0.10) 40%, rgba(255,255,255,0.04) 100%)' }}
    >
      {/* Wisp A — izquierda, grande */}
      <div
        className="cloud-wisp-a absolute"
        style={{ left: '-15%', top: '20%', width: '70vw', height: '30vh' }}
      >
        <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full">
          <ellipse cx="250" cy="100" rx="240" ry="85"
            fill="rgba(220,235,248,0.38)"
            filter="url(#blur-a)" />
          <ellipse cx="170" cy="80" rx="130" ry="60"
            fill="rgba(235,245,255,0.30)" />
          <defs>
            <filter id="blur-a" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Wisp B — derecha, mediana */}
      <div
        className="cloud-wisp-b absolute"
        style={{ right: '-10%', top: '30%', width: '55vw', height: '22vh' }}
      >
        <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="w-full h-full">
          <ellipse cx="200" cy="80" rx="185" ry="68"
            fill="rgba(210,230,248,0.34)"
            filter="url(#blur-b)" />
          <ellipse cx="280" cy="65" rx="110" ry="50"
            fill="rgba(230,242,255,0.26)" />
          <defs>
            <filter id="blur-b" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Wisp C — centro-superior, muy suave */}
      <div
        className="cloud-wisp-c absolute"
        style={{ left: '10%', top: '5%', width: '80vw', height: '18vh' }}
      >
        <svg viewBox="0 0 600 140" preserveAspectRatio="none" className="w-full h-full">
          <ellipse cx="300" cy="70" rx="290" ry="58"
            fill="rgba(200,225,245,0.28)"
            filter="url(#blur-c)" />
          <defs>
            <filter id="blur-c" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Wisp D — inferior izquierda, difuminado */}
      <div
        className="cloud-wisp-d absolute"
        style={{ left: '-5%', top: '55%', width: '50vw', height: '20vh' }}
      >
        <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full">
          <ellipse cx="200" cy="75" rx="180" ry="62"
            fill="rgba(215,235,250,0.32)"
            filter="url(#blur-d)" />
          <defs>
            <filter id="blur-d" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="20" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

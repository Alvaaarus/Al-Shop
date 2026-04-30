'use client';

import { useMemo } from 'react';

/** Punto lejano (estrella diminuta). */
function DistantDot({
  left,
  top,
  sizePx,
  duration,
  delay,
}: {
  left: number;
  top: number;
  sizePx: number;
  duration: number;
  delay: number;
}) {
  return (
    <span
      className="absolute"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <span
        className="star-twinkle-dot block rounded-full bg-[rgba(248,250,252,0.82)]"
        style={{
          width: sizePx,
          height: sizePx,
          boxShadow: '0 0 3px rgba(255,255,255,0.2)',
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    </span>
  );
}

/** Destello tipo cruz/glint con halo suave (poco densos, muy sutiles). */
function SparkleGlint({
  left,
  top,
  sizePx,
  rotationDeg,
  duration,
  delay,
  eightPoint,
}: {
  left: number;
  top: number;
  sizePx: number;
  rotationDeg: number;
  duration: number;
  delay: number;
  eightPoint: boolean;
}) {
  return (
    <div
      className="sparkle-star-wrap absolute"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: sizePx,
        height: sizePx,
        transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
      aria-hidden
    >
      <div className="relative size-full">
        <div className="sparkle-soft-glow" />
        <div className="sparkle-ray-cross-v" />
        <div className="sparkle-ray-cross-h" />
        {eightPoint && (
          <>
            <div className="sparkle-ray-diag" />
            <div className="sparkle-ray-diag sparkle-ray-diag-alt" />
          </>
        )}
        <div className="sparkle-hot-core" />
      </div>
    </div>
  );
}

interface SilverStarsBackgroundProps {
  /** Cantidad de puntos distantes */
  dotCount?: number;
  /** Cantidad de destellos tipo cruz (bajo para mantener minimalismo) */
  sparkleCount?: number;
}

export default function SilverStarsBackground({
  dotCount = 46,
  sparkleCount = 11,
}: SilverStarsBackgroundProps) {
  const dots = useMemo(() => {
    return Array.from({ length: dotCount }, (_, i) => {
      const u = Math.sin(i * 127.1) * 43758.5453;
      const r = u - Math.floor(u);
      const u2 = Math.cos(i * 269.5) * 12345.6789;
      const r2 = u2 - Math.floor(u2);
      const left = r * 100;
      const top = r2 * 100;
      const sizePx = 1 + (i % 2);
      const duration = 5 + (i % 6) * 0.75;
      const delay = (i * 0.31) % 7;
      return { left, top, sizePx, duration, delay };
    });
  }, [dotCount]);

  const sparkles = useMemo(() => {
    return Array.from({ length: sparkleCount }, (_, i) => {
      const u = Math.sin(i * 419.2 + 2) * 27182.81828;
      const r = u - Math.floor(u);
      const u2 = Math.cos(i * 193.7 + 1) * 91823.991;
      const r2 = u2 - Math.floor(u2);
      const left = 8 + r * 84;
      const top = 6 + r2 * 88;
      const sizePx = 10 + (i % 5) * 2;
      const rotationDeg = (i * 47.3) % 360;
      const duration = 5.5 + (i % 4) * 1.1;
      const delay = (i * 0.67) % 5;
      const eightPoint = i % 3 !== 0;
      return { left, top, sizePx, rotationDeg, duration, delay, eightPoint };
    });
  }, [sparkleCount]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((d, i) => (
        <DistantDot key={`d-${i}`} {...d} />
      ))}
      {sparkles.map((s, i) => (
        <SparkleGlint key={`s-${i}`} {...s} />
      ))}
    </div>
  );
}

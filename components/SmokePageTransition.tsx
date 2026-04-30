'use client';

import { cn } from '@/lib/utils';

interface Props {
  active: boolean;
  reducedMotion: boolean;
  animationKey: number;
}

/**
 * Cortina de humo que sube por la pantalla al navegar a la sección de drops.
 */
export default function SmokePageTransition({ active, reducedMotion, animationKey }: Props) {
  if (reducedMotion) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[95] overflow-hidden pointer-events-none transition-opacity duration-150',
        active ? 'opacity-100' : 'opacity-0 invisible'
      )}
      aria-hidden
    >
      {active && (
        <>
          <div className="absolute inset-0 bg-dark-950/45 backdrop-blur-[2px]" />
          <div
            key={animationKey}
            className="absolute inset-x-[-8%] bottom-0 top-[-25%] animate-smoke-page-wipe"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/95 via-[38%] to-transparent opacity-[0.97]" />
            <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-smoke/[0.07] via-transparent to-transparent blur-3xl" />
            <div className="absolute inset-x-[10%] bottom-[5%] h-[48%] rounded-[50%] bg-smoke/[0.04] blur-3xl animate-smoke-page-wisp" />
          </div>
        </>
      )}
    </div>
  );
}

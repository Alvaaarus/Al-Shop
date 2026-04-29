'use client';

import { useEffect, useRef } from 'react';

interface SmokeParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function SmokeEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: SmokeParticle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createParticle = (): SmokeParticle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 60 + 30,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(Math.random() * 0.5 + 0.2),
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 300 + 150,
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (particles.length < 15 && Math.random() > 0.92) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;
        p.size += 0.15;

        // Fade in then out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.2) {
          p.opacity = lifeRatio * 0.06;
        } else if (lifeRatio > 0.6) {
          p.opacity = (1 - lifeRatio) * 0.06;
        } else {
          p.opacity = 0.06;
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Draw smoke with white-smoke tint
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(203, 213, 225, ${p.opacity})`);
        gradient.addColorStop(0.5, `rgba(148, 163, 184, ${p.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(100, 116, 139, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}

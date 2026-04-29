'use client';

import { useEffect, useRef } from 'react';

interface LightningBolt {
  points: { x: number; y: number }[];
  opacity: number;
  life: number;
  color: string;
}

export default function LightningEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bolts: LightningBolt[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const generateBolt = (startX: number, startY: number, endX: number, endY: number): { x: number; y: number }[] => {
      const points: { x: number; y: number }[] = [{ x: startX, y: startY }];
      const segments = 8 + Math.floor(Math.random() * 6);
      const dx = (endX - startX) / segments;
      const dy = (endY - startY) / segments;

      for (let i = 1; i < segments; i++) {
        const offsetX = (Math.random() - 0.5) * 80;
        points.push({
          x: startX + dx * i + offsetX,
          y: startY + dy * i,
        });
      }
      points.push({ x: endX, y: endY });
      return points;
    };

    const createBolt = () => {
      const startX = Math.random() * canvas.width;
      const startY = 0;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = canvas.height * (0.3 + Math.random() * 0.5);

      bolts.push({
        points: generateBolt(startX, startY, endX, endY),
        opacity: 1,
        life: 0,
        color: Math.random() > 0.5 ? '#CBD5E1' : '#06B6D4',
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Random bolt creation
      if (Math.random() > 0.998) {
        createBolt();
      }

      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        bolt.life++;
        bolt.opacity = Math.max(0, 1 - bolt.life / 12);

        if (bolt.opacity <= 0) {
          bolts.splice(i, 1);
          continue;
        }

        // Glow
        ctx.shadowColor = bolt.color;
        ctx.shadowBlur = 12;
        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = bolt.opacity;

        ctx.beginPath();
        bolt.points.forEach((point, idx) => {
          if (idx === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();

        // Core (brighter)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.globalAlpha = bolt.opacity * 0.5;
        ctx.beginPath();
        bolt.points.forEach((point, idx) => {
          if (idx === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
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

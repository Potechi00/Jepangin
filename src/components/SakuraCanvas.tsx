import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  color: string;
}

export const SakuraCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const petalCount = Math.min(32, Math.floor(width / 38));
    const petals: Petal[] = [];
    const colors = [
      'rgba(251, 113, 133,', // rose-400
      'rgba(244, 114, 182,', // pink-400
      'rgba(253, 164, 175,', // rose-300
      'rgba(254, 205, 211,', // rose-200
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 9 + 8,
        speedX: Math.random() * 1.2 + 0.5,
        speedY: Math.random() * 1.1 + 0.7,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.03 + 0.01,
        opacity: Math.random() * 0.45 + 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const drawPetal = (petal: Petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate((petal.rotation * Math.PI) / 180);
      ctx.scale(1, Math.sin(petal.flip)); // 3D flipping petal effect

      ctx.beginPath();
      const r = petal.size;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-r / 2, -r / 2, -r / 2, -r, 0, -r * 1.3);
      ctx.bezierCurveTo(r / 2, -r, r / 2, -r / 2, 0, 0);

      ctx.fillStyle = `${petal.color} ${petal.opacity})`;
      ctx.shadowColor = 'rgba(244, 63, 94, 0.2)';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.01;

      // Natural gentle breeze modulation
      const wind = Math.sin(tick * 0.5) * 0.6;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.x += p.speedX + wind + Math.sin(p.y * 0.006 + tick) * 0.4;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }
        if (p.x > width + 25) {
          p.x = -25;
        }

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-1 h-full w-full opacity-80"
    />
  );
};


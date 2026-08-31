import React, { useEffect, useRef, memo } from 'react';

interface Particle {
  type: 'petal' | 'leaf';
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
  swayOffset: number;
  swaySpeed: number;
}

export const SakuraCanvas: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let lastTime = performance.now();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 10-14 particles for silky-smooth 60fps on Android mobile browsers & desktops
    const baseCount = Math.min(14, Math.max(9, Math.floor(width / 80)));
    const particles: Particle[] = [];

    const petalColors = [
      'rgba(251, 113, 133,', // rose-400
      'rgba(244, 114, 182,', // pink-400
      'rgba(253, 164, 175,', // soft rose-300
      'rgba(254, 205, 211,', // pale rose-200
      'rgba(255, 228, 230,', // highlight rose-100
    ];

    const leafColors = [
      'rgba(132, 204, 22,', // fresh lime
      'rgba(101, 163, 13,', // green-600
      'rgba(202, 138, 4,',  // golden maple
    ];

    for (let i = 0; i < baseCount; i++) {
      const isLeaf = i % 6 === 0; // ~16% natural leaves, 84% cherry petals
      particles.push({
        type: isLeaf ? 'leaf' : 'petal',
        x: Math.random() * (width + 100) - 50,
        y: Math.random() * height,
        size: isLeaf ? Math.random() * 8 + 14 : Math.random() * 8 + 10,
        speedX: Math.random() * 0.8 + 0.5,
        speedY: (Math.random() * 0.9 + 0.6) * (isLeaf ? 1.15 : 1.0),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: Math.random() * 0.03 + 0.015,
        opacity: Math.random() * 0.35 + (isLeaf ? 0.55 : 0.6),
        color: isLeaf
          ? leafColors[Math.floor(Math.random() * leafColors.length)]
          : petalColors[Math.floor(Math.random() * petalColors.length)],
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.01,
      });
    }

    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(1, Math.sin(p.flip)); // 3D organic tumbling

      ctx.beginPath();
      const r = p.size;
      // Sakura heart petal shape
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-r * 0.5, -r * 0.4, -r * 0.6, -r * 0.95, -r * 0.15, -r * 1.35);
      ctx.lineTo(0, -r * 1.2);
      ctx.lineTo(r * 0.15, -r * 1.35);
      ctx.bezierCurveTo(r * 0.6, -r * 0.95, r * 0.5, -r * 0.4, 0, 0);

      ctx.fillStyle = `${p.color} ${p.opacity})`;
      ctx.shadowColor = 'rgba(244, 63, 94, 0.25)';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    };

    const drawLeaf = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(Math.cos(p.flip), 1); // 3D flipping

      ctx.beginPath();
      const r = p.size;
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(r * 0.45, -r * 0.3, 0, r * 0.8);
      ctx.quadraticCurveTo(-r * 0.45, -r * 0.3, 0, -r);

      ctx.fillStyle = `${p.color} ${p.opacity})`;
      ctx.shadowColor = 'rgba(101, 163, 13, 0.2)';
      ctx.shadowBlur = 3;
      ctx.fill();

      // Leaf Vein
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.lineTo(0, r * 0.6);
      ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.45})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    let tick = 0;

    // Delta-time based animation loop that runs independently of scrolling and page interactions
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.666, 2.0); // normalize around 60fps, clamp max step
      lastTime = now;

      ctx.clearRect(0, 0, width, height);
      tick += 0.012 * dt;

      // Natural gusting wind variations
      const globalWind = Math.sin(tick * 0.4) * 0.5 + 0.2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.swayOffset += p.swaySpeed * dt;

        const lateralSway = Math.sin(p.swayOffset) * 0.6;
        p.x += (p.speedX + globalWind + lateralSway) * dt;
        p.y += p.speedY * dt;
        p.rotation += p.rotationSpeed * dt;
        p.flip += p.flipSpeed * dt;

        // Wrap around smoothly when exiting view
        if (p.y > height + 40) {
          p.y = -35;
          p.x = Math.random() * (width + 60) - 40;
        }
        if (p.x > width + 40) {
          p.x = -40;
        }

        if (p.type === 'leaf') {
          drawLeaf(p);
        } else {
          drawPetal(p);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="foreground-sakura-layer"
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 25,
      }}
      className="select-none"
    />
  );
});

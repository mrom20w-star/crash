import React, { useEffect, useRef } from 'react';

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    class Particle {
      x = 0;
      y = 0;
      size = 0;
      speed = 0;
      opacity = 0;
      color = '';

      constructor() {
        this.reset();
        this.y = Math.random() * h;
      }

      reset() {
        this.x = Math.random() * w;
        this.y = h + 12;
        this.size = Math.random() * 3 + 1.2;
        this.speed = Math.random() * 1.0 + 0.25;
        this.opacity = Math.random() * 0.65 + 0.25;
        const mix = Math.random();
        if (mix < 0.5) {
          this.color = `rgba(0, 229, 255, ${this.opacity})`; // Neon Cyan
        } else {
          this.color = `rgba(255, 49, 49, ${this.opacity})`; // Neon Red
        }
      }

      update() {
        this.y -= this.speed;
        if (this.y < -12) {
          this.reset();
          this.y = h + 12;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 10;
        c.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 65; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.update();
        p.draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
};

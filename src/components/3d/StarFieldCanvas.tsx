import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  pulseSpeed: number;
  isSpecial?: boolean;
}

export const StarFieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme !== 'dark') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars: Star[] = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        pulseSpeed: 0.01 + Math.random() * 0.02,
        isSpecial: Math.random() > 0.85,
      });
    }

    let shootingStar = {
      active: false,
      x: 0,
      y: 0,
      len: 0,
      vx: 0,
      vy: 0,
      opacity: 0,
    };

    const triggerShootingStar = () => {
      shootingStar.active = true;
      shootingStar.x = Math.random() * width * 0.8;
      shootingStar.y = Math.random() * (height * 0.4);
      shootingStar.len = 100 + Math.random() * 80;
      shootingStar.vx = 8 + Math.random() * 6;
      shootingStar.vy = 4 + Math.random() * 4;
      shootingStar.opacity = 1.0;
    };

    const shootingInterval = setInterval(() => {
      if (Math.random() > 0.4) triggerShootingStar();
    }, 6000);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha += star.pulseSpeed;
        const currentAlpha = 0.3 + Math.abs(Math.sin(star.alpha)) * 0.7;

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.isSpecial ? '#FFDF78' : '#8E9FFF';
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = star.isSpecial ? '#FFDF78' : '#8E9FFF';
        ctx.shadowBlur = star.isSpecial ? 12 : 6;
        ctx.fill();

        if (star.isSpecial && currentAlpha > 0.7) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x - 6, star.y);
          ctx.lineTo(star.x + 6, star.y);
          ctx.moveTo(star.x, star.y - 6);
          ctx.lineTo(star.x, star.y + 6);
          ctx.stroke();
        }

        ctx.restore();
      });

      if (shootingStar.active) {
        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0) {
          shootingStar.active = false;
        } else {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 223, 120, ${shootingStar.opacity})`;
          ctx.lineWidth = 2;
          ctx.shadowColor = '#FFDF78';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - shootingStar.vx * 4,
            shootingStar.y - shootingStar.vy * 4
          );
          ctx.stroke();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(shootingInterval);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  if (theme !== 'dark') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
};
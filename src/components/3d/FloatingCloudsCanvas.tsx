import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cozyAudio } from '../../utils/audioSynth';

interface Bubble {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
  wobble: number;
}

export const FloatingCloudsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const bubbles: Bubble[] = [];
    const colorsLight = ['#FFE3E1', '#FFE7D6', '#E8E1F7', '#E1F0FA', '#E4F4EC', '#FFF5F0'];
    const colorsDark = ['#282F57', '#343B66', '#8E9FFF', '#503C68', '#1E2548'];
    const colors = theme === 'dark' ? colorsDark : colorsLight;

    for (let i = 0; i < 24; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 18 + Math.random() * 45,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.4,
        opacity: theme === 'dark' ? 0.25 + Math.random() * 0.2 : 0.35 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        wobble: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      bubbles.forEach((b) => {
        const dist = Math.hypot(b.x - clickX, b.y - clickY);
        if (dist < b.r + 15) {
          cozyAudio.playBubblePop();
          b.y = height + b.r;
          b.x = Math.random() * width;
        }
      });
    };
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      bubbles.forEach((b) => {
        b.wobble += 0.02;
        b.x += b.vx + Math.sin(b.wobble) * 0.3;
        b.y += b.vy;

        if (b.y < -b.r * 2) {
          b.y = height + b.r;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.opacity;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = theme === 'dark' ? 18 : 12;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = b.opacity * 0.7;
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-700"
    />
  );
};
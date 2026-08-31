import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

const IMAGES = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
  },
];

export const ToonhubCarouselSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const [scrollTilt, setScrollTilt] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    IMAGES.forEach((imgObj) => {
      const img = new Image();
      img.src = imgObj.src;
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      const tiltY = Math.max(Math.min(delta * 0.4, 18), -18);
      const tiltX = Math.max(Math.min((currentScrollY % 300) * 0.04 - 6, 8), -8);
      setScrollTilt({ x: tiltX, y: tiltY, z: Math.min(Math.abs(delta) * 0.5, 30) });

      // Smooth decay back to zero
      setTimeout(() => {
        setScrollTilt((prev) => ({ x: prev.x * 0.7, y: prev.y * 0.7, z: prev.z * 0.7 }));
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      cozyAudio.playBubblePop();
      setIsAnimating(true);

      if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % 4);
      } else {
        setActiveIndex((prev) => (prev + 3) % 4);
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating]
  );

  const getRole = (index: number): 'center' | 'left' | 'right' | 'back' => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 3) % 4) return 'left';
    if (index === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const getItemStyle = (role: 'center' | 'left' | 'right' | 'back'): React.CSSProperties => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) perspective(1200px) rotateY(${scrollTilt.y}deg) rotateX(${scrollTilt.x}deg) translateZ(${scrollTilt.z}px) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'none',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : 0,
        };
      case 'left':
        return {
          transform: `translateX(-50%) perspective(1200px) rotateY(${scrollTilt.y * 0.5 - 12}deg) scale(1)`,
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          transform: `translateX(-50%) perspective(1200px) rotateY(${scrollTilt.y * 0.5 + 12}deg) scale(1)`,
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  const grainSvg = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E";

  return (
    <section className="w-full my-8 px-4 sm:px-8 max-w-7xl mx-auto">
      <div
        className="relative w-full rounded-3xl overflow-hidden shadow-2xl select-none"
        style={{
          backgroundColor: IMAGES[activeIndex].bg,
          transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
          height: '80vh',
          minHeight: '600px',
        }}
      >
        {/* Grain Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("${grainSvg}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Giant Ghost Text "3D SHAPE" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: '18%',
            fontFamily: 'Anton, sans-serif',
            fontSize: 'clamp(80px, 22vw, 320px)',
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: 1,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          3D SHAPE
        </div>

        {/* Top-Left Brand Label "TOONHUB" */}
        <div
          className="absolute top-6 left-6 sm:left-8 text-xs font-semibold uppercase text-white"
          style={{
            zIndex: 60,
            opacity: 0.9,
            letterSpacing: '0.18em',
          }}
        >
          TOONHUB 3D STUDIO
        </div>

        {/* Carousel Items */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, idx) => {
            const role = getRole(idx);
            const style = getItemStyle(role);

            return (
              <div
                key={idx}
                className="absolute"
                style={{
                  aspectRatio: '0.6 / 1',
                  transition:
                    'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)',
                  willChange: 'transform, filter, opacity, left',
                  ...style,
                }}
              >
                <img
                  src={item.src}
                  alt={`Toonhub Figurine ${idx + 1}`}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom-Left Controls */}
        <div
          className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12"
          style={{
            zIndex: 60,
            maxWidth: '320px',
          }}
        >
          <p
            className="font-bold uppercase tracking-widest text-white mb-2 text-sm sm:text-lg"
            style={{
              opacity: 0.95,
              letterSpacing: '0.02em',
            }}
          >
            TOONHUB FIGURINES
          </p>

          <p
            className="hidden sm:block text-xs text-white mb-4"
            style={{
              opacity: 0.85,
              lineHeight: 1.6,
            }}
          >
            The artwork is stunning, shipped fully prepared in Vikas Kumar Atelier. The finish is a vision, the 3D craft is flawless.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('prev')}
              aria-label="Previous"
              className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={22} strokeWidth={2.25} />
            </button>

            <button
              onClick={() => navigate('next')}
              aria-label="Next"
              className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowRight size={22} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom-Right "DISCOVER IT" */}
        <div
          className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12"
          style={{ zIndex: 60 }}
        >
          <a
            href="#catalog"
            className="flex items-center gap-2 text-white no-underline transition-opacity duration-200 cursor-pointer"
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(20px, 4vw, 48px)',
              fontWeight: 400,
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            <span>DISCOVER IT</span>
            <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </section>
  );
};

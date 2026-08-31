import React, { useState, useEffect, useRef } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';
import { cozyAudio } from '../../utils/audioSynth';

interface MainframeHeroSectionProps {
  onPillClick: (label: string) => void;
  onNavigate: (section: string) => void;
}

export const MainframeHeroSection: React.FC<MainframeHeroSectionProps> = ({
  onPillClick,
  onNavigate,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
    38,
    600
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Mouse scrub horizontal tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const SENSITIVITY = 0.8;

    const handleMouseMove = (e: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      if (!video.duration || isNaN(video.duration)) return;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    const handleSeeked = () => {
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.04) {
        video.currentTime = targetTimeRef.current;
      } else {
        isSeekingRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (prevXRef.current === null) {
          prevXRef.current = touch.clientX;
          return;
        }
        const delta = touch.clientX - prevXRef.current;
        prevXRef.current = touch.clientX;
        if (!video.duration || isNaN(video.duration)) return;
        const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
        targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));
        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = targetTimeRef.current;
        }
      }
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    cozyAudio.playSparkle();
    navigator.clipboard.writeText('hello@mainframe.co');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whitePills = [
    'Pitch us an idea',
    'Come work here',
    'Send a brief hello',
    'See how we operate',
  ];

  const links = ['Labs', 'Studio', 'Openings', 'Shop'];

  return (
    <div className="h-screen w-full relative overflow-hidden bg-black select-none text-black">
      {/* Background Interactive Video */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ objectPosition: '70% center' }}
      />

      {/* Fixed Top Navbar Matching 2nd Image */}
      <nav className="absolute top-0 left-0 w-full z-20 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center bg-transparent">
        {/* Logo */}
        <div
          onClick={() => {
            cozyAudio.playSoftTap();
            onNavigate('top');
          }}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium leading-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe®
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none leading-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
        </div>

        {/* Center Desktop Links */}
        <div className="hidden md:flex items-center text-[23px] text-black" style={{ fontFamily: 'var(--font-body)' }}>
          {links.map((link, idx) => (
            <React.Fragment key={link}>
              <button
                onClick={() => {
                  cozyAudio.playSoftTap();
                  onNavigate(link.toLowerCase());
                }}
                className="hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none p-0 text-[23px] text-black"
              >
                {link}
              </button>
              {idx < links.length - 1 && <span>,&nbsp;</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Right CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => {
              cozyAudio.playCelebration();
              onPillClick('Get in touch with Mainframe');
            }}
            className="text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none p-0"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Get in touch
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 cursor-pointer z-30"
        >
          <span className={`w-6 h-[2px] bg-black transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`w-6 h-[2px] bg-black transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`w-6 h-[2px] bg-black transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="h-full w-full flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden relative z-10">
        <div className="max-w-xl relative">
          
          {/* 1. Blurred Intro Label */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6 text-black"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: '1.3',
              fontWeight: 400,
              color: '#000000',
              filter: 'blur(4px)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Hey there, meet A.R.I.A,<br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          {/* 2. Typewriter Paragraph */}
          <p
            className="text-black mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: '1.35',
              fontWeight: 400,
              minHeight: '54px',
              fontFamily: 'var(--font-body)',
            }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-cursor-blink" />
            )}
          </p>

          {/* 3. Action Pill Buttons */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: buttonsVisible ? 1 : 0,
              transform: buttonsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              fontFamily: 'var(--font-body)',
            }}
          >
            {whitePills.map((pill) => (
              <button
                key={pill}
                onClick={() => {
                  cozyAudio.playSoftTap();
                  onPillClick(pill);
                }}
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
              >
                {pill}
              </button>
            ))}

            {/* Outline Email Copy Pill */}
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-white hover:text-black transition-colors duration-200 gap-2 sm:gap-3"
              title="Click to copy email address"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-1">
                  {copied ? 'Copied to clipboard!' : 'hello@mainframe.co'}
                </span>
              </span>

              {/* 12x12 SVG Copy Icon */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="flex-shrink-0"
              >
                <rect x="3.5" y="1.5" width="7" height="7" rx="1" />
                <path d="M1.5 3.5V9.5C1.5 10.0523 1.94772 10.5 2.5 10.5H8.5" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-[25] md:hidden flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {links.map((link) => (
          <button
            key={link}
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate(link.toLowerCase());
            }}
            className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity text-left bg-transparent border-none p-0 cursor-pointer"
          >
            {link}
          </button>
        ))}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            onPillClick('Get in touch with Mainframe');
          }}
          className="text-[32px] font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity text-left bg-transparent border-none p-0 cursor-pointer"
        >
          Get in touch
        </button>
      </div>
    </div>
  );
};

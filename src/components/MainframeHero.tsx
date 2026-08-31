import React, { useState, useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface MainframeHeroProps {
  onPillClick: (label: string) => void;
}

export const MainframeHero: React.FC<MainframeHeroProps> = ({ onPillClick }) => {
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
    38,
    600
  );

  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <section className="h-screen w-full flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden relative z-1">
      <div className="max-w-xl relative z-10">
        
        {/* 1. Blurred Intro Label */}
        <div
          className="pointer-events-none select-none mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: '1.3',
            fontWeight: 400,
            color: '#000000',
            filter: 'blur(4px)',
          }}
        >
          Hey there, meet A.R.I.A,<br />
          Mainframe's Adaptive Response Interface Agent
        </div>

        {/* 2. Typewriter Text */}
        <p
          className="text-black mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: '1.35',
            fontWeight: 400,
            minHeight: '54px',
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
          }}
        >
          {/* 4 White Pill Buttons */}
          {whitePills.map((pill) => (
            <button
              key={pill}
              onClick={() => onPillClick(pill)}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
            >
              {pill}
            </button>
          ))}

          {/* 1 Outline Pill Button */}
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

            {/* 12x12 SVG Copy Icon (two overlapping rectangles) */}
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
    </section>
  );
};

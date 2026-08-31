import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface VortxHeroProps {
  onDiscoverNow: () => void;
  onNeuralSynergy: () => void;
  onCyberSynthesis: () => void;
}

export const VortxHero: React.FC<VortxHeroProps> = ({
  onDiscoverNow,
  onNeuralSynergy,
  onCyberSynthesis,
}) => {
  return (
    <div className="h-screen w-full bg-black p-3 md:p-4 font-inter select-none">
      {/* Liquid-glass inner container with rounded corners and border */}
      <div className="w-full h-full rounded-2xl flex flex-col justify-between overflow-hidden relative bg-black border border-white/10 shadow-2xl">
        
        {/* Background Looping Video from exact CloudFront URL */}
        <video
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260717_120352_eb988725-1351-43b3-8095-16e4a1005e3d.mp4"
          className="absolute inset-0 w-full h-full object-cover anim-fade"
          style={{ animationDelay: '0.2s' }}
        />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
          
          {/* Top Left: Logo + V O R T X */}
          <div
            className="anim-stagger flex flex-col items-start cursor-pointer"
            style={{ animationDelay: '0.1s' }}
            onClick={() => {
              cozyAudio.playSparkle();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <svg
              viewBox="0 0 256 256"
              fill="white"
              className="w-14 h-14 md:w-16 md:h-16"
            >
              {/* Top-Left Quadrant */}
              <path d="M120 120 L120 24 A96 96 0 0 0 24 120 Z" />
              {/* Top-Right Quadrant */}
              <path d="M136 120 L232 120 A96 96 0 0 0 136 24 Z" />
              {/* Bottom-Right Quadrant */}
              <path d="M136 136 L136 232 A96 96 0 0 0 232 136 Z" />
              {/* Bottom-Left Quadrant */}
              <path d="M120 136 L24 136 A96 96 0 0 0 120 232 Z" />
            </svg>
            <span className="text-white text-[10px] md:text-xs tracking-[0.4em] mt-1 font-light">
              V O R T X
            </span>
          </div>

          {/* Top Right: Nav Buttons */}
          <div
            className="anim-stagger flex items-center gap-3"
            style={{ animationDelay: '0.2s' }}
          >
            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                onNeuralSynergy();
              }}
              className="hidden md:block px-5 py-2.5 text-white text-sm hover:bg-white/10 btn-cut-border transition-colors cursor-pointer"
            >
              <span>Neural Synergy</span>
            </button>
            <button
              onClick={() => {
                cozyAudio.playCelebration();
                onCyberSynthesis();
              }}
              className="hidden md:block px-5 py-2.5 bg-white text-black text-sm hover:bg-white/90 btn-cut transition-colors font-medium cursor-pointer"
            >
              Cyber Synthesis
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-10 pb-8 md:pb-10">
          
          {/* Top Section */}
          <div className="flex-1 flex items-center relative">
            
            {/* Left Column (hidden below lg) */}
            <div
              className="anim-stagger hidden lg:flex flex-col gap-6 absolute left-0 top-[18%]"
              style={{ animationDelay: '0.4s' }}
            >
              <p className="text-white/80 text-base leading-relaxed max-w-[220px]">
                Come with us<br />
                exploring the<br />
                horizon
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full border border-white/40" />
                  <div className="w-4 h-4 rounded-full border border-white/40" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-white/70 text-xs leading-tight">
                    Perpetual<br />
                    Immersion
                  </span>
                  <span className="text-white/50 text-xs font-mono">01</span>
                </div>
              </div>
            </div>

            {/* Center Heading */}
            <div
              className="anim-stagger w-full text-center"
              style={{ animationDelay: '0.5s' }}
            >
              <h1
                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.1] tracking-[-0.04em]"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}
              >
                Forging Tomorrow<br />
                Virtual Horizon<br />
                VortxLab Creations
              </h1>
            </div>

          </div>

          {/* Bottom Row: 3 Columns matching uploaded screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-8">
            
            {/* Col 1: Mission Statement */}
            <div
              className="anim-stagger flex items-center justify-center md:justify-end"
              style={{ animationDelay: '0.7s' }}
            >
              <p className="text-white text-sm leading-relaxed max-w-[260px] text-center md:text-left md:ml-auto">
                We push past conventions, reshaping the virtual terrain with next-level technologies.
              </p>
            </div>

            {/* Col 2: Net Dynamics + Discover Now Button */}
            <div
              className="anim-stagger flex flex-col items-center gap-4 md:gap-6"
              style={{ animationDelay: '0.85s' }}
            >
              <span className="text-white text-2xl md:text-3xl font-medium tracking-tight">
                Net Dynamics
              </span>
              <button
                onClick={() => {
                  cozyAudio.playCelebration();
                  onDiscoverNow();
                }}
                className="w-full max-w-[280px] py-3.5 bg-white flex items-center justify-center gap-2 text-black hover:bg-white/90 transition-colors group btn-cut cursor-pointer font-medium"
              >
                <span className="text-sm font-medium">Discover Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Col 3: Social Button Cluster */}
            <div
              className="anim-stagger flex items-center justify-center md:justify-end gap-3"
              style={{ animationDelay: '1s' }}
            >
              {/* X / Twitter */}
              <button
                onClick={() => cozyAudio.playSoftTap()}
                aria-label="X (Twitter)"
                className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => cozyAudio.playSoftTap()}
                aria-label="LinkedIn"
                className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </button>

              {/* Facebook */}
              <button
                onClick={() => cozyAudio.playSoftTap()}
                aria-label="Facebook"
                className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

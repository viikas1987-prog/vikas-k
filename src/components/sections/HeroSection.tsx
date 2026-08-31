import React from 'react';
import { Hero3DScene } from '../3d/Hero3DScene';
import { Heart, Sparkles, ShieldCheck, ArrowRight, Scissors } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onOpenCustomizer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCatalog,
  onOpenCustomizer,
}) => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center pt-8 pb-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
        
        {/* Left Column: Heartfelt Copy & CTAs */}
        <div className="lg:col-span-6 flex flex-col gap-5 text-left z-10">
          
          {/* Founder Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-cozy-night-card/80 backdrop-blur-md border border-cozy-blush/60 dark:border-cozy-night-border shadow-sm w-fit">
            <span className="flex h-2 w-2 rounded-full bg-cozy-rose animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-cozy-warmBrown dark:text-cozy-night-accent">
              Handmade With Parent Love by Vikas Kumar
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#3E2723] dark:text-white leading-[1.1] font-serif">
            The World’s Softest{' '}
            <span className="bg-gradient-to-r from-cozy-rose via-[#F89B95] to-cozy-warmBrown dark:to-cozy-night-accent bg-clip-text text-transparent">
              3D Baby Cuddle
            </span>{' '}
            Experience.
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-cozy-warmBrown/80 dark:text-cozy-night-textMuted max-w-xl font-medium leading-relaxed">
            Crafted for sweet slumbers, belly laughs, and delicate newborn skin. Explore 100% GOTS organic cotton rompers, hand-knitted cuddle bears, and personalized silk embroidery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                cozyAudio.playSparkle();
                onExploreCatalog();
              }}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cozy-rose via-[#F89B95] to-cozy-peach text-white font-bold text-sm shadow-soft-glow hover:opacity-95 active:scale-98 transition flex items-center gap-2 group"
            >
              <Heart className="w-4 h-4 fill-current animate-pulse" />
              <span>Explore 3D Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                onOpenCustomizer();
              }}
              className="px-6 py-4 rounded-2xl bg-white/80 dark:bg-cozy-night-card/80 text-cozy-warmBrown dark:text-white font-bold text-sm border border-cozy-blush/60 dark:border-cozy-night-border hover:bg-cozy-blush/40 dark:hover:bg-cozy-night-cardHover transition flex items-center gap-2 shadow-sm"
            >
              <Scissors className="w-4 h-4 text-cozy-rose" />
              <span>Name Embroidery Studio</span>
            </button>
          </div>

          {/* Trust stats pill */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-cozy-blush/30 dark:border-cozy-night-border max-w-lg">
            <div>
              <span className="text-lg md:text-xl font-black text-cozy-warmBrown dark:text-white">
                100%
              </span>
              <span className="text-[11px] block text-cozy-warmBrown/70 dark:text-cozy-night-textMuted font-semibold">
                GOTS Organic
              </span>
            </div>
            <div>
              <span className="text-lg md:text-xl font-black text-cozy-warmBrown dark:text-white">
                50,000+
              </span>
              <span className="text-[11px] block text-cozy-warmBrown/70 dark:text-cozy-night-textMuted font-semibold">
                Happy Slumbers
              </span>
            </div>
            <div>
              <span className="text-lg md:text-xl font-black text-cozy-warmBrown dark:text-white">
                4.98 / 5
              </span>
              <span className="text-[11px] block text-cozy-warmBrown/70 dark:text-cozy-night-textMuted font-semibold">
                Parent Love Rating
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Interactive Hero Canvas */}
        <div className="lg:col-span-6 w-full relative flex items-center justify-center">
          {/* Background pastel glow ring */}
          <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-cozy-blush/40 to-cozy-sky/40 dark:from-[#8E9FFF]/20 dark:to-[#F9B7B2]/10 blur-3xl pointer-events-none" />
          
          <Hero3DScene />
        </div>

      </div>
    </section>
  );
};
import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Feather, Heart } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export const SoftnessMeter: React.FC = () => {
  const [sliderVal, setSliderVal] = useState(90);

  const getLabel = () => {
    if (sliderVal > 75) return '☁️ Cloud Marshmallow Soft (Cozy Cuddle GOTS Combed Cotton)';
    if (sliderVal > 45) return '🧸 Standard Pure Cotton (Good softness)';
    return '⚠️ Conventional Treated Polyester (Harsh friction for newborn skin)';
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r from-[#FFF5F0] to-[#FFFBF7] dark:from-cozy-night-card dark:to-[#171C38] p-8 md:p-12 rounded-5xl border border-cozy-blush/50 dark:border-cozy-night-border shadow-soft-clay">
        
        {/* Left Column */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-cozy-blush/60 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-accent w-fit flex items-center gap-1.5">
            <Feather className="w-4 h-4 text-cozy-rose" /> Sensory Softness Lab
          </span>
          <h3 className="text-2xl md:text-4xl font-black text-[#3E2723] dark:text-white font-serif">
            Why Newborn Skin Deserves 100% GOTS Organic Cotton
          </h3>
          <p className="text-xs md:text-sm text-cozy-warmBrown/80 dark:text-cozy-night-textMuted leading-relaxed">
            Infant skin is 5x thinner than adult skin and absorbs chemicals instantly. Vikas Kumar selected long-staple organic cotton fibers that are ring-spun and combed 3 times, eliminating microscopic micro-pricks.
          </p>

          {/* Interactive Slider */}
          <div className="mt-4 p-5 rounded-3xl bg-white/90 dark:bg-cozy-night-card/90 border border-cozy-blush/50 dark:border-cozy-night-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cozy-warmBrown dark:text-white">
                Drag to Compare Fiber Softness:
              </span>
              <span className="text-xs font-bold text-cozy-rose">{sliderVal}% Softness</span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              value={sliderVal}
              onChange={(e) => {
                setSliderVal(Number(e.target.value));
                if (Math.random() > 0.6) cozyAudio.playSoftTap();
              }}
              className="w-full accent-cozy-rose cursor-pointer h-2 bg-cozy-blush/50 rounded-lg"
            />

            <div className="mt-3 p-3 rounded-xl bg-cozy-cream/60 dark:bg-cozy-night-cardHover text-xs font-bold text-cozy-warmBrown dark:text-cozy-night-accent text-center transition-all">
              {getLabel()}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-cozy-night-card/80 border border-cozy-blush/40 dark:border-cozy-night-border shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-cozy-blush text-cozy-rose flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#3E2723] dark:text-white">GOTS 100% Certified</h4>
            <p className="text-[11px] text-cozy-warmBrown/75 dark:text-cozy-night-textMuted mt-1 leading-normal">
              Grown without pesticides, heavy metals, or toxic chemical fertilizers.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/80 dark:bg-cozy-night-card/80 border border-cozy-blush/40 dark:border-cozy-night-border shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-cozy-sky text-cozy-warmBrown flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#3E2723] dark:text-white">Zero Formaldehyde Dyes</h4>
            <p className="text-[11px] text-cozy-warmBrown/75 dark:text-cozy-night-textMuted mt-1 leading-normal">
              Colored exclusively with gentle non-allergenic botanical water-based dyes.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/80 dark:bg-cozy-night-card/80 border border-cozy-blush/40 dark:border-cozy-night-border shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-cozy-mint text-cozy-warmBrown flex items-center justify-center mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#3E2723] dark:text-white">Tagless & Flatlock Seams</h4>
            <p className="text-[11px] text-cozy-warmBrown/75 dark:text-cozy-night-textMuted mt-1 leading-normal">
              Zero scratchy tags. Every seam is sewn flat to prevent friction on tiny baby folds.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/80 dark:bg-cozy-night-card/80 border border-cozy-blush/40 dark:border-cozy-night-border shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-cozy-peach text-cozy-warmBrown flex items-center justify-center mb-3">
              <Feather className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#3E2723] dark:text-white">Vikas Kumar Inspected</h4>
            <p className="text-[11px] text-cozy-warmBrown/75 dark:text-cozy-night-textMuted mt-1 leading-normal">
              Each piece is individually hand-checked for stitch integrity and softness before shipping.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
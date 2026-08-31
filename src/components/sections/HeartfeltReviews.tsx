import React, { useState } from 'react';
import { reviews } from '../../data/reviews';
import { Star, Heart, CheckCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export const HeartfeltReviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    cozyAudio.playSoftTap();
    setCurrentIndex((c) => (c === 0 ? reviews.length - 1 : c - 1));
  };

  const next = () => {
    cozyAudio.playSoftTap();
    setCurrentIndex((c) => (c === reviews.length - 1 ? 0 : c + 1));
  };

  const activeReview = reviews[currentIndex];

  return (
    <section className="w-full py-16 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-cozy-rose flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse" /> Real Parent Love & Sleep Stories
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-[#3E2723] dark:text-white font-serif mt-1">
          Heartfelt Reviews From Cuddle Parents
        </h2>
      </div>

      {/* Featured Carousel Card */}
      <div className="relative bg-white/80 dark:bg-cozy-night-card/80 backdrop-blur-2xl p-8 md:p-12 rounded-5xl border border-cozy-blush/60 dark:border-cozy-night-border shadow-soft-clay flex flex-col md:flex-row items-center gap-8">
        <Quote className="absolute top-6 right-8 w-16 h-16 text-cozy-blush/30 dark:text-cozy-night-border pointer-events-none" />

        {/* Parent & Baby Avatar */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={activeReview.avatar}
              alt={activeReview.author}
              className="w-24 h-24 rounded-full object-cover border-4 border-cozy-rose/40 shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 text-2xl">🧸</span>
          </div>

          <h4 className="text-base font-bold text-[#3E2723] dark:text-white mt-3">
            {activeReview.author}
          </h4>
          <span className="text-xs text-cozy-rose font-bold">
            Baby {activeReview.babyName} ({activeReview.babyAge})
          </span>
          <span className="text-[10px] text-cozy-warmBrown/60 dark:text-cozy-night-textMuted flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" /> Verified Parent
          </span>
        </div>

        {/* Review Text */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-amber-500 mb-3">
              {[...Array(activeReview.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-bold text-cozy-warmBrown dark:text-white ml-2">
                Purchased: {activeReview.productName}
              </span>
            </div>

            <p className="text-sm md:text-base text-cozy-warmBrown/90 dark:text-cozy-night-textMuted italic font-serif leading-relaxed">
              "{activeReview.comment}"
            </p>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-cozy-blush/30 dark:border-cozy-night-border">
            <span className="text-xs font-semibold text-cozy-warmBrown/60 dark:text-cozy-night-textMuted">
              {activeReview.date} • ❤️ {activeReview.hearts} other parents resonated
            </span>

            {/* Navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full bg-cozy-cream dark:bg-cozy-night-cardHover border border-cozy-blush/50 dark:border-cozy-night-border flex items-center justify-center text-cozy-warmBrown dark:text-white hover:bg-cozy-rose hover:text-white transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full bg-cozy-cream dark:bg-cozy-night-cardHover border border-cozy-blush/50 dark:border-cozy-night-border flex items-center justify-center text-cozy-warmBrown dark:text-white hover:bg-cozy-rose hover:text-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface FeaturedCategoriesProps {
  onSelectCategory: (cat: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'clothes',
      title: 'Cloud Rompers & Overalls',
      desc: 'Silky ribbed organic cotton with easy-snap coconut buttons.',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
      badge: 'Bestseller',
    },
    {
      id: 'essentials',
      title: 'Artisan Cuddle Plushies',
      desc: 'Individually hand-knitted bears & sensory bedtime friends.',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
      badge: 'Hand-Knitted',
    },
    {
      id: 'sleepwear',
      title: 'Bamboo Dream Swaddles',
      desc: 'Thermo-regulating softness for tranquil nursery naps.',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
      badge: 'Silky Soft',
    },
    {
      id: 'gift-sets',
      title: 'Personalized Keepsake Boxes',
      desc: 'The quintessential tear-jerking newborn baby shower gift.',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
      badge: 'Gift Ready',
    },
  ];

  return (
    <section className="w-full py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-cozy-rose flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Handpicked with Tender Care
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-[#3E2723] dark:text-white font-serif mt-1">
          Explore by Cuddle Category
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              cozyAudio.playSoftTap();
              onSelectCategory(cat.id);
            }}
            className="group relative rounded-4xl overflow-hidden bg-white/70 dark:bg-cozy-night-card/70 border border-cozy-blush/40 dark:border-cozy-night-border shadow-soft-clay cursor-pointer p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-500"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden mb-3">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 dark:bg-cozy-night-card/90 text-[#3E2723] dark:text-white shadow-sm">
                {cat.badge}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#3E2723] dark:text-white group-hover:text-cozy-rose transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-cozy-warmBrown/75 dark:text-cozy-night-textMuted mt-1 leading-snug">
                {cat.desc}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-cozy-blush/20 dark:border-cozy-night-border text-xs font-bold text-cozy-rose group-hover:translate-x-1 transition-transform">
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
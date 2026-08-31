import React, { useState, useEffect } from 'react';
import { products } from '../../data/products';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Zap, Clock, Star, Heart, Eye } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface DealOfTheDayProps {
  onOpenQuickView: (p: Product) => void;
}

export const DealOfTheDay: React.FC<DealOfTheDayProps> = ({ onOpenQuickView }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 38, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 45, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.isDealOfDay || p.discountPercent >= 25).slice(0, 4);

  return (
    <section id="deals" className="w-full py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-[#B12704] via-[#D03B11] to-[#E45826] text-white p-4 md:p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#FFD814] fill-current animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black font-serif tracking-tight">
                Vikas's Lightning Deals of the Day
              </h2>
              <span className="bg-[#FFD814] text-[#111] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Up to 30% OFF
              </span>
            </div>
            <p className="text-xs text-white/90">
              Limited-quantity handcrafted batches for newborn comfort.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
          <Clock className="w-4 h-4 text-[#FFD814]" />
          <span className="text-xs font-semibold text-white/80">Ends in:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-sm text-[#FFD814]">
            <span className="bg-black/50 px-2 py-1 rounded">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            :
            <span className="bg-black/50 px-2 py-1 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            :
            <span className="bg-black/50 px-2 py-1 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dealProducts.map((p) => {
          const isWishlisted = wishlist.includes(p.id);
          const claimedPercent = Math.min(85, 45 + (p.price % 30));

          return (
            <div
              key={p.id}
              onClick={() => onOpenQuickView(p)}
              className="bg-white dark:bg-[#181C33] rounded-3xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative group"
            >
              <div className="absolute top-4 left-4 z-10 bg-[#CC0C39] text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                <span>{p.discountPercent}% off</span>
                <span className="text-[9px] uppercase font-bold text-yellow-200">Deal</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cozyAudio.playSparkle();
                  toggleWishlist(p.id);
                }}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition shadow-sm"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 mb-3 relative flex items-center justify-center">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-800 text-gray-800 dark:text-white shadow flex items-center gap-1 whitespace-nowrap">
                  <Eye className="w-3.5 h-3.5 text-cozy-rose" /> 3D 360° View
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{p.rating}</span>
                  <span className="text-gray-400 font-normal">({p.reviewsCount})</span>
                </div>

                <h4 className="text-xs font-bold text-[#0F1111] dark:text-white line-clamp-2 leading-snug group-hover:text-cozy-rose transition">
                  {p.name}
                </h4>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black text-[#B12704] dark:text-red-400">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  {p.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-[#007185] dark:text-sky-400 font-bold block">
                  {p.estimatedDelivery}
                </span>

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 mb-1">
                    <span>{claimedPercent}% Claimed</span>
                    <span className="text-red-600 font-bold">Only {p.stockCount} left</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E47911] rounded-full"
                      style={{ width: `${claimedPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cozyAudio.playCelebration();
                    addToCart(p, p.colors[0], p.sizes[0], 1);
                  }}
                  className="w-full mt-3 py-2 rounded-xl bg-[#FFD814] hover:bg-[#F7CA00] active:scale-98 text-[#0F1111] text-xs font-bold shadow-sm transition flex items-center justify-center gap-1"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
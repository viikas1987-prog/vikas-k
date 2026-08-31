import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Award, Users, MessageSquare, Zap } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface PhotoHeroSectionProps {
  onShopNow: () => void;
  onExploreBags: () => void;
}

export const PhotoHeroSection: React.FC<PhotoHeroSectionProps> = ({
  onShopNow,
}) => {
  const marqueeItems = [
    '🔥 2-PC GIRLS TOPS COMBO (₹799)',
    '✨ PRINCESS BLACK TURTLENECKS (₹699)',
    '⚡ BOSTON 91 HEAVYWEIGHT OVERSIZED (₹899)',
    '🏃 WOMEN DRI-FIT ACTIVEWEAR (₹849)',
    '🎁 30% OFF PROMO CODE: VIKAS30',
    '🚚 FAST ALL-INDIA FREE DISPATCH',
    '⭐ 25K+ 5-STAR VERIFIED BUYER REVIEWS',
    '💯 100% QUALITY GUARANTEED',
  ];

  return (
    <section className="w-full pt-4 pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Top Infinite Scrolling Ticker Animation */}
      <div className="w-full bg-[#1F2937] text-white py-3 px-4 rounded-2xl mb-8 overflow-hidden shadow-md flex items-center">
        <div className="flex items-center gap-2 pr-4 text-[#FF6B6B] font-extrabold text-xs uppercase tracking-wider flex-shrink-0 border-r border-gray-700">
          <Zap className="w-4 h-4 fill-current animate-bounce" />
          <span>Hot Drop</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1 ml-4">
          <div className="animate-marquee flex items-center gap-8 text-xs font-bold tracking-wide">
            {/* Repeated twice for continuous loop */}
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 hover:text-[#FF6B6B] transition cursor-default"
              >
                <span>{item}</span>
                <span className="text-gray-600 font-normal">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top Banner Header matching the screenshot */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#FF6B6B] font-bold block mb-1">
            — Handcrafted at Vikas Kumar Atelier
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1F2937] leading-[1.15]">
            30% Off <span className="text-[#FF6B6B]">Winter & Summer Sale</span><br />
            Promo Code: <span className="underline decoration-[#FF6B6B] decoration-wavy">VIKAS30</span>
          </h1>
        </div>

        <div className="max-w-md flex flex-col items-start lg:items-end text-left lg:text-right gap-3">
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
            Explore our bestselling 2-piece tops combos, cozy black high-neck turtlenecks, Dri-Fit activewear, and viral Boston 91 heavyweight drops.
          </p>
          <button
            onClick={() => {
              cozyAudio.playCelebration();
              onShopNow();
            }}
            className="px-6 py-2.5 bg-[#FF6B6B] hover:bg-[#F05252] text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>Shop All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two Main Feature Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Large Left Card: Girls Tops & High Neck Sweaters */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 card-soft relative overflow-hidden flex flex-col justify-between min-h-[380px] sm:min-h-[440px] group border border-gray-100">
          {/* Text & Action */}
          <div className="relative z-10 max-w-sm">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B6B] block mb-1">
              Top Trending Combos
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              Girls Tops &<br />
              <span className="text-3xl sm:text-4xl font-black">High Neck Sweaters</span>
            </h2>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Soft combed cotton 2-PC sets with side drawstrings & foldover thermal turtlenecks.
            </p>
            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                onShopNow();
              }}
              className="mt-6 px-7 py-2.5 bg-black hover:bg-[#FF6B6B] text-white text-xs font-bold rounded-full transition shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span>Explore Tops (From ₹699)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating Discount Tag */}
          <div className="absolute top-6 right-6 z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-100 shadow-md text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Festival Season
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#1F2937]">
              <span className="text-xs font-semibold text-gray-400">Up to </span>
              47% <span className="text-xs text-[#FF6B6B] font-bold">Off</span>
            </span>
            <span className="text-[9px] text-gray-400 block font-medium">Verified Supplier Stock</span>
          </div>

          {/* Apparel Product Images with float animation */}
          <div className="absolute right-2 sm:right-6 bottom-2 w-3/5 sm:w-1/2 h-4/5 pointer-events-none flex items-end justify-end gap-3">
            <img
              src="/images/products/tinkle-girls-combo-top.png"
              alt="Tinkle Girls 2-PC Top Combo"
              className="h-4/5 sm:h-full object-contain object-bottom filter drop-shadow-2xl rounded-2xl animate-float"
            />
            <img
              src="/images/products/princess-girls-turtleneck.png"
              alt="Princess High Neck Turtleneck"
              className="hidden sm:block h-3/4 object-contain object-bottom filter drop-shadow-xl rounded-2xl"
            />
          </div>
        </div>

        {/* Right Card: Boston 91 & Gym Activewear */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 card-soft relative overflow-hidden flex flex-col justify-between min-h-[380px] sm:min-h-[440px] group border border-gray-100">
          <div className="relative z-10 text-center">
            <span className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase block mb-1">
              Viral Drop
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
              BOSTON 91
            </h3>
            <span className="text-xs font-extrabold text-[#FF6B6B] block mt-0.5">
              Streetwear & Gym Activewear
            </span>
            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                onShopNow();
              }}
              className="mt-4 px-6 py-2 bg-black hover:bg-[#FF6B6B] text-white text-xs font-bold rounded-full transition shadow-md cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Boston 91 Real Apparel Photo */}
          <div className="relative z-0 mt-4 flex items-center justify-center">
            <img
              src="/images/products/boston-91-blue-streetwear.png"
              alt="Boston 91 Streetwear Drop"
              className="w-4/5 h-48 sm:h-56 object-contain filter drop-shadow-xl rounded-2xl animate-float group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </div>

      {/* 3 Metric Stat Cards matching the screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Stat 1: #1 Supplier Platform */}
        <div className="bg-white rounded-2xl p-5 card-soft card-soft-hover flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEBEA] text-[#FF6B6B] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-black text-gray-900 leading-tight">#1 Supplier</h4>
            <p className="text-xs text-gray-500 font-semibold">Premium Apparel & Fashion Hub</p>
          </div>
        </div>

        {/* Stat 2: 25k+ Client Testimonials (Highlighted in Coral) */}
        <div className="bg-[#FF6B6B] text-white rounded-2xl p-5 shadow-lg flex items-center gap-4 card-soft-hover">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-black text-white leading-tight">25k+ Reviews</h4>
            <p className="text-xs text-white/90 font-semibold">Verified Client Testimonials & 5★ Ratings</p>
          </div>
        </div>

        {/* Stat 3: 1 Million Real Customer & Buyers */}
        <div className="bg-white rounded-2xl p-5 card-soft card-soft-hover flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F8EE] text-[#48BB78] flex items-center justify-center flex-shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-black text-gray-900 leading-tight">1 Million+ Buyers</h4>
            <p className="text-xs text-gray-500 font-semibold">Satisfied Customers Across India</p>
          </div>
        </div>

      </div>

    </section>
  );
};

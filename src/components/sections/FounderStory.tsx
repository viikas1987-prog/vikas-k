import React from 'react';
import { Heart, Sparkles, Award, CheckCircle, ShieldCheck, Star } from 'lucide-react';

export const FounderStory: React.FC = () => {
  return (
    <section id="about" className="w-full py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white p-8 md:p-14 rounded-4xl border border-gray-100 card-soft shadow-xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-[#FFEBEA]/60 blur-3xl pointer-events-none" />

        {/* Founder Visual & Certification Badges */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
            <img
              src="/images/founder/vikas-kumar.jpg"
              alt="Vikas Kumar - Founder & Creator"
              className="w-full h-[430px] object-cover object-top hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B6B]">
                Founder & Visionary
              </span>
              <h3 className="text-2xl font-black font-inter tracking-tight">Vikas Kumar</h3>
              <p className="text-xs text-white/90 mt-1 font-medium leading-relaxed">
                "Every piece is crafted to combine uncompromising everyday style, premium comfort, and accessible luxury."
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
            <div className="px-4 py-2 rounded-full bg-[#FFF5F5] border border-[#FFB2AF]/40 text-xs font-bold text-[#FF6B6B] flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#FF6B6B]" /> 100% Quality Guaranteed
            </div>
            <div className="px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-sm">
              <Award className="w-4 h-4 text-amber-500" /> Verified Master Supplier
            </div>
          </div>
        </div>

        {/* Founder's Heartfelt Letter */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF6B6B]">
            <Heart className="w-4 h-4 fill-current animate-pulse text-[#FF6B6B]" /> A Personal Note from Vikas Kumar
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            "We Build Fashion That Makes You Feel Confident, Comfortable & Empowered."
          </h2>

          <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            <p>
              Welcome to our store! When I started creating apparel, my mission was clear: why should stylish, high-quality clothing cost a fortune? From our viral <strong>Boston 91 Graphic Oversized Drops</strong> to our ultra-soft <strong>Tinkle Girls 2-Piece Combos</strong> and high-performance <strong>Women Gym Activewear</strong>, every garment is thoughtfully designed and rigorously inspected.
            </p>
            <p>
              We focus on premium combed cotton, breathable 4-way stretch fabrics, and durable HD graphics that stay vibrant wash after wash. Whether you're dressing your kids for school, heading to a workout, or styling a streetwear outfit with friends, you can count on unmatched fit and durability.
            </p>
            <p>
              Thank you for trusting our atelier. Your support drives us to innovate every single day.
            </p>
          </div>

          {/* Promises Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Premium Breathable Fabrics
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Non-Fade HD Graphic Prints
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Fast All-India Express Dispatch
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> 100% Hassle-Free Returns & Support
            </div>
          </div>

          {/* Handwritten Signature */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-between mt-2">
            <div>
              <span className="text-3xl font-serif italic text-gray-900 block font-bold">
                Vikas Kumar
              </span>
              <span className="text-[11px] text-[#FF6B6B] font-extrabold uppercase tracking-wider">
                Founder & Lead Designer
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFEBEA] text-[#FF6B6B] flex items-center justify-center font-bold text-xl shadow-sm">
              ✨
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
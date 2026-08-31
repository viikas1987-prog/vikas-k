import React from 'react';
import { MapPin, Truck, HelpCircle, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';

export const TopUtilityBar: React.FC = () => {
  return (
    <div className="w-full bg-[#232F3E] dark:bg-[#0B0F19] text-[#E3E6E6] text-[11px] py-1.5 px-4 md:px-8 border-b border-white/10 hidden sm:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Deliver location & Announcement */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
            <MapPin className="w-3.5 h-3.5 text-cozy-rose" />
            <span>Deliver to <strong className="text-white">New York 10001</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Truck className="w-3.5 h-3.5" />
            <span>FREE Next-Day Delivery on orders over ₹50</span>
          </div>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1 text-[#F0C14B] font-bold cursor-pointer hover:underline">
            <Sparkles className="w-3 h-3" /> Vikas’s Atelier Guarantee
          </span>
          <span className="cursor-pointer hover:text-white transition">Parent Registry</span>
          <span className="cursor-pointer hover:text-white transition">Track Order</span>
          <span className="cursor-pointer hover:text-white transition flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> 24/7 Support
          </span>
        </div>

      </div>
    </div>
  );
};

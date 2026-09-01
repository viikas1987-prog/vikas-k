import React from 'react';
import { useCart } from '../../context/CartContext';
import { useSound } from '../../context/SoundContext';
import { ShoppingBag, Heart, Volume2, VolumeX, Sparkles, PhoneCall, Truck } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface PhotoNavbarProps {
  onNavigate: (section: string) => void;
  onOpenTracking?: () => void;
}

export const PhotoNavbar: React.FC<PhotoNavbarProps> = ({ onNavigate, onOpenTracking }) => {
  const { cartCount, subtotal, setIsCartOpen, wishlist } = useCart();
  const { isPlaying, toggleSound } = useSound();

  return (
    <header className="sticky top-0 z-50 w-full transition">
      
      {/* Top Urgent Announcement Bar with One-Click Track Button */}
      <div className="w-full bg-[#1E293B] text-white py-1.5 px-4 text-center text-[11px] font-bold flex items-center justify-center gap-3 border-b border-gray-800">
        <span>✨ 100% GOTS Certified Organic Babywear • Free All-India Shipping</span>
        <button
          onClick={() => {
            cozyAudio.playSoftTap();
            onOpenTracking?.();
          }}
          className="px-2.5 py-0.5 rounded-full bg-[#FF6B6B] hover:bg-[#F05252] text-white text-[10px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-sm"
        >
          <Truck className="w-3 h-3" /> Track Order
        </button>
      </div>

      {/* Main Glass Navbar */}
      <div className="bg-[#FFF9F6]/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div
            onClick={() => onNavigate('top')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] text-white flex items-center justify-center text-xl font-bold shadow-md">
              🧸
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight leading-none block">
                COZY CUDDLE
              </span>
              <span className="text-[10px] text-[#FF6B6B] font-bold tracking-wider uppercase block leading-none mt-0.5">
                by Vikas Kumar Atelier
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-gray-600">
            <button onClick={() => onNavigate('toonhub')} className="hover:text-[#FF6B6B] transition cursor-pointer text-[#FF6B6B]">
              TOONHUB 3D
            </button>
            <button onClick={() => onNavigate('catalog')} className="hover:text-[#FF6B6B] transition cursor-pointer">
              Collection & Tops
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-[#FF6B6B] transition cursor-pointer">
              Vikas Kumar Story
            </button>
            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                onOpenTracking?.();
              }}
              className="px-3.5 py-1 rounded-full bg-rose-100 hover:bg-rose-200 text-[#FF6B6B] border border-rose-300 transition cursor-pointer flex items-center gap-1.5 font-black shadow-sm active:scale-95"
            >
              <Truck className="w-3.5 h-3.5" /> 🚚 Track Order
            </button>
          </nav>

          {/* Right Action Icons & Mobile Track Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Primary Track Order Action Button */}
            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                onOpenTracking?.();
              }}
              className="px-3 py-1.5 rounded-full bg-[#FF6B6B] hover:bg-[#F05252] text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              title="Track Order & Shipment Journey"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>

            {/* Ambient Soundscape */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-full border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isPlaying
                  ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] animate-pulse'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              title="Toggle Ambient Lullaby Audio"
            >
              {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('catalog')}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-[#FF6B6B] transition relative cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-[#FF6B6B] text-[#FF6B6B]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B6B] text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                setIsCartOpen(true);
              }}
              className="px-3.5 sm:px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-full transition shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#FF6B6B]" />
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-[#FF6B6B] text-white text-[8px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline">₹{subtotal.toLocaleString('en-IN')}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

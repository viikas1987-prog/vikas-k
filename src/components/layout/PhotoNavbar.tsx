import React from 'react';
import { useCart } from '../../context/CartContext';
import { useSound } from '../../context/SoundContext';
import { ShoppingBag, Heart, Volume2, VolumeX, Sparkles, PhoneCall } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface PhotoNavbarProps {
  onNavigate: (section: string) => void;
}

export const PhotoNavbar: React.FC<PhotoNavbarProps> = ({ onNavigate }) => {
  const { cartCount, subtotal, setIsCartOpen, wishlist } = useCart();
  const { isPlaying, toggleSound } = useSound();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFF9F6]/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div
          onClick={() => onNavigate('top')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] text-white flex items-center justify-center text-xl font-bold shadow-md">
            🧸
          </div>
          <div>
            <span className="font-extrabold text-lg text-gray-900 tracking-tight leading-none block">
              COZY CUDDLE
            </span>
            <span className="text-[10px] text-[#FF6B6B] font-bold tracking-wider uppercase block leading-none mt-0.5">
              by Vikas Kumar Atelier
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-600">
          <button onClick={() => onNavigate('toonhub')} className="hover:text-[#FF6B6B] transition cursor-pointer text-[#FF6B6B]">
            TOONHUB 3D Studio
          </button>
          <button onClick={() => onNavigate('catalog')} className="hover:text-[#FF6B6B] transition cursor-pointer">
            Girls Tops & Combos
          </button>
          <button onClick={() => onNavigate('catalog')} className="hover:text-[#FF6B6B] transition cursor-pointer">
            Black Turtlenecks
          </button>
          <button onClick={() => onNavigate('catalog')} className="hover:text-[#FF6B6B] transition cursor-pointer">
            Boston 91 Drops
          </button>
          <button onClick={() => onNavigate('about')} className="hover:text-[#FF6B6B] transition cursor-pointer">
            Vikas Kumar Story
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Lullaby Audio Player */}
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

          {/* Cart Button with Rupees (₹) */}
          <button
            onClick={() => {
              cozyAudio.playSoftTap();
              setIsCartOpen(true);
            }}
            className="px-4 py-2 bg-[#FF6B6B] hover:bg-[#F05252] text-white font-bold text-xs rounded-full transition shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-black text-white text-[8px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </button>
        </div>

      </div>
    </header>
  );
};

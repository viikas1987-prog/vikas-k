import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { Product } from '../../types';
import {
  Search,
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  MapPin,
  Tag,
  Gift,
  Scissors,
  Camera,
} from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface VortxNavbarProps {
  onNavigate: (sectionId: string) => void;
  onSearchSelect: (product: Product) => void;
}

export const VortxNavbar: React.FC<VortxNavbarProps> = ({ onNavigate, onSearchSelect }) => {
  const { theme, toggleTheme } = useTheme();
  const { isPlaying, toggleSound } = useSound();
  const { cartCount, subtotal, setIsCartOpen, wishlist } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  const searchResults = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.material.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (p: Product) => {
    cozyAudio.playSoftTap();
    onSearchSelect(p);
    setSearchTerm('');
    setSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brandmark with Vortex SVG */}
        <button
          onClick={() => onNavigate('top')}
          className="flex items-center gap-2.5 text-left group flex-shrink-0 cursor-pointer"
        >
          <svg viewBox="0 0 256 256" fill="white" className="w-8 h-8 group-hover:scale-105 transition-transform">
            <path d="M120 120 L120 24 A96 96 0 0 0 24 120 Z" />
            <path d="M136 120 L232 120 A96 96 0 0 0 136 24 Z" />
            <path d="M136 136 L136 232 A96 96 0 0 0 232 136 Z" />
            <path d="M120 136 L24 136 A96 96 0 0 0 120 232 Z" />
          </svg>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm md:text-base tracking-wider text-white">
                VORTX
              </span>
              <span className="text-[10px] text-cozy-rose font-bold uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded">
                COZY CUDDLE
              </span>
            </div>
            <span className="text-[9px] text-gray-400 tracking-[0.2em] font-light block uppercase">
              by Vikas Kumar Atelier
            </span>
          </div>
        </button>

        {/* Live Search Bar */}
        <div ref={searchBoxRef} className="flex-1 max-w-md relative hidden sm:block">
          <div className="flex items-center rounded-xl bg-white/10 border border-white/15 text-white overflow-hidden focus-within:border-white focus-within:bg-black/50 transition">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search organic rompers, Bambi bear, swaddles..."
              className="w-full px-3.5 py-2 text-xs font-medium text-white bg-transparent focus:outline-none placeholder:text-gray-400"
            />
            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                onNavigate('catalog');
              }}
              className="px-3 py-2 text-gray-400 hover:text-white transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#121624] text-white rounded-2xl shadow-2xl border border-white/15 overflow-hidden z-50 max-h-80 overflow-y-auto">
              <div className="p-2.5 bg-black/40 border-b border-white/10 text-[11px] font-bold text-gray-400 flex items-center justify-between">
                <span>Matching Essentials ({searchResults.length})</span>
                <span className="text-cozy-rose font-bold">Instant 3D Preview</span>
              </div>
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 transition"
                >
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{p.name}</h5>
                    <span className="text-[10px] text-gray-400 block">{p.material}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#FFD814]">${p.price.toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold block">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Category Anchors (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-gray-300">
          <button
            onClick={() => onNavigate('deals')}
            className="hover:text-[#FFD814] transition flex items-center gap-1 cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-[#FFD814]" />
            <span>Deals</span>
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="hover:text-white transition cursor-pointer"
          >
            Organic Store
          </button>
          <button
            onClick={() => onNavigate('customizer')}
            className="hover:text-cozy-rose transition flex items-center gap-1 cursor-pointer text-white"
          >
            <Scissors className="w-3.5 h-3.5 text-cozy-rose" />
            <span>3D Embroidery</span>
          </button>
          <button
            onClick={() => onNavigate('gift-studio')}
            className="hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-[#F9B7B2]" />
            <span>Gift Chest</span>
          </button>
          <button
            onClick={() => onNavigate('gallery')}
            className="hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Moments</span>
          </button>
        </div>

        {/* Action Controls: Sound, Theme, Cart */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          
          {/* Lullaby Sound Bar Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isPlaying
                ? 'bg-cozy-rose/20 text-cozy-rose border-cozy-rose animate-pulse'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
            title={isPlaying ? 'Pause Ambient Nursery Audio' : 'Play Soothing Nursery Soundscape'}
          >
            {isPlaying ? <Volume2 className="w-4 h-4 text-cozy-rose" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition flex items-center justify-center cursor-pointer"
            title={theme === 'dark' ? 'Switch to Sunlight Light Mode' : 'Switch to Starlight Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FFD814]" />
            ) : (
              <Moon className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => {
              cozyAudio.playSparkle();
              onNavigate('catalog');
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition relative cursor-pointer"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-cozy-rose text-cozy-rose' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cozy-rose text-white text-[9px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Octagonal Cut Shopping Cart Button */}
          <button
            onClick={() => {
              cozyAudio.playSoftTap();
              setIsCartOpen(true);
            }}
            className="px-4 py-2 bg-white hover:bg-white/90 text-black font-bold text-xs btn-cut transition shadow flex items-center gap-2 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-[#B12704] text-white text-[8px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span>${subtotal.toFixed(2)}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
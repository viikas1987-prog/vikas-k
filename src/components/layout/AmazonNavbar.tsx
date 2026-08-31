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
  ChevronDown,
} from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface AmazonNavbarProps {
  onNavigate: (sectionId: string) => void;
  onSearchSelect: (product: Product) => void;
}

export const AmazonNavbar: React.FC<AmazonNavbarProps> = ({ onNavigate, onSearchSelect }) => {
  const { theme, toggleTheme } = useTheme();
  const { isPlaying, toggleSound } = useSound();
  const { cartCount, subtotal, setIsCartOpen, wishlist } = useCart();

  const [department, setDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  const departments = [
    'All Departments',
    'Baby Rompers & Clothes',
    'Bedtime Swaddles',
    'Cuddle Plushies',
    'Teethers & Blankets',
    'Gift Keepsake Boxes',
  ];

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
    <header className="sticky top-0 z-50 w-full bg-[#131921] dark:bg-[#0A0D17] text-white shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 md:gap-4">
        
        {/* Brand Logo & Founder Signature */}
        <button
          onClick={() => onNavigate('top')}
          className="flex items-center gap-2 text-left group flex-shrink-0 p-1 rounded-lg hover:outline hover:outline-1 hover:outline-white transition"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F9B7B2] to-[#FFE3E1] text-[#3E2723] flex items-center justify-center text-xl font-bold shadow">
            🧸
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-serif font-black text-lg md:text-xl text-white tracking-tight leading-none">
                COZY CUDDLE
              </span>
              <span className="text-[#FF9900] text-[10px] font-black tracking-widest uppercase bg-[#FF9900]/20 px-1.5 py-0.5 rounded">
                PRO 3D
              </span>
            </div>
            <span className="text-[10px] text-gray-300 tracking-wider font-semibold block leading-tight">
              by Vikas Kumar Atelier
            </span>
          </div>
        </button>

        {/* Deliver to Widget (Desktop) */}
        <div
          onClick={() => onNavigate('catalog')}
          className="hidden xl:flex flex-col cursor-pointer p-1.5 rounded-lg hover:outline hover:outline-1 hover:outline-white transition text-xs"
        >
          <span className="text-gray-400 text-[10px] flex items-center gap-0.5 leading-tight">
            <MapPin className="w-3 h-3 text-cozy-rose" /> Deliver to
          </span>
          <span className="font-bold text-white leading-tight">New York 10001</span>
        </div>

        {/* Amazon-Style Power Search Bar */}
        <div ref={searchBoxRef} className="flex-1 max-w-2xl relative mx-1 sm:mx-3">
          <div className="flex items-center rounded-xl bg-white text-[#131921] overflow-hidden focus-within:ring-3 focus-within:ring-[#FF9900] shadow-inner">
            
            {/* Category Dropdown */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-[#E6E6E6] text-[#333] hover:bg-[#D4D4D4] text-xs font-semibold px-2.5 py-2.5 border-r border-gray-300 focus:outline-none cursor-pointer hidden md:block"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search organic rompers, Bambi bear, swaddles, teethers..."
              className="w-full px-3 py-2 text-xs font-medium text-black focus:outline-none placeholder:text-gray-500"
            />

            {/* Search Button */}
            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                onNavigate('catalog');
              }}
              className="bg-[#F0C14B] hover:bg-[#E2B33E] text-[#111] px-4 py-2.5 flex items-center justify-center transition"
            >
              <Search className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Real-Time Live Auto-Complete Dropdown */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white text-[#131921] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in max-h-96 overflow-y-auto">
              <div className="p-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 flex items-center justify-between">
                <span>Matching Cuddle Essentials ({searchResults.length})</span>
                <span className="text-cozy-rose font-bold">Instant 3D Preview</span>
              </div>
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className="flex items-center gap-3 p-3 hover:bg-cozy-blush/20 cursor-pointer border-b border-gray-100 transition"
                >
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-[#131921] truncate">{p.name}</h5>
                    <span className="text-[11px] text-gray-500 block">{p.material}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#B12704]">$`${p.price}`</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Soundscape, Theme, Account, Wishlist, Cart */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
          
          {/* Lullaby Sound Bar Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 md:px-2.5 md:py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-cozy-rose text-white border-cozy-rose animate-pulse'
                : 'bg-white/10 text-gray-200 border-white/20 hover:bg-white/20'
            }`}
            title={isPlaying ? 'Pause Ambient Nursery Lullaby' : 'Play Soothing Lullaby Soundscape'}
          >
            {isPlaying ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden lg:inline text-[11px]">
              {isPlaying ? 'Lullaby On' : 'Nursery Audio'}
            </span>
          </button>

          {/* Theme Toggle (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className="p-1.5 md:p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200 transition flex items-center justify-center"
            title={theme === 'dark' ? 'Switch to Sunlight Light Mode' : 'Switch to Starlight Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F0C14B] animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Account / Founder Badge */}
          <div
            onClick={() => onNavigate('about')}
            className="hidden md:flex flex-col cursor-pointer p-1.5 rounded-lg hover:outline hover:outline-1 hover:outline-white transition"
          >
            <span className="text-[10px] text-gray-400 leading-tight">Artisan Studio</span>
            <span className="text-xs font-bold text-white flex items-center gap-0.5 leading-tight">
              Vikas Kumar <ChevronDown className="w-3 h-3 text-gray-400" />
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={() => {
              cozyAudio.playSparkle();
              onNavigate('catalog');
            }}
            className="p-1.5 md:p-2 rounded-lg hover:outline hover:outline-1 hover:outline-white text-gray-200 hover:text-white transition flex flex-col items-center relative"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-cozy-rose text-cozy-rose' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-cozy-rose text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => {
              cozyAudio.playSoftTap();
              setIsCartOpen(true);
            }}
            className="flex items-center gap-1.5 p-1.5 md:px-3 md:py-2 rounded-lg bg-[#F0C14B] hover:bg-[#E2B33E] text-[#111] font-bold transition shadow"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#CC0C39] text-white text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[9px] text-[#444] uppercase font-bold leading-none">Cart</span>
              <span className="text-xs font-black text-[#111] leading-tight">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>
    </header>
  );
};

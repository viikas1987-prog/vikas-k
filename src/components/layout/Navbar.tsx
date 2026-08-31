import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { useCart } from '../../context/CartContext';
import { Sun, Moon, Volume2, VolumeX, ShoppingBag, Heart, Scissors, Menu, X, Sparkles } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { isPlaying, toggleSound } = useSound();
  const { cartCount, setIsCartOpen, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop Collection', id: 'catalog' },
    { label: '3D Embroidery Studio', id: 'customizer' },
    { label: 'Gift Box Builder', id: 'gift-studio' },
    { label: 'Moments Gallery', id: 'gallery' },
    { label: 'Vikas’s Story', id: 'about' },
  ];

  const handleNavClick = (id: string) => {
    cozyAudio.playSoftTap();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 md:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto rounded-3xl bg-white/80 dark:bg-cozy-night-card/80 backdrop-blur-xl border border-cozy-blush/50 dark:border-cozy-night-border shadow-soft-clay px-4 md:px-6 py-2.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('top')}
          className="flex items-center gap-2 text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cozy-blush to-cozy-peach dark:from-[#2A3158] dark:to-cozy-night-cardHover flex items-center justify-center text-xl shadow-sm transform group-hover:scale-110 transition-transform">
            🧸
          </div>
          <div>
            <span className="font-serif font-black text-lg md:text-xl text-[#3E2723] dark:text-white tracking-tight leading-none block">
              Cozy Cuddle <span className="text-cozy-rose text-xs font-bold font-sans">3D</span>
            </span>
            <span className="text-[10px] font-semibold text-cozy-warmBrown/70 dark:text-cozy-night-textMuted tracking-wider uppercase">
              by Vikas Kumar
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-xs md:text-sm font-bold text-cozy-warmBrown dark:text-cozy-night-textMuted hover:text-cozy-rose dark:hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: Sound, Theme, Wishlist, Cart */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-2xl border flex items-center justify-center transition shadow-sm ${
              isPlaying
                ? 'bg-cozy-rose text-white border-cozy-rose animate-pulse'
                : 'bg-white/90 dark:bg-cozy-night-card text-cozy-warmBrown dark:text-cozy-night-textMuted border-cozy-blush/40 dark:border-cozy-night-border hover:bg-cozy-peach/30'
            }`}
            title={isPlaying ? 'Pause Ambient Lullaby' : 'Play Soothing Nursery Soundscape'}
          >
            {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-2xl bg-white/90 dark:bg-cozy-night-card border border-cozy-blush/40 dark:border-cozy-night-border text-cozy-warmBrown dark:text-cozy-night-accent flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
            title={theme === 'dark' ? 'Switch to Warm Sunlight Mode' : 'Switch to Starlight Lullaby Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-cozy-gold animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-cozy-warmBrown" />
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => {
              cozyAudio.playSoftTap();
              setIsCartOpen(true);
            }}
            className="relative px-3.5 py-2 rounded-2xl bg-gradient-to-r from-cozy-rose to-cozy-peach text-white font-bold text-xs shadow-soft-glow hover:opacity-95 active:scale-95 transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cuddle Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-cozy-rose text-[11px] font-black flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-2xl bg-white/90 dark:bg-cozy-night-card border border-cozy-blush/40 text-cozy-warmBrown dark:text-white flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-3xl bg-white/95 dark:bg-cozy-night-card/95 backdrop-blur-2xl border border-cozy-blush/50 dark:border-cozy-night-border shadow-xl flex flex-col gap-3 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-left font-bold text-sm py-2 px-3 rounded-xl hover:bg-cozy-blush/30 dark:hover:bg-cozy-night-cardHover text-[#3E2723] dark:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
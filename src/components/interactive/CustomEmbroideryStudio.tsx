import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { Sparkles, Heart, Check, Type, Scissors } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

export const CustomEmbroideryStudio: React.FC = () => {
  const { addToCart } = useCart();
  const [babyName, setBabyName] = useState('Aarav');
  const [fontStyle, setFontStyle] = useState<'cursive' | 'modern' | 'whimsical' | 'classic'>('cursive');
  const [threadColor, setThreadColor] = useState('#D4A373');
  const [threadName, setThreadName] = useState('Golden Honey');
  const [selectedIcon, setSelectedIcon] = useState<'teddy' | 'star' | 'cloud' | 'heart' | 'crown' | 'none'>('teddy');
  const [selectedProductId, setSelectedProductId] = useState('cuddle-romper-ribbed');
  const [isSaved, setIsSaved] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const threadColors = [
    { name: 'Golden Honey', hex: '#D4A373' },
    { name: 'Blush Rose', hex: '#E29578' },
    { name: 'Sky Blue', hex: '#6D9DC5' },
    { name: 'Sage Mint', hex: '#83A598' },
    { name: 'Midnight Stardust', hex: '#4A5568' },
    { name: 'Soft Peach', hex: '#F4A261' },
  ];

  const icons = [
    { id: 'teddy', label: '🧸 Bear' },
    { id: 'star', label: '⭐ Star' },
    { id: 'cloud', label: '☁️ Cloud' },
    { id: 'heart', label: '🤍 Heart' },
    { id: 'crown', label: '👑 Crown' },
    { id: 'none', label: 'None' },
  ];

  const handleAddToCart = () => {
    cozyAudio.playCelebration();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F9B7B2', '#FFE3E1', '#D4A373', '#8E9FFF'],
    });

    addToCart(
      selectedProduct,
      selectedProduct.colors[0],
      selectedProduct.sizes[0],
      1,
      {
        babyName: babyName.trim() || 'Sweet Baby',
        fontStyle,
        threadColor,
        threadColorName: threadName,
        icon: selectedIcon,
        position: 'center',
      }
    );

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const getFontClass = () => {
    if (fontStyle === 'cursive') return 'font-cursive text-3xl tracking-wide';
    if (fontStyle === 'modern') return 'font-sans font-bold text-2xl tracking-widest uppercase';
    if (fontStyle === 'whimsical') return 'font-cursive text-4xl italic font-bold';
    return 'font-serif text-2xl tracking-normal';
  };

  return (
    <section id="customizer" className="w-full py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-cozy-blush/60 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-accent inline-flex items-center gap-2">
          <Scissors className="w-4 h-4 text-cozy-rose" /> Hand-Stitched With Love in Vikas Kumar’s Atelier
        </span>
        <h2 className="text-3xl md:text-5xl font-black mt-3 text-[#3E2723] dark:text-white font-serif">
          Live Name Embroidery Studio
        </h2>
        <p className="text-sm md:text-base text-cozy-warmBrown/80 dark:text-cozy-night-textMuted max-w-2xl mx-auto mt-2 font-medium">
          Personalize baby’s heirloom romper or cuddle plush with customized silk-thread embroidery. Watch your baby’s name come to life in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/70 dark:bg-cozy-night-card/70 backdrop-blur-2xl p-6 md:p-10 rounded-4xl border border-cozy-blush/50 dark:border-cozy-night-border shadow-soft-clay">
        
        {/* Left Side: Interactive Real-time Embroidery Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-[#FFF9F3] to-[#FFF0E6] dark:from-[#1E2548] dark:to-[#161B36] p-8 flex flex-col items-center justify-center relative overflow-hidden border-4 border-dashed border-cozy-rose/40 dark:border-cozy-night-border shadow-inner">
            
            {/* Fabric texture overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4A373_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Product Silhouette / Background */}
            <img
              src={selectedProduct.images[0]}
              alt="Embroidery Base"
              className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-500 opacity-90"
            />

            {/* Live Stitched Embroidery Badge */}
            <div className="mt-4 px-6 py-3 rounded-2xl bg-white/90 dark:bg-cozy-night-card/90 backdrop-blur-md shadow-lg border border-cozy-blush/60 dark:border-cozy-night-border flex flex-col items-center gap-1 z-10 transform hover:scale-110 transition duration-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cozy-warmBrown/60 dark:text-cozy-night-textMuted flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cozy-gold animate-spin-slow" /> Vikas Kumar Atelier Stitch
              </span>
              
              <div className="flex items-center gap-2">
                {selectedIcon !== 'none' && (
                  <span className="text-xl animate-bounce">
                    {selectedIcon === 'teddy' && '🧸'}
                    {selectedIcon === 'star' && '⭐'}
                    {selectedIcon === 'cloud' && '☁️'}
                    {selectedIcon === 'heart' && '🤍'}
                    {selectedIcon === 'crown' && '👑'}
                  </span>
                )}
                <span
                  className={`${getFontClass()} drop-shadow-sm font-semibold transition-all duration-300`}
                  style={{ color: threadColor, textShadow: `0 1px 2px ${threadColor}40` }}
                >
                  {babyName.trim() || 'Your Baby’s Name'}
                </span>
              </div>
            </div>

            <div className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-white/80 dark:bg-cozy-night-card text-cozy-warmBrown dark:text-cozy-night-accent shadow-sm">
              ✨ 100% Organic Silk Thread
            </div>
          </div>
        </div>

        {/* Right Side: Customizer Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Base Product Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mb-2 block">
              1. Choose Heirloom Item to Embroider:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {products.filter(p => p.customizable).slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    cozyAudio.playSoftTap();
                    setSelectedProductId(item.id);
                  }}
                  className={`p-2.5 rounded-2xl text-left text-xs font-bold border transition flex items-center gap-2 ${
                    selectedProductId === item.id
                      ? 'border-cozy-rose bg-cozy-blush/40 dark:bg-cozy-night-cardHover text-[#3E2723] dark:text-white shadow-sm ring-1 ring-cozy-rose'
                      : 'border-cozy-blush/30 dark:border-cozy-night-border bg-white/60 dark:bg-cozy-night-card/60 text-cozy-warmBrown dark:text-cozy-night-textMuted'
                  }`}
                >
                  <img src={item.images[0]} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Baby Name Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mb-2 block flex items-center justify-between">
              <span>2. Type Baby’s Name:</span>
              <span className="text-[10px] text-cozy-rose font-semibold">Max 12 letters</span>
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={12}
                value={babyName}
                onChange={(e) => {
                  setBabyName(e.target.value);
                  cozyAudio.playBubblePop();
                }}
                placeholder="e.g. Liam, Aria, Noah..."
                className="w-full px-4 py-3 rounded-2xl bg-white/90 dark:bg-cozy-night-card border border-cozy-blush dark:border-cozy-night-border text-base font-bold text-[#3E2723] dark:text-white focus:outline-none focus:ring-2 focus:ring-cozy-rose shadow-inner"
              />
              <Type className="absolute right-3.5 top-3.5 w-5 h-5 text-cozy-warmBrown/40 dark:text-cozy-night-textMuted" />
            </div>
          </div>

          {/* Font Style */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mb-2 block">
              3. Font Typography:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['cursive', 'modern', 'whimsical', 'classic'] as const).map((font) => (
                <button
                  key={font}
                  onClick={() => {
                    cozyAudio.playSoftTap();
                    setFontStyle(font);
                  }}
                  className={`py-2 rounded-xl text-xs capitalize font-bold border transition ${
                    fontStyle === font
                      ? 'border-cozy-rose bg-cozy-rose text-white shadow-soft-glow'
                      : 'border-cozy-blush/40 dark:border-cozy-night-border bg-white/60 dark:bg-cozy-night-card text-cozy-warmBrown dark:text-cozy-night-textMuted'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Thread Color */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mb-2 block flex items-center justify-between">
              <span>4. Silk Thread Color:</span>
              <span className="text-xs font-bold text-cozy-rose">{threadName}</span>
            </label>
            <div className="flex items-center gap-2">
              {threadColors.map((tc) => (
                <button
                  key={tc.name}
                  onClick={() => {
                    cozyAudio.playBubblePop();
                    setThreadColor(tc.hex);
                    setThreadName(tc.name);
                  }}
                  className={`w-9 h-9 rounded-full border-2 transition-all transform hover:scale-110 shadow-sm flex items-center justify-center ${
                    threadColor === tc.hex
                      ? 'border-cozy-warmBrown dark:border-white ring-2 ring-cozy-rose scale-110'
                      : 'border-white dark:border-cozy-night-border'
                  }`}
                  style={{ backgroundColor: tc.hex }}
                  title={tc.name}
                >
                  {threadColor === tc.hex && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Embroidered Motif */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mb-2 block">
              5. Add Baby Emblem:
            </label>
            <div className="flex flex-wrap gap-2">
              {icons.map((ic) => (
                <button
                  key={ic.id}
                  onClick={() => {
                    cozyAudio.playSoftTap();
                    setSelectedIcon(ic.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    selectedIcon === ic.id
                      ? 'border-cozy-rose bg-cozy-blush/80 dark:bg-cozy-night-cardHover text-[#3E2723] dark:text-white ring-1 ring-cozy-rose'
                      : 'border-cozy-blush/30 dark:border-cozy-night-border bg-white/60 dark:bg-cozy-night-card text-cozy-warmBrown dark:text-cozy-night-textMuted'
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Action */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cozy-rose via-[#F89B95] to-cozy-peach text-white font-bold text-base shadow-soft-glow hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-5 h-5" /> Added to Cart!
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-current animate-pulse" />
                Embroider & Add to Cart — ₹{(selectedProduct.price + 199).toLocaleString('en-IN')}
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
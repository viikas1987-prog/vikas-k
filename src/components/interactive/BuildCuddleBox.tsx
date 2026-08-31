import React, { useState } from 'react';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Gift, Package, Check, Sparkles, Plus, Trash2 } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

export const BuildCuddleBox: React.FC = () => {
  const { addToCart } = useCart();
  const [boxStyle, setBoxStyle] = useState<'pastel' | 'golden' | 'wooden'>('pastel');
  const [selectedItems, setSelectedItems] = useState<string[]>([
    products[0]?.id || 'tinkle-comfy-girls-2pc-combo',
    products[1]?.id || 'princess-stylish-girls-sweater',
    products[3]?.id || 'boston-91-retro-tshirt',
  ]);
  const [recipientName, setRecipientName] = useState('Ananya');
  const [noteMessage, setNoteMessage] = useState(
    'Wishing you endless confidence, style, and everyday comfort with this handcrafted atelier gift box!'
  );
  const [isPacked, setIsPacked] = useState(false);

  const boxes = [
    {
      id: 'pastel',
      name: 'Pastel Rose Keepsake Box',
      desc: 'Blush pink & coral satin ribbon packaging with embossed gold foil lettering.',
      price: 299,
    },
    {
      id: 'golden',
      name: 'Royal Starlight Gold Box',
      desc: 'Deep celestial navy with golden satin ribbon & sparkling stars.',
      price: 499,
    },
    {
      id: 'wooden',
      name: 'Artisan Solid Pine Keepsake Chest',
      desc: 'Handcrafted natural pine memory box with Vikas Kumar engraved seal.',
      price: 799,
    },
  ];

  const toggleItem = (id: string) => {
    cozyAudio.playBubblePop();
    if (selectedItems.includes(id)) {
      if (selectedItems.length > 1) {
        setSelectedItems(selectedItems.filter((i) => i !== id));
      }
    } else {
      if (selectedItems.length < 5) {
        setSelectedItems([...selectedItems, id]);
      }
    }
  };

  const selectedProducts = products.filter((p) => selectedItems.includes(p.id));
  const activeBox = boxes.find((b) => b.id === boxStyle) || boxes[0];
  const itemsSubtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const totalBoxPrice = itemsSubtotal + activeBox.price;

  const handlePackBox = () => {
    cozyAudio.playCelebration();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFC83B', '#F9B7B2', '#8E9FFF', '#FAF3E0'],
    });

    setIsPacked(true);

    selectedProducts.forEach((p) => {
      addToCart(p, p.colors[0], p.sizes[0], 1);
    });

    setTimeout(() => setIsPacked(false), 3000);
  };

  return (
    <section id="gift-studio" className="w-full py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-cozy-rose/20 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-accent inline-flex items-center gap-2">
          <Gift className="w-4 h-4 text-cozy-rose animate-bounce" /> The Heart-Melting Baby Shower Studio
        </span>
        <h2 className="text-3xl md:text-5xl font-black mt-3 text-[#3E2723] dark:text-white font-serif">
          Build-a-Cuddle Keepsake Box
        </h2>
        <p className="text-sm md:text-base text-cozy-warmBrown/80 dark:text-cozy-night-textMuted max-w-2xl mx-auto mt-2 font-medium">
          Create a personalized dream gift box packed with artisan baby essentials, ribbon styling, and a handwritten calligraphy letter from Vikas Kumar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step 1 & 2 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Packaging Box Style */}
          <div className="bg-white/80 dark:bg-cozy-night-card/80 backdrop-blur-xl p-6 rounded-3xl border border-cozy-blush/50 dark:border-cozy-night-border shadow-soft-clay">
            <h3 className="text-base font-bold text-[#3E2723] dark:text-white flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-cozy-rose" /> 1. Select Keepsake Box Style:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {boxes.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    cozyAudio.playSoftTap();
                    setBoxStyle(b.id as any);
                  }}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                    boxStyle === b.id
                      ? 'border-cozy-rose bg-cozy-blush/30 dark:bg-cozy-night-cardHover ring-2 ring-cozy-rose shadow-md'
                      : 'border-cozy-blush/30 dark:border-cozy-night-border bg-white/50 dark:bg-cozy-night-card/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3E2723] dark:text-white">{b.name}</span>
                      {boxStyle === b.id && <Check className="w-4 h-4 text-cozy-rose" />}
                    </div>
                    <p className="text-[11px] text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mt-1 leading-snug">
                      {b.desc}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-cozy-warmBrown dark:text-cozy-night-accent mt-3">
                    +₹{b.price.toLocaleString('en-IN')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Item Selector */}
          <div className="bg-white/80 dark:bg-cozy-night-card/80 backdrop-blur-xl p-6 rounded-3xl border border-cozy-blush/50 dark:border-cozy-night-border shadow-soft-clay">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#3E2723] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cozy-gold" /> 2. Pick 3 to 5 Cuddle Items ({selectedItems.length}/5 Selected):
              </h3>
              <span className="text-xs font-semibold text-cozy-rose">
                {selectedItems.length >= 3 ? 'Ready to Pack ✨' : 'Pick at least 3 items'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((p) => {
                const isSelected = selectedItems.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleItem(p.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center relative group ${
                      isSelected
                        ? 'border-cozy-rose bg-cozy-blush/40 dark:bg-cozy-night-cardHover ring-2 ring-cozy-rose shadow-md scale-102'
                        : 'border-cozy-blush/30 dark:border-cozy-night-border bg-white/50 dark:bg-cozy-night-card/50 hover:bg-cozy-peach/20'
                    }`}
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-sm mb-2"
                    />
                    <span className="text-xs font-bold text-[#3E2723] dark:text-white truncate w-full">
                      {p.name}
                    </span>
                    <span className="text-xs font-semibold text-cozy-warmBrown dark:text-cozy-night-accent mt-0.5">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>

                    <div className="absolute top-2 right-2">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-cozy-rose text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/80 dark:bg-cozy-night-card border border-cozy-blush dark:border-cozy-night-border text-cozy-warmBrown flex items-center justify-center group-hover:bg-cozy-rose group-hover:text-white transition">
                          <Plus className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="bg-gradient-to-br from-[#FFF8F2] to-[#FFF1EC] dark:from-cozy-night-card dark:to-[#171B36] p-6 rounded-4xl border border-cozy-blush/60 dark:border-cozy-night-border shadow-soft-clay flex flex-col gap-5">
            
            <div className="flex items-center justify-between border-b border-cozy-blush/30 dark:border-cozy-night-border pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cozy-rose">
                  Box Bundle Summary
                </span>
                <h4 className="text-xl font-bold text-[#3E2723] dark:text-white">{activeBox.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-cozy-warmBrown dark:text-white">
                  ${totalBoxPrice}
                </span>
                <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-bold">
                  ✨ 15% Bundle Discount Included
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {selectedProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/70 dark:bg-cozy-night-card/70 border border-cozy-blush/30 dark:border-cozy-night-border"
                >
                  <div className="flex items-center gap-2">
                    <img src={item.images[0]} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                    <span className="text-xs font-bold text-[#3E2723] dark:text-white truncate max-w-[170px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cozy-warmBrown dark:text-cozy-night-accent">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="text-cozy-warmBrown/40 hover:text-red-500 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#1E2442] border border-cozy-blush/50 dark:border-cozy-night-border shadow-inner">
              <label className="text-xs font-bold uppercase tracking-wider text-cozy-warmBrown/80 dark:text-cozy-night-textMuted block mb-1">
                Handwritten Calligraphy Card for:
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-cozy-cream/60 dark:bg-cozy-night-card text-xs font-bold text-[#3E2723] dark:text-white border border-cozy-blush/40 dark:border-cozy-night-border mb-2"
                placeholder="Recipient's Name"
              />
              <textarea
                value={noteMessage}
                onChange={(e) => setNoteMessage(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg bg-cozy-cream/60 dark:bg-cozy-night-card font-cursive text-cozy-warmBrown dark:text-cozy-night-accent border border-cozy-blush/40 dark:border-cozy-night-border text-base"
                placeholder="Write your sweet message..."
              />
              <span className="text-[10px] text-cozy-warmBrown/60 dark:text-cozy-night-textMuted block text-right mt-1 font-semibold">
                — Signed & Sealed by Vikas Kumar Atelier 💌
              </span>
            </div>

            <button
              onClick={handlePackBox}
              disabled={selectedItems.length < 3}
              className={`w-full py-4 rounded-2xl font-bold text-base shadow-soft-glow transition flex items-center justify-center gap-2 ${
                selectedItems.length >= 3
                  ? 'bg-gradient-to-r from-cozy-rose to-cozy-warmBrown text-white hover:opacity-95 active:scale-98 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPacked ? (
                <>
                  <Check className="w-5 h-5 text-white" /> Packed & Added to Cart!
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 animate-pulse" />
                  Pack My Cuddle Box (₹{totalBoxPrice.toLocaleString('en-IN')})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
import React, { useState } from 'react';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Sparkles, ShoppingBag, Check } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

export const FrequentlyBoughtTogether: React.FC = () => {
  const { addToCart } = useCart();
  const bundle = [products[0], products[1], products[4]];
  const [selectedIds, setSelectedIds] = useState<string[]>(bundle.map((p) => p.id));
  const [bundleAdded, setBundleAdded] = useState(false);

  const toggleSelect = (id: string) => {
    cozyAudio.playBubblePop();
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedItems = bundle.filter((p) => selectedIds.includes(p.id));
  const rawTotal = selectedItems.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscount = selectedItems.length === 3 ? 0.15 : 0;
  const discountedTotal = rawTotal * (1 - bundleDiscount);

  const handleAddBundle = () => {
    cozyAudio.playCelebration();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD814', '#F9B7B2', '#007185', '#D4A373'],
    });

    selectedItems.forEach((p) => {
      addToCart(p, p.colors[0], p.sizes[0], 1);
    });

    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2500);
  };

  return (
    <section className="w-full py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-[#181C33] p-6 md:p-8 rounded-4xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#FF9900]" />
          <h3 className="text-lg md:text-xl font-bold font-serif text-[#0F1111] dark:text-white">
            Frequently Bought Together (Save 15% on the Complete Cuddle Bundle)
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-wrap items-center gap-3">
            {bundle.map((item, idx) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <React.Fragment key={item.id}>
                  <div
                    onClick={() => toggleSelect(item.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center max-w-[160px] ${
                      isSelected
                        ? 'border-cozy-rose bg-cozy-blush/20 ring-1 ring-cozy-rose'
                        : 'border-gray-200 dark:border-gray-800 opacity-50'
                    }`}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shadow-sm mb-2"
                    />
                    <h5 className="text-[11px] font-bold text-[#0F1111] dark:text-white line-clamp-1">
                      {item.name}
                    </h5>
                    <span className="text-xs font-black text-[#B12704] mt-1">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {idx < bundle.length - 1 && (
                    <span className="text-gray-400 font-bold text-lg hidden sm:inline">+</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="lg:col-span-4 p-5 rounded-3xl bg-gray-50 dark:bg-[#1F2542] border border-gray-200 dark:border-gray-700 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                  Price for all {selectedItems.length} items:
                </span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#B12704] dark:text-red-400">
                    ₹{discountedTotal.toLocaleString('en-IN')}.00
                  </span>
                  {bundleDiscount > 0 && (
                    <span className="text-xs text-gray-400 line-through block">
                      ₹{rawTotal.toLocaleString('en-IN')}.00
                    </span>
                  )}
                </div>
              </div>

              {bundleDiscount > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                  ✨ Instant 15% Vikas Kumar Bundle Savings Applied!
                </span>
              )}

              <div className="mt-3 space-y-1.5">
                {bundle.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2 text-[11px] text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-0.5 accent-[#FF6B6B] cursor-pointer"
                    />
                    <span className="line-clamp-1">
                      <strong>₹{item.price.toLocaleString('en-IN')}</strong> — {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddBundle}
              className="w-full py-3 rounded-xl bg-[#FFD814] hover:bg-[#F7CA00] active:scale-98 text-[#0F1111] text-xs font-bold shadow transition flex items-center justify-center gap-2"
            >
              {bundleAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" /> Added Bundle to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add all {selectedItems.length} to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
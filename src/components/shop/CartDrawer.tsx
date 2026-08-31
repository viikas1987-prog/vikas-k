import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Gift, ShoppingBag, ArrowRight, Check, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';
import { CheckoutOrderModal } from './CheckoutOrderModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    discountPercent,
    setDiscountPercent,
    appliedCoupon,
    setAppliedCoupon,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeGiftThreshold,
    hasFreeGift,
    clearCart,
  } = useCart();

  const { validateCoupon } = useStore();

  const [promoCode, setPromoCode] = useState(appliedCoupon || '');
  const [promoApplied, setPromoApplied] = useState(discountPercent > 0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    const res = validateCoupon(promoCode);
    if (res.valid) {
      cozyAudio.playCelebration();
      setDiscountPercent(res.discountPercent / 100);
      setAppliedCoupon(promoCode.trim().toUpperCase());
      setPromoApplied(true);
      setPromoMessage(`🎉 ${res.discountPercent}% OFF Applied (${res.description})`);
    } else {
      cozyAudio.playSoftTap();
      alert(`Invalid promo code "${promoCode}". Please check for active coupons like VIKAS30 or VIKASLOVE!`);
    }
  };

  const finalTotal = Math.max(0, subtotal * (1 - discountPercent));
  const progressPercent = Math.min(100, (subtotal / freeGiftThreshold) * 100);

  const handleOpenCheckout = () => {
    try {
      cozyAudio.playSoftTap();
    } catch (e) {}
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-[#FFFDF9] dark:bg-cozy-night-card h-full flex flex-col justify-between shadow-2xl p-6 border-l border-cozy-blush/60 dark:border-cozy-night-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cozy-blush/40 dark:border-cozy-night-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cozy-rose" />
            <h3 className="text-lg font-bold text-[#3E2723] dark:text-white font-serif">
              Your Cuddle Cart ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-cozy-blush/40 dark:bg-cozy-night-cardHover flex items-center justify-center text-cozy-warmBrown dark:text-white hover:bg-cozy-rose hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Gift Milestone Progress Bar */}
        <div className="py-3 px-4 my-2 rounded-2xl bg-cozy-cream dark:bg-cozy-night-cardHover border border-cozy-blush/40 dark:border-cozy-night-border">
          <div className="flex items-center justify-between text-xs font-bold text-cozy-warmBrown dark:text-white mb-1.5">
            <span className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-[#FF6B6B] animate-bounce" />
              {hasFreeGift
                ? '🎉 Free Surprise Gift Unlocked!'
                : `Add ₹${Math.max(freeGiftThreshold - subtotal, 0).toLocaleString('en-IN')} for a Free Special Gift Drop!`}
            </span>
            <span className="text-[#FF6B6B]">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-cozy-blush/50 dark:bg-cozy-night-border overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cozy-rose to-cozy-gold transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List or Empty State */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {cart.length > 0 ? (
            cart.map((item) => {
              if (!item || !item.product) return null;
              const itemImg = item.product.images?.[0] || '/images/products/tinkle-girls-combo-top.png';
              const itemName = item.product.name || 'Cozy Cuddle Item';
              const itemPrice = typeof item.product.price === 'number' ? item.product.price : 0;
              const colorHex = item.selectedColor?.hex || '#FF6B6B';
              const colorName = item.selectedColor?.name || 'Standard';
              const itemSize = item.selectedSize || 'Standard';

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 dark:bg-cozy-night-cardHover border border-cozy-blush/40 dark:border-cozy-night-border shadow-sm"
                >
                  <img
                    src={itemImg}
                    alt={itemName}
                    className="w-16 h-16 object-cover rounded-xl shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#3E2723] dark:text-white truncate">
                      {itemName}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mt-0.5">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: colorHex }}
                        />
                        {colorName}
                      </span>
                      <span>•</span>
                      <span>{itemSize}</span>
                    </div>

                    {item.customEmbroidery && (
                      <div className="text-[10px] text-[#FF6B6B] font-semibold mt-0.5 flex items-center gap-1">
                        <span>🧵 Stitched: "{item.customEmbroidery.babyName}"</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-cozy-warmBrown dark:text-white">
                        ₹{(itemPrice + (item.customEmbroidery ? 199 : 0)).toLocaleString('en-IN')}
                      </span>

                      {/* Qty controller */}
                      <div className="flex items-center gap-1.5 border border-cozy-blush dark:border-cozy-night-border rounded-xl px-1.5 py-0.5 bg-cozy-cream dark:bg-cozy-night-card">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-xs font-bold text-cozy-warmBrown dark:text-white hover:text-cozy-rose px-1 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1 text-cozy-warmBrown dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-xs font-bold text-cozy-warmBrown dark:text-white hover:text-cozy-rose px-1 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-cozy-warmBrown/40 hover:text-red-500 transition p-1 cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 flex flex-col items-center">
              <span className="text-5xl">🛍️</span>
              <h4 className="text-base font-bold text-[#3E2723] dark:text-white mt-2">
                Your cart is empty
              </h4>
              <p className="text-xs text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mt-1">
                Explore our Girls Tops, Boston 91 streetwear drops, and turtlenecks!
              </p>
            </div>
          )}
        </div>

        {/* Footer with Checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-cozy-blush/40 dark:border-cozy-night-border flex flex-col gap-3">
            {/* Promo Code Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (Try: VIKAS30)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-cozy-cream dark:bg-cozy-night-card text-xs font-bold text-[#3E2723] dark:text-white border border-cozy-blush/40 dark:border-cozy-night-border uppercase placeholder:normal-case"
              />
              <button
                onClick={handleApplyPromo}
                className="px-3 py-1.5 rounded-xl bg-[#1F2937] hover:bg-black text-white text-xs font-bold cursor-pointer"
              >
                Apply
              </button>
            </div>

            {promoApplied && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {promoMessage || `${(discountPercent * 100).toFixed(0)}% Promo Discount Applied!`}
              </span>
            )}

            {/* Subtotal & Total */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-cozy-warmBrown/70 dark:text-cozy-night-textMuted">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount ({(discountPercent * 100).toFixed(0)}%):</span>
                  <span>-₹{(subtotal * discountPercent).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-cozy-warmBrown/70 dark:text-cozy-night-textMuted">
                <span>Shipping:</span>
                <span className="text-emerald-600 font-bold">FREE (All India)</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#3E2723] dark:text-white pt-2 border-t border-cozy-blush/30">
                <span>Total:</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleOpenCheckout}
              className="w-full py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" /> Proceed to Checkout (₹{finalTotal.toLocaleString('en-IN')})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
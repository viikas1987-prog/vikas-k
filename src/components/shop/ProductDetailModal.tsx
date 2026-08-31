import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { X, Star, Heart, Check, Sparkles, ShieldCheck, ShoppingBag, ZoomIn } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigateToCustomizer?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onNavigateToCustomizer,
}) => {
  if (!product) return null;

  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { products } = useStore();

  const currentProduct = products.find((p) => p.id === product.id) || product;

  const [selectedColor, setSelectedColor] = useState(
    currentProduct?.colors?.[0] || { name: 'Standard', hex: '#FF6B6B' }
  );
  const [selectedSize, setSelectedSize] = useState(
    currentProduct?.sizes?.[0] || 'Standard'
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || { name: 'Standard', hex: '#FF6B6B' });
      setSelectedSize(product.sizes?.[0] || 'Standard');
      setActiveImageIndex(0);
      setQuantity(1);
      setIsZoomed(false);
    }
  }, [product]);

  const isWishlisted = wishlist.includes(currentProduct.id);

  const handleAddToCart = () => {
    try {
      cozyAudio.playCelebration();
    } catch (err) {}
    addToCart(currentProduct, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  const images = product.images && product.images.length > 0 ? product.images : ['/images/products/tinkle-girls-combo-top.png'];
  const activeImage = images[activeImageIndex] || images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FFFDF9] dark:bg-gray-900 rounded-4xl p-6 md:p-8 border border-rose-100 dark:border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-white hover:bg-[#FF6B6B] hover:text-white transition shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: HD Studio Showcase Photo Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Main Interactive Image Frame */}
            <div 
              className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg p-3 group cursor-zoom-in flex items-center justify-center"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={activeImage}
                alt={product.name}
                className={`w-full h-full object-contain transition-transform duration-500 ${
                  isZoomed ? 'scale-135' : 'group-hover:scale-105'
                }`}
              />

              {/* Floating Quality Seal Badge */}
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-700 px-3 py-1 rounded-full text-[11px] font-bold text-gray-800 dark:text-white shadow-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Quality Inspected</span>
              </div>

              {/* Zoom hint badge */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <ZoomIn className="w-3 h-3" />
                <span>{isZoomed ? 'Click to normal' : 'Click to zoom'}</span>
              </div>
            </div>

            {/* Multi-Angle / Color Variant Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      cozyAudio.playSoftTap();
                      setActiveImageIndex(i);
                    }}
                    className={`w-18 h-18 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white dark:bg-gray-800 flex-shrink-0 cursor-pointer ${
                      activeImageIndex === i
                        ? 'border-[#FF6B6B] ring-2 ring-[#FF6B6B]/30 scale-105 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Value Trust Highlights */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Premium Fabric Feel
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> All-India Fast Delivery
              </span>
            </div>

          </div>

          {/* Right: Product Details & Purchase Controls */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] flex items-center gap-1 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Vikas Kumar Atelier Original
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] dark:text-white leading-tight">
                {product.name}
              </h2>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                {product.tagline}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-gray-400 font-normal">
                    ({product.reviewsCount || 2150} verified buyers)
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                  In Stock • Ready to Ship
                </span>
              </div>
            </div>

            {/* Price in Indian Rupees */}
            <div className="flex items-baseline gap-3 py-2 border-y border-gray-100 dark:border-gray-800">
              <span className="text-3xl sm:text-4xl font-black text-[#1F2937] dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-gray-400 line-through font-semibold">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Color Shade Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2 flex items-center justify-between">
                  <span>Color Shade:</span>
                  <span className="text-xs font-bold text-[#FF6B6B]">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        cozyAudio.playBubblePop();
                        setSelectedColor(c);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 shadow-sm flex items-center justify-center cursor-pointer ${
                        selectedColor.name === c.name
                          ? 'border-[#FF6B6B] ring-2 ring-[#FF6B6B]/40 scale-110'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor.name === c.name && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2 block">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        cozyAudio.playSoftTap();
                        setSelectedSize(s);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#FF6B6B]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Controller & Add to Bag */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-2xl p-1 bg-white dark:bg-gray-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-black text-sm text-[#1F2937] dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Bag — ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-12 h-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-700 hover:text-[#FF6B6B] transition shadow-sm cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#FF6B6B] text-[#FF6B6B]' : ''}`} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

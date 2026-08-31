import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Star, Heart, Check, Eye, Truck } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface AmazonProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
}

export const AmazonProductCard: React.FC<AmazonProductCardProps> = ({
  product,
  onOpenQuickView,
}) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '0-3 Months');
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cozyAudio.playCelebration();
    addToCart(product, selectedColor, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenQuickView(product)}
      className="bg-white dark:bg-[#181C33] rounded-3xl p-4 md:p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative group"
    >
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isAmazonChoice && (
          <span className="bg-[#232F3E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow flex items-center gap-1">
            <span className="text-[#FF9900]">Vikas's</span> Choice
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-[#E67A00] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            #1 Best Seller
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          cozyAudio.playSparkle();
          toggleWishlist(product.id);
        }}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition shadow-sm"
        title="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 mb-3 relative flex items-center justify-center">
        <img
          src={product.images[activeImgIdx] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <span className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-bold px-3 py-1.5 rounded-full bg-white/95 dark:bg-gray-800 text-[#131921] dark:text-white shadow-lg flex items-center gap-1.5 whitespace-nowrap border border-gray-200 dark:border-gray-700">
          <Eye className="w-3.5 h-3.5 text-cozy-rose" /> Interactive 3D 360° Studio
        </span>
      </div>

      <div className="flex items-center gap-1 mb-2 opacity-80 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
        {product.images.map((img, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveImgIdx(i)}
            className={`w-7 h-7 rounded-lg overflow-hidden border cursor-pointer transition ${
              activeImgIdx === i
                ? 'border-cozy-rose ring-1 ring-cozy-rose'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider block">
            {product.brand}
          </span>

          <h3 className="text-xs sm:text-sm font-bold text-[#0F1111] dark:text-white line-clamp-2 leading-snug group-hover:text-cozy-rose transition mt-0.5">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs mt-1">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 text-[#0F1111] dark:text-white font-bold">{product.rating}</span>
            </div>
            <span className="text-gray-400 text-xs">({product.reviewsCount.toLocaleString()})</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold ml-auto">
              ☁️ {product.softnessScore}/10 Softness
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-black text-[#0F1111] dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-[#CC0C39]">
                  ({product.discountPercent}% off)
                </span>
              </>
            )}
          </div>

          <div className="mt-1 space-y-0.5">
            <span className="text-[11px] text-[#007185] dark:text-sky-400 font-bold flex items-center gap-1">
              <Truck className="w-3 h-3" /> {product.estimatedDelivery}
            </span>
            <span className="text-[11px] text-[#007600] font-semibold block">
              In Stock — Ships directly from Vikas Kumar Atelier
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-2.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  cozyAudio.playBubblePop();
                  setSelectedColor(c);
                }}
                className={`w-5 h-5 rounded-full border transition-all ${
                  selectedColor.name === c.name
                    ? 'border-black dark:border-white ring-2 ring-cozy-rose scale-110'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium ml-1">
              {selectedColor.name}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-4 py-2.5 rounded-xl bg-[#FFD814] hover:bg-[#F7CA00] active:scale-98 text-[#0F1111] text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-700" /> Added to Cuddle Bag
            </>
          ) : (
            <span>Add to Cart</span>
          )}
        </button>
      </div>
    </div>
  );
};
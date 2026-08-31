import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Star, Heart, Eye, Sparkles } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuickView }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cozyAudio.playCelebration();
    addToCart(product, selectedColor, product.sizes[0], 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onOpenQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white/80 dark:bg-cozy-night-card/80 backdrop-blur-xl rounded-4xl p-4 md:p-5 border border-cozy-blush/40 dark:border-cozy-night-border shadow-soft-clay hover:shadow-2xl transition-all duration-500 flex flex-col justify-between cursor-pointer relative overflow-hidden"
    >
      {/* Top Badges */}
      <div className="absolute top-7 left-7 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isBestSeller && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cozy-gold/90 text-[#3E2723] shadow-sm flex items-center gap-1 backdrop-blur-md">
            <Sparkles className="w-3 h-3" /> Best Seller
          </span>
        )}
        {product.isNew && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cozy-rose text-white shadow-sm backdrop-blur-md">
            New In
          </span>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-7 right-7 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-cozy-night-card/90 backdrop-blur-md border border-cozy-blush/40 dark:border-cozy-night-border flex items-center justify-center text-cozy-warmBrown dark:text-cozy-night-textMuted hover:scale-110 active:scale-90 transition shadow-sm"
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? 'fill-cozy-rose text-cozy-rose scale-110' : 'hover:text-cozy-rose'
          }`}
        />
      </button>

      {/* Image Container with Zoom & 3D Tag */}
      <div className="w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-cozy-cream to-cozy-blush/30 dark:from-[#1E2548] dark:to-[#171B36] relative mb-4 flex items-center justify-center">
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* 3D Visualizer quick button */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/95 dark:bg-cozy-night-card/95 text-cozy-warmBrown dark:text-cozy-night-accent shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <Eye className="w-3.5 h-3.5 text-cozy-rose" /> 3D 360° Studio View
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2">
        {/* Softness Badge & Rating */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-cozy-rose text-[11px] flex items-center gap-1">
            ☁️ {product.softnessScore}/10 Softness
          </span>
          <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
            <Star className="w-3 h-3 fill-current" />
            <span>{product.rating}</span>
            <span className="text-cozy-warmBrown/50 dark:text-cozy-night-textMuted font-normal">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-[#3E2723] dark:text-white group-hover:text-cozy-rose transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-xs text-cozy-warmBrown/70 dark:text-cozy-night-textMuted line-clamp-1">
          {product.tagline}
        </p>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 my-1" onClick={(e) => e.stopPropagation()}>
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                cozyAudio.playBubblePop();
                setSelectedColor(c);
              }}
              className={`w-5 h-5 rounded-full border transition-all ${
                selectedColor.name === c.name
                  ? 'border-cozy-warmBrown dark:border-white ring-2 ring-cozy-rose/60 scale-110'
                  : 'border-white dark:border-cozy-night-border'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          <span className="text-[10px] text-cozy-warmBrown/60 dark:text-cozy-night-textMuted ml-1">
            {selectedColor.name}
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-cozy-blush/30 dark:border-cozy-night-border">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-cozy-warmBrown dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-cozy-warmBrown/40 dark:text-cozy-night-textMuted line-through font-medium">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-3.5 py-1.5 rounded-xl bg-cozy-rose text-white text-xs font-bold shadow-sm hover:bg-[#F2948E] active:scale-95 transition flex items-center gap-1"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};
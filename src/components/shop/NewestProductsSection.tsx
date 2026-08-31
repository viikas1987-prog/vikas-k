import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface NewestProductsSectionProps {
  onOpenQuickView: (product: Product) => void;
}

export const NewestProductsSection: React.FC<NewestProductsSectionProps> = ({
  onOpenQuickView,
}) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'Girls Tops & Combos', label: 'Girls Tops (2-PC)' },
    { id: 'Kids Turtlenecks & Sweaters', label: 'Turtlenecks & Sweaters' },
    { id: 'Women Gym & Activewear', label: 'Gym Activewear' },
    { id: 'Boston 91 Graphic Streetwear', label: 'Boston 91 Drops' },
    { id: 'Value Combos (2-Pack)', label: 'Value Combos (2-Pack)' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'all' || p.department === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog" className="w-full py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Header matching the photo */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#FF6B6B] font-bold block mb-1">
            Handcrafted at Vikas Kumar Atelier
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Newest Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Verified Supplier Quality · Girls Combos, High-Neck Turtlenecks, Gym Tees & Boston 91 Streetwear
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tops, sweaters, activewear..."
            className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#FF6B6B] shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              cozyAudio.playSoftTap();
              setActiveCategory(c.id);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex-shrink-0 ${
              activeCategory === c.id
                ? 'bg-[#FF6B6B] text-white shadow-md scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid matching photo product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p) => {
          const isWishlisted = wishlist.includes(p.id);

          return (
            <div
              key={p.id}
              onClick={() => onOpenQuickView(p)}
              className="bg-white rounded-3xl p-5 card-soft card-soft-hover flex flex-col justify-between cursor-pointer relative group border border-gray-100/80"
            >
              {/* Discount Tag */}
              {p.discountPercent > 0 && (
                <span className="absolute top-4 left-4 z-10 bg-[#FF6B6B] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  {p.discountPercent}% OFF
                </span>
              )}

              {/* Wishlist Heart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cozyAudio.playSparkle();
                  toggleWishlist(p.id);
                }}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF6B6B] transition shadow-sm"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#FF6B6B] text-[#FF6B6B]' : ''}`} />
              </button>

              {/* Photo Area */}
              <div className="aspect-square rounded-2xl bg-[#FFF9F6] p-2 mb-4 relative overflow-hidden flex items-center justify-center">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />

                <span className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold px-3 py-1.5 rounded-full bg-white/95 text-gray-900 shadow-md flex items-center gap-1 whitespace-nowrap border border-gray-100">
                  <Eye className="w-3.5 h-3.5 text-[#FF6B6B]" /> 3D 360° Studio
                </span>
              </div>

              {/* Info Details */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#FF6B6B] tracking-wider truncate max-w-[150px]">
                    {p.department}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-gray-800 font-bold">{p.rating}</span>
                    <span className="text-gray-400 font-normal">({p.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#FF6B6B] transition">
                  {p.name}
                </h3>

                {/* Price in Rupees (₹) */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-black text-[#FF6B6B]">
                    ₹{p.price.toLocaleString('en-IN')}.00
                  </span>
                  {p.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{p.originalPrice.toLocaleString('en-IN')}.00
                    </span>
                  )}
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cozyAudio.playCelebration();
                    addToCart(p, p.colors[0], p.sizes[0], 1);
                  }}
                  className="w-full mt-3 py-2.5 bg-[#FF6B6B] hover:bg-[#F05252] text-white text-xs font-bold rounded-full transition shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl p-8 card-soft">
          <p className="text-sm font-bold text-gray-500">No products found matching your search.</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-5 py-2 bg-[#FF6B6B] text-white text-xs font-bold rounded-full"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};

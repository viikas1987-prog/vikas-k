import React, { useState } from 'react';
import { products } from '../../data/products';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface ProductCatalogProps {
  onOpenQuickView: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onOpenQuickView }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const categories = [
    { id: 'all', label: '🧸 All Cuddle Products' },
    { id: 'clothes', label: '👶 Baby Clothes & Rompers' },
    { id: 'sleepwear', label: '☁️ Sleep & Swaddles' },
    { id: 'essentials', label: '🧸 Cuddle Plushies' },
    { id: 'nursery', label: '🌿 Teethers & Blankets' },
    { id: 'gift-sets', label: '🎁 Keepsake Hampers' },
  ];

  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <section id="catalog" className="w-full py-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-cozy-blush/60 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-accent inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cozy-gold animate-spin-slow" /> Vikas Kumar’s Handcrafted Collection
        </span>
        <h2 className="text-3xl md:text-5xl font-black mt-3 text-[#3E2723] dark:text-white font-serif">
          The Heart-Melting Catalog
        </h2>
        <p className="text-sm md:text-base text-cozy-warmBrown/80 dark:text-cozy-night-textMuted max-w-2xl mx-auto mt-2 font-medium">
          Pure organic essentials crafted with tender care, zero harsh chemicals, and silky marshmallow softness.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              cozyAudio.playSoftTap();
              setActiveCategory(cat.id);
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? 'bg-cozy-rose text-white shadow-soft-glow scale-105'
                : 'bg-white/80 dark:bg-cozy-night-card/80 text-cozy-warmBrown dark:text-cozy-night-textMuted border border-cozy-blush/40 dark:border-cozy-night-border hover:bg-cozy-peach/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 mb-8 bg-white/60 dark:bg-cozy-night-card/60 backdrop-blur-md p-4 rounded-3xl border border-cozy-blush/40 dark:border-cozy-night-border">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-cozy-warmBrown/40 dark:text-cozy-night-textMuted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rompers, plushies, swaddles..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/90 dark:bg-cozy-night-card border border-cozy-blush/50 dark:border-cozy-night-border text-xs font-semibold text-[#3E2723] dark:text-white focus:outline-none focus:ring-2 focus:ring-cozy-rose"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-cozy-rose" />
          <span className="text-xs font-bold text-cozy-warmBrown dark:text-cozy-night-textMuted">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => {
              cozyAudio.playSoftTap();
              setSortBy(e.target.value as any);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-cozy-night-card border border-cozy-blush/50 dark:border-cozy-night-border text-xs font-bold text-[#3E2723] dark:text-white focus:outline-none focus:ring-2 focus:ring-cozy-rose cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Gentle to Premium</option>
            <option value="price-high">Price: Premium to Gentle</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onOpenQuickView={onOpenQuickView} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/40 dark:bg-cozy-night-card/40 rounded-4xl p-8 border border-cozy-blush/30">
          <span className="text-4xl">🧸</span>
          <h4 className="text-lg font-bold text-[#3E2723] dark:text-white mt-2">
            No cuddle items match your search
          </h4>
          <p className="text-xs text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mt-1">
            Try searching for "romper", "bear", or "cotton"
          </p>
        </div>
      )}
    </section>
  );
};
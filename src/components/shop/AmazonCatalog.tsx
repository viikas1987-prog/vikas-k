import React, { useState } from 'react';
import { products } from '../../data/products';
import { Product } from '../../types';
import { AmazonProductCard } from './AmazonProductCard';
import { SlidersHorizontal, Star, Truck, Check } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface AmazonCatalogProps {
  onOpenQuickView: (product: Product) => void;
}

export const AmazonCatalog: React.FC<AmazonCatalogProps> = ({ onOpenQuickView }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [freeShippingOnly, setFreeShippingOnly] = useState<boolean>(false);

  const departments = [
    { id: 'all', label: 'All Departments' },
    { id: 'clothes', label: 'Baby Clothes & Rompers' },
    { id: 'sleepwear', label: 'Sleep & Swaddles' },
    { id: 'essentials', label: 'Hand-Knitted Cuddle Plush' },
    { id: 'nursery', label: 'Teethers & Nursery Quilts' },
    { id: 'gift-sets', label: 'Newborn Keepsake Hampers' },
  ];

  const materials = [
    { id: 'all', label: 'All Natural Materials' },
    { id: 'GOTS Organic', label: '100% GOTS Organic Cotton' },
    { id: 'Bamboo', label: 'Organic Bamboo Viscose' },
    { id: 'Merino', label: 'Superfine Merino Wool' },
    { id: 'Beechwood', label: 'Natural German Beechwood' },
  ];

  const filteredProducts = products
    .filter((p) => {
      const matchDept = selectedDept === 'all' || p.category === selectedDept;
      const matchMat = selectedMaterial === 'all' || p.material.toLowerCase().includes(selectedMaterial.toLowerCase());
      const matchRating = p.rating >= minRating;
      const matchShipping = !freeShippingOnly || p.deliveryDays <= 1;
      return matchDept && matchMat && matchRating && matchShipping;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <section id="catalog" className="w-full py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 gap-3">
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Baby Store &gt; Handcrafted Collections &gt; Vikas Kumar Originals
          </span>
          <h2 className="text-xl md:text-2xl font-black font-serif text-[#0F1111] dark:text-white mt-1">
            Results (Showing 1-{filteredProducts.length} of {products.length} products)
          </h2>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              cozyAudio.playSoftTap();
              setSortBy(e.target.value as any);
            }}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#181C33] border border-gray-300 dark:border-gray-700 text-xs font-bold text-[#0F1111] dark:text-white cursor-pointer focus:ring-2 focus:ring-[#FF9900]"
          >
            <option value="featured">Featured & Recommended</option>
            <option value="rating">Avg. Customer Review</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 bg-white dark:bg-[#181C33] p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cozy-rose" /> Filters
            </span>
            <button
              onClick={() => {
                setSelectedDept('all');
                setSelectedMaterial('all');
                setMinRating(0);
                setFreeShippingOnly(false);
              }}
              className="text-[11px] font-bold text-cozy-rose hover:underline"
            >
              Clear All
            </button>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F1111] dark:text-white mb-2">Department</h4>
            <div className="space-y-1.5">
              {departments.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    cozyAudio.playSoftTap();
                    setSelectedDept(d.id);
                  }}
                  className={`w-full text-left text-xs font-semibold py-1 px-2 rounded-lg transition flex items-center justify-between ${
                    selectedDept === d.id
                      ? 'bg-cozy-blush/40 dark:bg-gray-700 text-[#0F1111] dark:text-white font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <span>{d.label}</span>
                  {selectedDept === d.id && <Check className="w-3.5 h-3.5 text-cozy-rose" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F1111] dark:text-white mb-2">Delivery Speed</h4>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={freeShippingOnly}
                onChange={() => setFreeShippingOnly(!freeShippingOnly)}
                className="accent-cozy-rose cursor-pointer"
              />
              <span className="text-[#007185] dark:text-sky-400 font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Next-Day Guaranteed
              </span>
            </label>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F1111] dark:text-white mb-2">Customer Review</h4>
            <div className="space-y-1">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => {
                    cozyAudio.playSoftTap();
                    setMinRating(minRating === stars ? 0 : stars);
                  }}
                  className={`w-full flex items-center gap-1.5 text-xs py-1 px-2 rounded-lg transition ${
                    minRating === stars ? 'bg-amber-50 dark:bg-gray-700 font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < stars ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">& Up</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F1111] dark:text-white mb-2">Natural Fabric & Weave</h4>
            <div className="space-y-1.5">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    cozyAudio.playSoftTap();
                    setSelectedMaterial(m.id);
                  }}
                  className={`w-full text-left text-xs font-semibold py-1 px-2 rounded-lg transition flex items-center justify-between ${
                    selectedMaterial === m.id
                      ? 'bg-cozy-blush/40 dark:bg-gray-700 text-[#0F1111] dark:text-white font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black'
                  }`}
                >
                  <span>{m.label}</span>
                  {selectedMaterial === m.id && <Check className="w-3.5 h-3.5 text-cozy-rose" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <AmazonProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={onOpenQuickView}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#181C33] rounded-3xl p-8 border border-gray-200 dark:border-gray-800">
              <span className="text-4xl">🧸</span>
              <h4 className="text-lg font-bold text-[#0F1111] dark:text-white mt-2">
                No matching products found
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Try resetting your filters to explore all handcrafted baby essentials.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
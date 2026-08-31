import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, Camera, MessageSquare, Filter, ShieldCheck } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export const AmazonReviewsSection: React.FC = () => {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const reviewsList = [
    {
      id: 'rev-1',
      author: 'Ananya Sharma (Verified Buyer, New Delhi)',
      verified: true,
      rating: 5,
      date: 'Reviewed in India on August 24, 2026',
      variant: 'Product: Tinkle Comfy Girls Tops (2-PC Combo) | Size: 7-8 Years',
      title: 'Amazing quality! The drawstrings and floral prints are gorgeous.',
      comment:
        'Purchased the 2-PC Pink & Sky Blue combo for my daughter. The cotton blend is super soft, lightweight, and breathable. The ruched side strings let you adjust the fit nicely. It has survived 4 machine washes with zero fading or shrinkage. Unbeatable value!',
      helpfulCount: 114,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      photos: [
        '/images/products/tinkle-girls-combo-top.png',
        '/images/products/tinkle-trendy-girls-top.png'
      ]
    },
    {
      id: 'rev-2',
      author: 'Rohan Mehra (Verified Buyer, Mumbai)',
      verified: true,
      rating: 5,
      date: 'Reviewed in India on August 20, 2026',
      variant: 'Product: Boston 91 Retro Graphic Oversized Tee | Size: L',
      title: 'The best heavyweight 240 GSM drop! Vintage look is 10/10.',
      comment:
        'The collar is thick, the drop shoulder drape is perfect, and the royal blue shade looks even richer in person. If you love streetwear, this Boston 91 tee from Vikas Kumar Atelier is a must-have.',
      helpfulCount: 92,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      photos: [
        '/images/products/boston-91-blue-streetwear.png',
        '/images/products/boston-91-combo-pack.png'
      ]
    },
    {
      id: 'rev-3',
      author: 'Pooja Verma (Verified Buyer, Bengaluru)',
      verified: true,
      rating: 5,
      date: 'Reviewed in India on August 15, 2026',
      variant: 'Product: Princess Stylish Black Turtleneck Sweater | Size: 9-10 Years',
      title: 'Super soft, 100% itch-free winter essential!',
      comment:
        'The foldover high-neck collar keeps my daughter warm without suffocating or itching her neck. It is stretchy and looks very stylish paired with jeans. Fast 1-day delivery too!',
      helpfulCount: 68,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      photos: [
        '/images/products/princess-girls-turtleneck.png'
      ]
    }
  ];

  const handleHelpful = (id: string) => {
    cozyAudio.playSparkle();
    if (votedMap[id]) return;
    setHelpfulMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setVotedMap((prev) => ({ ...prev, [id]: true }));
  };

  const ratingsDistribution = [
    { stars: 5, percent: 88, count: '1,304' },
    { stars: 4, percent: 8, count: '118' },
    { stars: 3, percent: 2, count: '30' },
    { stars: 2, percent: 1, count: '15' },
    { stars: 1, percent: 1, count: '15' },
  ];

  return (
    <section className="w-full py-12 px-4 md:px-8 max-w-7xl mx-auto border-t border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Rating Histogram */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h3 className="text-xl font-bold font-serif text-[#0F1111] dark:text-white">
              Customer Reviews & Ratings
            </h3>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-xl font-black text-[#0F1111] dark:text-white">
                4.9 out of 5
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
              Based on 1,482 verified global parent ratings
            </span>
          </div>

          {/* Histogram Bars */}
          <div className="space-y-2">
            {ratingsDistribution.map((r) => (
              <div
                key={r.stars}
                onClick={() => setFilterRating(filterRating === r.stars ? null : r.stars)}
                className="flex items-center gap-3 text-xs cursor-pointer group"
              >
                <span className="w-12 text-[#007185] dark:text-sky-400 group-hover:underline font-semibold">
                  {r.stars} star
                </span>
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-[#FFA41C] rounded-sm transition-all duration-500"
                    style={{ width: `${r.percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-500 font-medium">{r.percent}%</span>
              </div>
            ))}
          </div>

          {/* Value Highlights */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#181C33] border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
            <h5 className="font-bold text-[#0F1111] dark:text-white">By Customer Feature</h5>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Softness on Newborn Skin</span>
              <span className="text-amber-500 font-bold">5.0 ★</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Gift Presentation & Box</span>
              <span className="text-amber-500 font-bold">5.0 ★</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Durability after 30+ Washes</span>
              <span className="text-amber-500 font-bold">4.9 ★</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Easy Diaper Snap Access</span>
              <span className="text-amber-500 font-bold">4.9 ★</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Photo Rail & Written Reviews */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Customer Photos Gallery Rail */}
          <div>
            <h4 className="text-sm font-bold text-[#0F1111] dark:text-white flex items-center gap-1.5 mb-3">
              <Camera className="w-4 h-4 text-[#FF6B6B]" /> Reviews with Images from Verified Buyers
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[
                '/images/products/tinkle-girls-combo-top.png',
                '/images/products/princess-girls-turtleneck.png',
                '/images/products/boston-91-blue-streetwear.png',
                '/images/products/women-sports-active-grey.png',
                '/images/products/boston-91-combo-pack.png',
                '/images/products/cutiepie-girls-turtleneck.png',
              ].map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 hover:scale-105 transition bg-gray-50 p-1"
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews List */}
          <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="space-y-2 border-b border-gray-100 dark:border-gray-800 pb-6">
                
                {/* Author row */}
                <div className="flex items-center gap-2">
                  <img src={rev.avatar} alt={rev.author} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-xs font-bold text-[#0F1111] dark:text-white">{rev.author}</span>
                </div>

                {/* Rating & Title */}
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <h5 className="text-xs font-bold text-[#0F1111] dark:text-white">{rev.title}</h5>
                </div>

                {/* Date & Variant */}
                <div className="text-[11px] text-gray-500 dark:text-gray-400 space-y-0.5">
                  <p>{rev.date}</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    {rev.variant} •{' '}
                    <span className="text-[#C45500] font-bold">Verified Purchase</span>
                  </p>
                </div>

                {/* Comment body */}
                <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                  {rev.comment}
                </p>

                {/* Attached review photos */}
                {rev.photos.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    {rev.photos.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    ))}
                  </div>
                )}

                {/* Helpful voting */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleHelpful(rev.id)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                      votedMap[rev.id]
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.helpfulCount + (helpfulMap[rev.id] || 0)})</span>
                  </button>
                  <span className="text-[11px] text-gray-400">| Report abuse</span>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
import React, { useState } from 'react';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { HelpCircle, Sparkles, Heart, RotateCcw, Check, ShoppingBag } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

export const MilestoneQuiz: React.FC = () => {
  const { addToCart } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ audience?: string; vibe?: string; palette?: string }>({});
  const [recommendedProduct, setRecommendedProduct] = useState<any>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const questions = [
    {
      title: '1. Who are you styling or shopping for today?',
      options: [
        { label: '👧 Trendy Girls Everyday & Party Wear', key: 'girls', desc: 'Cute floral 2-pc sets and comfy knits' },
        { label: '🛹 Unisex Streetwear & College Fits', key: 'streetwear', desc: 'Heavyweight 240 GSM oversized drops' },
        { label: '🏋️‍♀️ Women Activewear & Gym Training', key: 'gym', desc: 'Dri-Fit breathable stretch tees' },
        { label: '🎁 Gift Box for Loved Ones', key: 'gift', desc: 'Curated premium combos & hampers' },
      ],
    },
    {
      title: '2. What is your top fit and style priority?',
      options: [
        { label: '🌸 Floral Prints & Adjustable Drawstrings', key: 'floral', desc: 'Customizable side ties and soft cotton' },
        { label: '🖤 Elegant High-Neck Foldover Collar', key: 'turtleneck', desc: 'Cozy, zero-itch thermal knits' },
        { label: '⭐ Vintage 90s Distressed Star Graphic', key: 'vintage_stars', desc: 'Signature Boston 91 oversized silhouette' },
        { label: '💨 Moisture-Wicking & Featherlight Feel', key: 'drifit', desc: 'Maximum mobility and cooling airflow' },
      ],
    },
    {
      title: '3. What color vibe best matches your mood?',
      options: [
        { label: '💙 Royal Cobalt Blue & Deep Navy', key: 'blue', desc: 'Bold, head-turning streetwear tone' },
        { label: '🌸 Blossom Pink & Pastel Sky Blue', key: 'pastel', desc: 'Playful, cheerful twin combo tones' },
        { label: '🖤 Pitch Midnight Black & Charcoal', key: 'black', desc: 'Timeless versatile aesthetic' },
        { label: '🌪️ Heather Grey & Athletic Rose', key: 'grey', desc: 'High-performance sporty vibes' },
      ],
    },
  ];

  const handleSelectOption = (key: string) => {
    cozyAudio.playBubblePop();
    const currentKey = step === 0 ? 'audience' : step === 1 ? 'vibe' : 'palette';
    const updated = { ...answers, [currentKey]: key };
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateRecommendation(updated);
    }
  };

  const calculateRecommendation = (finalAnswers: any) => {
    cozyAudio.playCelebration();
    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#FF6B6B', '#6BBF7A', '#6EB5FF', '#FFD166'],
      });
    } catch (e) {
      // Confetti fallback
    }

    let found: any = null;

    if (finalAnswers.vibe === 'turtleneck') {
      found = products.find((p) => p.id === 'princess-stylish-girls-sweater') || products.find((p) => p.id === 'cutiepie-girls-black-turtleneck');
    } else if (finalAnswers.vibe === 'drifit' || finalAnswers.audience === 'gym') {
      found = products.find((p) => p.id === 'stylish-women-sports-grey') || products.find((p) => p.id === 'stylus-women-gym-combo');
    } else if (finalAnswers.vibe === 'vintage_stars' || finalAnswers.audience === 'streetwear') {
      found = products.find((p) => p.id === 'boston-91-retro-tshirt') || products.find((p) => p.id === 'boston-91-streetwear-duo-pack');
    } else if (finalAnswers.vibe === 'floral' || finalAnswers.audience === 'girls') {
      found = products.find((p) => p.id === 'tinkle-comfy-girls-2pc-combo') || products.find((p) => p.id === 'tinkle-trendy-girls-top');
    } else {
      found = products[0];
    }

    // Safety fallback
    setRecommendedProduct(found || products[0]);
    setStep(3);
  };

  const handleAddToCart = () => {
    if (!recommendedProduct) return;
    cozyAudio.playCelebration();
    addToCart(recommendedProduct, recommendedProduct.colors?.[0], recommendedProduct.sizes?.[0], 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const resetQuiz = () => {
    cozyAudio.playSoftTap();
    setStep(0);
    setAnswers({});
    setRecommendedProduct(null);
    setAddedToCart(false);
  };

  return (
    <section id="quiz" className="w-full py-16 px-4 md:px-8 max-w-5xl mx-auto select-none">
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFF3EC] to-[#FCEEEA] dark:from-[#1E2442] dark:via-[#1B203B] dark:to-[#171B36] p-8 md:p-12 rounded-4xl border border-rose-100 dark:border-gray-700 shadow-xl relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6B6B]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 text-[#FF6B6B] shadow-sm inline-flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#FF6B6B]" /> 30-Second Style & Fit Matcher
          </span>
          <h2 className="text-2xl md:text-4xl font-black mt-3 text-[#1F2937] dark:text-white">
            Find Your Perfect Outfit Match
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">
            Answer 3 quick style questions and let Vikas Kumar’s styling guide suggest your ideal wardrobe drop.
          </p>
        </div>

        {step < 3 ? (
          <div className="max-w-xl mx-auto">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === step ? 'w-10 bg-[#FF6B6B]' : 'w-2.5 bg-rose-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <h3 className="text-lg md:text-xl font-black text-center text-[#1F2937] dark:text-white mb-6">
              {questions[step].title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  className="p-4 rounded-2xl bg-white/95 dark:bg-gray-800 border border-rose-100 dark:border-gray-700 text-left font-bold text-xs md:text-sm text-[#1F2937] dark:text-white hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] dark:hover:bg-[#FF6B6B] hover:scale-102 active:scale-98 transition shadow-sm cursor-pointer group"
                >
                  <span className="block font-bold group-hover:text-white mb-1">
                    {opt.label}
                  </span>
                  <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400 group-hover:text-white/90">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : recommendedProduct ? (
          <div className="max-w-xl mx-auto flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B] flex items-center gap-1 mb-2">
              <Sparkles className="w-4 h-4 text-[#FFD166]" /> Vikas Kumar's Recommended Pick for You
            </span>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-rose-100 dark:border-gray-700 shadow-xl w-full flex flex-col sm:flex-row items-center gap-6 mt-2">
              <div className="w-36 h-36 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-1">
                <img
                  src={recommendedProduct.images?.[0]}
                  alt={recommendedProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    98% Match Score
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold">
                    ★ {recommendedProduct.rating || 4.9}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-[#1F2937] dark:text-white line-clamp-1">
                  {recommendedProduct.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed line-clamp-2">
                  {recommendedProduct.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-[#1F2937] dark:text-white">
                      ₹{recommendedProduct.price?.toLocaleString('en-IN')}
                    </span>
                    {recommendedProduct.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{recommendedProduct.originalPrice?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#F05252] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to Bag!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="mt-6 text-xs font-semibold text-gray-500 hover:text-[#FF6B6B] transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Style Matcher Quiz
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

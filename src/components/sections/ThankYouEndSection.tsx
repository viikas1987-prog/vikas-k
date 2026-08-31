import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Copy, Check, ArrowUp, Star, Gift, ShoppingBag, ShieldCheck } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export const ThankYouEndSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [loveCount, setLoveCount] = useState(2840);
  const [hasSentLove, setHasSentLove] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            triggerConfetti();
          }
        });
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const triggerConfetti = () => {
    try {
      cozyAudio.playCelebration();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#FF6B6B', '#FFA8A8', '#6BBF7A', '#6EB5FF', '#FFD166'],
      });
    } catch (e) {
      // Fallback
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('VIKAS30');
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendLove = () => {
    if (hasSentLove) return;
    setLoveCount((prev) => prev + 1);
    setHasSentLove(true);
    triggerConfetti();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="thank-you"
      className="w-full py-16 px-4 sm:px-8 max-w-7xl mx-auto relative select-none"
    >
      <div className="relative rounded-4xl bg-gradient-to-tr from-[#1F2937] via-[#2A3444] to-[#1F2937] text-white p-8 sm:p-14 shadow-2xl border border-gray-700/60 overflow-hidden text-center">
        
        {/* Glowing Background Radial Flares */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF6B6B]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-80 h-80 bg-[#6EB5FF]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Celebration Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm font-bold text-[#FF8E71] backdrop-blur-md mb-6 shadow-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-[#FFD166] fill-[#FFD166]" />
          <span>Special Appreciation from Vikas Kumar</span>
        </div>

        {/* Huge Animated Thank You Typography */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-none mb-4 drop-shadow-md">
          THANK YOU <span className="text-[#FF6B6B]">FOR VISITING!</span>
        </h2>

        <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
          Every piece in our catalog is created with dedication to comfort, fit, and style. We are deeply grateful for your support in making us a #1 verified fashion supplier.
        </p>

        {/* Loyalty Reward Voucher Box */}
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 mb-8 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-2 text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFD166] flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-[#FFD166]" /> Exclusive 30% Off Reward Code
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              Valid All Orders
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-2xl p-2 sm:p-2.5">
            <span className="font-mono text-lg sm:text-xl font-black text-white tracking-widest pl-3">
              VIKAS30
            </span>
            <button
              onClick={handleCopyCode}
              className="px-5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Interactive Love Counter & Scroll To Top */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={handleSendLove}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 ${
              hasSentLove
                ? 'bg-white text-[#FF6B6B] shadow-xl'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 text-[#FF6B6B] ${hasSentLove ? 'fill-[#FF6B6B] animate-ping' : ''}`} />
            <span>{hasSentLove ? 'Thank you for your love!' : `Send Love (${loveCount.toLocaleString()})`}</span>
          </button>

          <button
            onClick={scrollToTop}
            className="px-6 py-3 rounded-full bg-[#FF6B6B] hover:bg-[#F05252] text-white text-xs sm:text-sm font-bold transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Back to Top</span>
          </button>
        </div>

        {/* Guarantee footer pills */}
        <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-center gap-6 flex-wrap text-xs text-gray-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Quality Inspected
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 25k+ 5-Star Reviews
          </span>
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-[#6EB5FF]" /> Fast Dispatch Across India
          </span>
        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Heart, Send, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    cozyAudio.playCelebration();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#FFF5EE] dark:bg-[#0A0D17] border-t border-cozy-blush/50 dark:border-cozy-night-border pt-16 pb-12 px-4 md:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cozy-blush to-cozy-peach dark:from-[#2A3158] dark:to-cozy-night-cardHover flex items-center justify-center text-xl shadow-sm">
              🧸
            </div>
            <div>
              <span className="font-serif font-black text-xl text-[#3E2723] dark:text-white tracking-tight leading-none block">
                Cozy Cuddle <span className="text-cozy-rose text-xs font-bold font-sans">3D</span>
              </span>
              <span className="text-[10px] font-semibold text-cozy-warmBrown/70 dark:text-cozy-night-textMuted tracking-wider uppercase">
                Artisan Studio by Vikas Kumar
              </span>
            </div>
          </div>

          <p className="text-xs text-cozy-warmBrown/80 dark:text-cozy-night-textMuted leading-relaxed max-w-sm">
            Handcrafted 100% GOTS certified organic baby apparel, cuddly hand-knitted companions, and personalized silk name embroidery designed to make every newborn slumber peaceful and pure.
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-cozy-warmBrown dark:text-cozy-night-accent">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Tested & Certified Safe for Delicate Infant Skin</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cozy-rose mb-2">
            Collections
          </h4>
          <a href="#catalog" className="text-xs font-semibold text-cozy-warmBrown/80 dark:text-cozy-night-textMuted hover:text-cozy-rose transition">
            Cloud Rompers
          </a>
          <a href="#catalog" className="text-xs font-semibold text-cozy-warmBrown/80 dark:text-cozy-night-textMuted hover:text-cozy-rose transition">
            Bambi Cuddle Bear
          </a>
          <a href="#catalog" className="text-xs font-semibold text-cozy-warmBrown/80 dark:text-cozy-night-textMuted hover:text-cozy-rose transition">
            Bamboo Swaddles
          </a>
          <a href="#customizer" className="text-xs font-semibold text-cozy-warmBrown/80 dark:text-cozy-night-textMuted hover:text-cozy-rose transition">
            Name Embroidery Studio
          </a>
          <a href="#gift-studio" className="text-xs font-semibold text-cozy-warmBrown/80 dark:text-cozy-night-textMuted hover:text-cozy-rose transition">
            Keepsake Cuddle Box
          </a>
        </div>

        {/* Founder & Care */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cozy-rose mb-2">
            Artisan Care
          </h4>
          <a href="#about" className="text-xs font-semibold text-cozy-warmBrown/80 dark:text-cozy-night-textMuted hover:text-cozy-rose transition">
            About Vikas Kumar
          </a>
          <a
            href="https://wa.me/918360303562?text=Hello%20Vikas%20Kumar,%20I%20have%20an%20inquiry%20about%20my%20order!"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>📱 +91 83603 03562</span>
          </a>
          <span className="text-xs font-semibold text-cozy-warmBrown/80 dark:text-cozy-night-textMuted cursor-pointer hover:text-cozy-rose">
            Fabric Washing Guide
          </span>
          <span className="text-xs font-semibold text-cozy-warmBrown/80 dark:text-cozy-night-textMuted cursor-pointer hover:text-cozy-rose">
            Organic Certifications
          </span>
        </div>

        {/* Newsletter Signup */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cozy-rose">
            Join the Cuddle Family
          </h4>
          <p className="text-xs text-cozy-warmBrown/75 dark:text-cozy-night-textMuted">
            Get 10% off your first baby cuddle box plus soothing parenting tips.
          </p>

          <form onSubmit={handleSubscribe} className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address..."
              required
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-cozy-night-card border border-cozy-blush/60 dark:border-cozy-night-border text-xs text-[#3E2723] dark:text-white focus:outline-none focus:ring-2 focus:ring-cozy-rose shadow-inner"
            />
            <button
              type="submit"
              className="p-2.5 rounded-2xl bg-cozy-rose text-white hover:opacity-90 transition shadow-sm"
              title="Subscribe"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {subscribed && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to the family! Promo code: VIKASLOVE
            </span>
          )}
        </div>

      </div>

      {/* Bottom Copyright & Founder Credit */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-cozy-blush/30 dark:border-cozy-night-border flex flex-col sm:flex-row items-center justify-between text-xs text-cozy-warmBrown/60 dark:text-cozy-night-textMuted gap-3">
        <p>
          © 2026 Cozy Cuddle Studio. All rights reserved. Handcrafted & Run by Vikas Kumar with ❤️
        </p>
        <div className="flex items-center gap-4">
          <span className="hover:text-cozy-rose cursor-pointer">Privacy Policy</span>
          <span className="hover:text-cozy-rose cursor-pointer">Terms of Comfort</span>
          <a href="#admin" className="hover:text-cozy-rose cursor-pointer opacity-70 hover:opacity-100 transition">
            🔒 Staff Portal
          </a>
        </div>
      </div>
    </footer>
  );
};
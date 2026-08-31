import React from 'react';
import { ShieldCheck, Truck, Sparkles, RefreshCw, HeartHandshake } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: ShieldCheck,
      title: '100% GOTS Organic',
      desc: 'Free of chemical pesticides & formaldehyde',
    },
    {
      icon: Truck,
      title: 'Free Worldwide Shipping',
      desc: 'On all cuddle orders over ₹75 with tracking',
    },
    {
      icon: HeartHandshake,
      title: 'Vikas Kumar Guarantee',
      desc: 'Love it in 30 days or full refund, guaranteed',
    },
    {
      icon: Sparkles,
      title: 'Silk Thread Embroidery',
      desc: 'Custom heirloom baby name personalization',
    },
  ];

  return (
    <section className="w-full py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white/60 dark:bg-cozy-night-card/60 backdrop-blur-md border border-cozy-blush/30 dark:border-cozy-night-border shadow-sm flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-cozy-blush/80 dark:bg-cozy-night-cardHover text-cozy-rose dark:text-cozy-night-accent flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#3E2723] dark:text-white">{b.title}</h4>
                <p className="text-[11px] text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mt-0.5 leading-snug">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
import React from 'react';
import { cozyAudio } from '../../utils/audioSynth';

interface ShopByMilestoneProps {
  onSelectMilestone: (tag: string) => void;
}

export const ShopByMilestone: React.FC<ShopByMilestoneProps> = ({ onSelectMilestone }) => {
  const milestones = [
    {
      label: 'Newborn (0-3M)',
      sub: 'Scratch-free comfort',
      img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80',
      tag: '0-3 Months',
    },
    {
      label: 'Infant (3-6M)',
      sub: 'Tummy time & rolling',
      img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80',
      tag: '3-6 Months',
    },
    {
      label: 'Crawler (6-12M)',
      sub: 'Non-slip grip & flex',
      img: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=400&q=80',
      tag: '6-12 Months',
    },
    {
      label: 'Cuddle Toys',
      sub: 'First bedtime friends',
      img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80',
      tag: 'essentials',
    },
    {
      label: 'Gift Chests',
      sub: 'Luxury baby showers',
      img: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=400&q=80',
      tag: 'gift-sets',
    },
  ];

  return (
    <section className="w-full py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-bold font-serif text-[#0F1111] dark:text-white">
            Shop by Baby Stage & Milestone
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tailored ergonomic designs for every precious developmental growth step.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {milestones.map((m, i) => (
          <div
            key={i}
            onClick={() => {
              cozyAudio.playSoftTap();
              onSelectMilestone(m.tag);
            }}
            className="group flex flex-col items-center text-center cursor-pointer p-3 rounded-2xl bg-white dark:bg-[#181C33] border border-gray-200 dark:border-gray-800 hover:border-cozy-rose hover:shadow-md transition"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 p-1 border-2 border-transparent group-hover:border-cozy-rose transition-all mb-3 shadow-inner">
              <img
                src={m.img}
                alt={m.label}
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h4 className="text-xs font-bold text-[#0F1111] dark:text-white group-hover:text-cozy-rose">
              {m.label}
            </h4>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {m.sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
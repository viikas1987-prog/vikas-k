import React from 'react';
import { Menu, Sparkles, Tag, Gift, Scissors, Camera, HeartHandshake, ShieldCheck } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface CategorySubNavProps {
  onNavigate: (sectionId: string) => void;
}

export const CategorySubNav: React.FC<CategorySubNavProps> = ({ onNavigate }) => {
  const links = [
    { label: "Today's Lightning Deals", id: 'deals', icon: Tag, highlight: true },
    { label: 'Newborn (0-3M)', id: 'catalog', icon: null },
    { label: 'Organic Rompers', id: 'catalog', icon: null },
    { label: 'Bambi Cuddle Bear', id: 'catalog', icon: null },
    { label: '3D Name Embroidery Studio', id: 'customizer', icon: Scissors, highlight: true },
    { label: 'Build-a-Cuddle Gift Chest', id: 'gift-studio', icon: Gift },
    { label: 'Moments Photo Gallery', id: 'gallery', icon: Camera },
    { label: 'Vikas Kumar Story', id: 'about', icon: HeartHandshake },
  ];

  const handleClick = (id: string) => {
    cozyAudio.playSoftTap();
    onNavigate(id);
  };

  return (
    <div className="w-full bg-[#232F3E] dark:bg-[#141A29] text-white text-xs font-semibold py-1.5 px-4 md:px-8 border-b border-white/10 shadow-sm overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-5 whitespace-nowrap">
        
        {/* All Departments button */}
        <button
          onClick={() => handleClick('catalog')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:outline hover:outline-1 hover:outline-white font-bold transition flex-shrink-0"
        >
          <Menu className="w-4 h-4 text-white" />
          <span>All Baby Departments</span>
        </button>

        {/* Links */}
        <div className="flex items-center gap-4">
          {links.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleClick(item.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white transition ${
                  item.highlight
                    ? 'text-[#F0C14B] font-bold'
                    : 'text-gray-200 hover:text-white font-medium'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-cozy-rose" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Assurance Badge */}
        <div className="ml-auto hidden xl:flex items-center gap-1.5 text-gray-300 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% GOTS Organic & Hypoallergenic Certified</span>
        </div>

      </div>
    </div>
  );
};

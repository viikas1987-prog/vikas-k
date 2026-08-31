import React from 'react';
import { Sparkles } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export type HeroMode = 'vortx' | 'mainframe' | '3d-cuddle';

interface HeroModeSwitcherProps {
  mode: HeroMode;
  onSelectMode: (mode: HeroMode) => void;
}

export const HeroModeSwitcher: React.FC<HeroModeSwitcherProps> = ({ mode, onSelectMode }) => {
  const modes: { id: HeroMode; label: string; icon: string }[] = [
    { id: 'vortx', label: 'VortxLab UI', icon: '💠' },
    { id: 'mainframe', label: 'Mainframe® A.R.I.A', icon: '✳︎' },
    { id: '3d-cuddle', label: '3D Baby Studio', icon: '🧸' },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-black/80 backdrop-blur-md border border-white/20 p-1 rounded-full shadow-2xl flex items-center gap-1 text-xs">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => {
            cozyAudio.playSoftTap();
            onSelectMode(m.id);
          }}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            mode === m.id
              ? 'bg-white text-black shadow-md scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>{m.icon}</span>
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
};

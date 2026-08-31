import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export const BubblePopGame: React.FC = () => {
  const [poppedCount, setPoppedCount] = useState(0);
  const [bubbles, setBubbles] = useState([
    { id: 1, text: '👶 Giggle', x: 12, y: 35, popped: false },
    { id: 2, text: '🧸 Warm Hug', x: 32, y: 65, popped: false },
    { id: 3, text: '☁️ Sweet Nap', x: 52, y: 25, popped: false },
    { id: 4, text: '⭐ Starlight', x: 72, y: 65, popped: false },
    { id: 5, text: '🍼 Cozy Milk', x: 88, y: 35, popped: false },
  ]);

  const pop = (id: number) => {
    cozyAudio.playBubblePop();
    setPoppedCount((c) => c + 1);
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    setTimeout(() => {
      setBubbles((prev) =>
        prev.map((b) => (b.id === id ? { ...b, popped: false } : b))
      );
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6 rounded-4xl bg-white/70 dark:bg-cozy-night-card/70 backdrop-blur-xl border border-cozy-blush/40 dark:border-cozy-night-border shadow-soft-clay flex flex-col items-center text-center relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-cozy-gold" />
        <span className="text-xs font-bold uppercase tracking-wider text-cozy-warmBrown dark:text-cozy-night-accent">
          Zen Parent Relaxation Corner
        </span>
      </div>

      <h4 className="text-xl font-bold text-[#3E2723] dark:text-white">
        Pop the Sleepy Baby Bubbles (Popped: {poppedCount} ✨)
      </h4>
      <p className="text-xs text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mt-1">
        Take a gentle breath. Click any floating bubble to hear sweet musical chimes.
      </p>

      <div className="w-full h-32 relative mt-4">
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => pop(b.id)}
            disabled={b.popped}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              b.popped
                ? 'scale-0 opacity-0'
                : 'scale-100 opacity-100 bg-gradient-to-r from-cozy-blush to-cozy-peach text-[#3E2723] hover:scale-110 active:scale-95 animate-float-slow'
            }`}
          >
            <span>{b.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
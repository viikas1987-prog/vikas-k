import React, { useState } from 'react';
import { useSound, AmbientTrack } from '../../context/SoundContext';
import { Volume2, VolumeX, Music, CloudRain, Heart, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export const FloatingSoundBar: React.FC = () => {
  const { isPlaying, activeTrack, volume, toggleSound, setTrack, setVolume } = useSound();
  const [isExpanded, setIsExpanded] = useState(false);

  const tracks: { id: AmbientTrack; label: string; icon: any; desc: string }[] = [
    { id: 'lullaby', label: 'Music Box Lullaby', icon: Music, desc: 'Dreamy celesta chimes' },
    { id: 'rain', label: 'Gentle Rain on Window', icon: CloudRain, desc: 'Calming pink noise' },
    { id: 'heartbeat', label: 'Mother’s Heartbeat', icon: Heart, desc: 'Womb acoustic rhythm' },
    { id: 'whitenoise', label: 'Cozy White Noise', icon: Sparkles, desc: 'Sleep aid sound' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      {/* Expanded Track Picker Drawer */}
      {isExpanded && (
        <div className="mb-2 p-4 rounded-3xl bg-white/95 dark:bg-cozy-night-card/95 backdrop-blur-2xl border border-cozy-blush/60 dark:border-cozy-night-border shadow-2xl w-64 animate-fade-in flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-cozy-blush/30 dark:border-cozy-night-border pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cozy-rose flex items-center gap-1">
              <Music className="w-3.5 h-3.5" /> Nursery Soundscape
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-cozy-warmBrown/60 dark:text-cozy-night-textMuted hover:text-cozy-rose"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            {tracks.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    cozyAudio.playSoftTap();
                    setTrack(t.id);
                  }}
                  className={`w-full p-2.5 rounded-2xl text-left text-xs font-bold transition flex items-center gap-2.5 ${
                    activeTrack === t.id && isPlaying
                      ? 'bg-cozy-rose text-white shadow-soft-glow'
                      : 'bg-cozy-cream/60 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-textMuted hover:bg-cozy-peach/30'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <span className="block leading-tight">{t.label}</span>
                    <span className="text-[10px] font-normal opacity-80">{t.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className="pt-2 border-t border-cozy-blush/30 dark:border-cozy-night-border">
            <div className="flex justify-between text-[10px] font-bold text-cozy-warmBrown/70 dark:text-cozy-night-textMuted mb-1">
              <span>Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-cozy-rose cursor-pointer h-1.5 bg-cozy-blush/40 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Floating Pill Button */}
      <div className="flex items-center gap-2 bg-white/90 dark:bg-cozy-night-card/90 backdrop-blur-xl p-1.5 pl-3 rounded-full border border-cozy-blush/60 dark:border-cozy-night-border shadow-soft-clay">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-bold text-cozy-warmBrown dark:text-white hover:text-cozy-rose transition pr-1"
        >
          <span>🎵 {isPlaying ? 'Playing Nursery Audio' : 'Ambient Lullaby'}</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={toggleSound}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
            isPlaying
              ? 'bg-cozy-rose text-white animate-pulse'
              : 'bg-cozy-blush/60 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-white'
          }`}
        >
          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
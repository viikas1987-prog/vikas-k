import React, { createContext, useContext, useState } from 'react';
import { cozyAudio } from '../utils/audioSynth';

export type AmbientTrack = 'lullaby' | 'rain' | 'heartbeat' | 'whitenoise';

interface SoundContextType {
  isPlaying: boolean;
  activeTrack: AmbientTrack;
  volume: number;
  toggleSound: () => void;
  setTrack: (track: AmbientTrack) => void;
  setVolume: (vol: number) => void;
  playSfx: (type: 'pop' | 'sparkle' | 'tap' | 'celebrate') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState<AmbientTrack>('lullaby');
  const [volume, setVolumeState] = useState(0.5);

  const toggleSound = () => {
    if (isPlaying) {
      cozyAudio.stopAmbient();
      setIsPlaying(false);
    } else {
      cozyAudio.startAmbient(activeTrack);
      setIsPlaying(true);
    }
  };

  const setTrack = (track: AmbientTrack) => {
    setActiveTrack(track);
    if (isPlaying) {
      cozyAudio.startAmbient(track);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    cozyAudio.setVolume(vol);
  };

  const playSfx = (type: 'pop' | 'sparkle' | 'tap' | 'celebrate') => {
    if (type === 'pop') cozyAudio.playBubblePop();
    else if (type === 'sparkle') cozyAudio.playSparkle();
    else if (type === 'tap') cozyAudio.playSoftTap();
    else if (type === 'celebrate') cozyAudio.playCelebration();
  };

  return (
    <SoundContext.Provider
      value={{
        isPlaying,
        activeTrack,
        volume,
        toggleSound,
        setTrack,
        setVolume,
        playSfx,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
};
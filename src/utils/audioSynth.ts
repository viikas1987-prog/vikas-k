// Web Audio API procedural sound engine for Cozy Cuddle
// Zero external asset dependencies — purely synthesized soothing audio

class CozyAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeNoiseNode: AudioNode | null = null;
  private melodyTimer: any = null;
  private isMelodyPlaying: boolean = false;
  private currentTrack: string = 'lullaby';
  private masterVolume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.masterVolume * 0.4, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.masterVolume * 0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.masterVolume * 0.4, this.ctx.currentTime, 0.05);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.masterVolume * 0.6, this.ctx.currentTime, 0.05);
    }
  }

  // Play Celesta / Music Box Note
  public playNote(freq: number, duration: number = 1.2, detune: number = 0) {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(detune, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);
    osc2.detune.setValueAtTime(detune + 4, now);

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.25, now);
    osc2.connect(osc2Gain);
    osc2Gain.connect(noteGain);

    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.3, now + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.sfxGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }

  // Cute Bubble Pop Sound Effect
  public playBubblePop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(900 + Math.random() * 300, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Gentle Magic Sparkle / Star Catch
  public playSparkle() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 0.8, (Math.random() - 0.5) * 10);
      }, idx * 70);
    });
  }

  // Soft Button / Cotton Tap
  public playSoftTap() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Cart / Gift Box Celebrate Sound
  public playCelebration() {
    const melody = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.50, d: 0.4 },
    ];
    melody.forEach((item, idx) => {
      setTimeout(() => {
        this.playNote(item.f, item.d * 2);
      }, idx * 120);
    });
  }

  // Start Ambient Soundscapes
  public startAmbient(track: string = 'lullaby') {
    this.initContext();
    this.stopAmbient();
    this.currentTrack = track;

    if (track === 'lullaby') {
      this.startLullabyMelody();
    } else if (track === 'rain') {
      this.startRainSound();
    } else if (track === 'heartbeat') {
      this.startHeartbeatSound();
    } else if (track === 'whitenoise') {
      this.startWhiteNoiseSound();
    }
  }

  public stopAmbient() {
    if (this.melodyTimer) {
      clearInterval(this.melodyTimer);
      this.melodyTimer = null;
    }
    this.isMelodyPlaying = false;

    if (this.activeNoiseNode) {
      try {
        (this.activeNoiseNode as any).stop?.();
        this.activeNoiseNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.activeNoiseNode = null;
    }
  }

  // Procedural Twinkle Lullaby
  private startLullabyMelody() {
    this.isMelodyPlaying = true;
    const notes = [
      // Twinkle Twinkle & Brahms motif notes (in Hz)
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63,
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63
    ];
    let noteIdx = 0;

    const playNext = () => {
      if (!this.isMelodyPlaying) return;
      const freq = notes[noteIdx % notes.length];
      this.playNote(freq * 1.5, 1.8, 0);
      noteIdx++;
    };

    playNext();
    this.melodyTimer = setInterval(playNext, 1300);
  }

  // Rain sound using filtered pink noise
  private startRainSound() {
    if (!this.ctx || !this.ambientGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      data[i] = (b0 + b1 + b2 + b3) * 0.08;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.ambientGain);
    noise.start();
    this.activeNoiseNode = noise;
  }

  // White noise
  private startWhiteNoiseSound() {
    if (!this.ctx || !this.ambientGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.ambientGain);
    noise.start();
    this.activeNoiseNode = noise;
  }

  // Heartbeat sound
  private startHeartbeatSound() {
    this.isMelodyPlaying = true;
    const playThud = (high: boolean) => {
      if (!this.ctx || !this.ambientGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(high ? 68 : 52, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.15);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start(now);
      osc.stop(now + 0.18);
    };

    const beatCycle = () => {
      if (!this.isMelodyPlaying) return;
      playThud(true);
      setTimeout(() => {
        if (this.isMelodyPlaying) playThud(false);
      }, 240);
    };

    beatCycle();
    this.melodyTimer = setInterval(beatCycle, 950);
  }
}

export const cozyAudio = new CozyAudioEngine();
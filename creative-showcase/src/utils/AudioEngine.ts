/**
 * Web Audio API Generative Sound Engine
 * Synthesizes dynamic ambient atmospheres and micro-interaction tactile audio.
 * Zero external audio files required.
 */

class CreativeAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
      this.playTactileChime();
    }
    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  public startAmbient() {
    if (!this.ctx || this.isMuted) return;

    try {
      this.stopAmbient();

      const now = this.ctx.currentTime;

      // Master ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.025, now + 2); // Soft subtle volume

      // Warm low-pass filter
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(320, now);

      // Dual detuned oscillators for lush spatial warmth (F# drone)
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(92.5, now); // F#2

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(138.59, now); // C#3

      this.ambientOsc1.connect(this.filterNode);
      this.ambientOsc2.connect(this.filterNode);
      this.filterNode.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopAmbient() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        try {
          this.ambientOsc1?.stop();
          this.ambientOsc2?.stop();
          this.ambientOsc1?.disconnect();
          this.ambientOsc2?.disconnect();
          this.ambientOsc1 = null;
          this.ambientOsc2 = null;
        } catch {
          // ignore cleanup errors
        }
      }, 850);
    } catch {
      // ignore
    }
  }

  /**
   * Tactile click feedback for buttons
   */
  public playClick(frequency: number = 880) {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, now + 0.04);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  /**
   * Delicate harmonic chime when entering interactive sections
   */
  public playTactileChime() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [554.37, 830.61, 1108.73]; // C#5, G#5, C#6 arpeggio

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.02, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.4);
      });
    } catch {
      // ignore
    }
  }
}

export const audioEngine = new CreativeAudioEngine();

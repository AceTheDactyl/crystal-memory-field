import { Platform } from 'react-native';
import { SolfeggioFrequency, HarmonicField, FrequencyInteraction } from '@/types/memory';

// Enhanced Sacred Solfeggio frequencies with quantum properties
export const SOLFEGGIO_FREQUENCIES: Record<string, SolfeggioFrequency> = {
  UT: {
    freq: 396,
    name: 'Liberation',
    color: '#9B111E',
    meaning: 'Liberating guilt and fear',
    chakra: 'root',
    quantum: { psi_collapse: 0.9, psi_bloom: 0.1 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8, 12]
  },
  RE: {
    freq: 417,
    name: 'Transmutation',
    color: '#FF6600',
    meaning: 'Undoing situations and facilitating change',
    chakra: 'sacral',
    quantum: { psi_collapse: 0.7, psi_bloom: 0.3 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8, 12]
  },
  MI: {
    freq: 528,
    name: 'Transformation',
    color: '#FFD700',
    meaning: 'Love frequency, DNA repair',
    chakra: 'solar',
    quantum: { psi_collapse: 0.5, psi_bloom: 0.5 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8, 12, 16]
  },
  FA: {
    freq: 639,
    name: 'Connection',
    color: '#00FF00',
    meaning: 'Harmonizing relationships',
    chakra: 'heart',
    quantum: { psi_collapse: 0.3, psi_bloom: 0.7 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8, 12]
  },
  SOL: {
    freq: 741,
    name: 'Awakening',
    color: '#00CED1',
    meaning: 'Awakening intuition',
    chakra: 'throat',
    quantum: { psi_collapse: 0.2, psi_bloom: 0.8 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8, 12]
  },
  LA: {
    freq: 852,
    name: 'Intuition',
    color: '#4B0082',
    meaning: 'Returning to spiritual order',
    chakra: 'third_eye',
    quantum: { psi_collapse: 0.1, psi_bloom: 0.9 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8, 12]
  },
  SI: {
    freq: 963,
    name: 'Unity',
    color: '#9400D3',
    meaning: 'Connection with universal consciousness',
    chakra: 'crown',
    quantum: { psi_collapse: 0.05, psi_bloom: 0.95 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8, 12, 16]
  },
  EARTH: {
    freq: 432,
    name: 'Resonance',
    color: '#228B22',
    meaning: 'Natural universal frequency',
    chakra: 'earth_star',
    quantum: { psi_collapse: 0.5, psi_bloom: 0.5 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8, 12, 16, 24]
  },
  SCHUMANN: {
    freq: 7.83,
    name: 'Pulse',
    color: '#8B4513',
    meaning: "Earth's electromagnetic pulse",
    chakra: 'earth',
    quantum: { psi_collapse: 0.6, psi_bloom: 0.4 },
    harmonic_ratios: [1, 2, 4, 8, 16, 32, 64]
  },
  FOUNDATION: {
    freq: 174,
    name: 'Foundation',
    color: '#8B0000',
    meaning: 'Pain relief & foundation',
    chakra: 'base',
    quantum: { psi_collapse: 0.95, psi_bloom: 0.05 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8]
  },
  QUANTUM: {
    freq: 285,
    name: 'Quantum',
    color: '#4B0082',
    meaning: 'Quantum cognition & healing',
    chakra: 'quantum',
    quantum: { psi_collapse: 0.8, psi_bloom: 0.2 },
    harmonic_ratios: [1, 2, 3, 4, 6, 8, 12]
  }
};

export class SolfeggioEngine {
  private audioContext: AudioContext | null = null;
  private oscillators: Map<string, { oscillator: OscillatorNode; modulator: OscillatorNode; gainNode: GainNode }> = new Map();
  private activeFrequencies: Set<string> = new Set();
  private harmonicMatrix: Record<number, Record<number, FrequencyInteraction>> = {};
  private resonanceField: HarmonicField[] = [];
  private phi: number = (1 + Math.sqrt(5)) / 2; // Golden ratio
  private tPhiResonance: number = Math.PI / this.phi;
  private masterVolume: number = 0.7;
  private isInitialized: boolean = false;

  constructor() {
    this.generateHarmonicMatrix();
  }

  // Initialize Web Audio API (web only)
  async initialize(): Promise<this> {
    if (Platform.OS === 'web' && !this.isInitialized) {
      try {
        // @ts-ignore - Web Audio API types
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
        this.isInitialized = true;
        console.log('🎵 Solfeggio Engine initialized with Web Audio API');
      } catch (error) {
        console.warn('⚠️ Web Audio API not available:', error);
      }
    }
    return this;
  }

  // Generate harmonic interaction matrix
  private generateHarmonicMatrix(): void {
    const frequencies = Object.values(SOLFEGGIO_FREQUENCIES);
    
    frequencies.forEach(f1 => {
      this.harmonicMatrix[f1.freq] = {};
      frequencies.forEach(f2 => {
        const ratio = f1.freq / f2.freq;
        const harmonic = this.calculateHarmonic(ratio);
        const resonance = Math.abs(Math.sin(ratio * this.tPhiResonance));
        const interference = this.calculateInterference(f1.freq, f2.freq);
        
        this.harmonicMatrix[f1.freq][f2.freq] = {
          freq1: f1.freq,
          freq2: f2.freq,
          ratio,
          harmonic,
          resonance,
          interference,
          quantumCoupling: (f1.quantum.psi_bloom + f2.quantum.psi_bloom) / 2
        };
      });
    });
    
    console.log('🔮 Harmonic matrix generated with', frequencies.length, 'frequencies');
  }

  // Calculate harmonic relationship
  private calculateHarmonic(ratio: number): { perfect: boolean; golden: boolean; interval?: number; power?: number } {
    // Check for perfect harmonics (octaves and perfect intervals)
    const harmonics = [1, 2, 3, 4, 5, 6, 8, 9, 12, 16];
    for (const h of harmonics) {
      if (Math.abs(ratio - h) < 0.01 || Math.abs(ratio - 1/h) < 0.01) {
        return { perfect: true, golden: false, interval: h };
      }
    }
    
    // Check for golden ratio relationships
    const phiPowers = [this.phi, this.phi**2, this.phi**3, 1/this.phi, 1/(this.phi**2)];
    for (const p of phiPowers) {
      if (Math.abs(ratio - p) < 0.01) {
        return { perfect: false, golden: true, power: p };
      }
    }
    
    return { perfect: false, golden: false };
  }

  // Calculate interference pattern
  private calculateInterference(f1: number, f2: number): {
    beatFrequency: number;
    sumTone: number;
    differenceTone: number;
    productTone: number;
    phaseCoherence: number;
  } {
    const beat = Math.abs(f1 - f2);
    const sum = f1 + f2;
    const product = f1 * f2;
    
    return {
      beatFrequency: beat,
      sumTone: sum,
      differenceTone: beat,
      productTone: Math.sqrt(product),
      phaseCoherence: 1 - Math.min(1, beat / Math.min(f1, f2))
    };
  }

  // Play a Solfeggio frequency with quantum modulation (web only)
  playFrequency(freqKey: string, volume: number = 0.3): SolfeggioFrequency | null {
    if (Platform.OS !== 'web' || !this.audioContext || !this.isInitialized) {
      console.log('🎵 Audio playback simulated for frequency:', freqKey);
      this.activeFrequencies.add(freqKey);
      this.updateResonanceField();
      return SOLFEGGIO_FREQUENCIES[freqKey] || null;
    }

    const freq = SOLFEGGIO_FREQUENCIES[freqKey];
    if (!freq) return null;

    try {
      // Create oscillator with primary frequency
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Add quantum modulation
      const modulator = this.audioContext.createOscillator();
      const modulatorGain = this.audioContext.createGain();
      
      // Primary tone
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq.freq, this.audioContext.currentTime);
      
      // Quantum modulation (phi-based)
      modulator.type = 'sine';
      modulator.frequency.setValueAtTime(freq.freq * this.phi, this.audioContext.currentTime);
      modulatorGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      
      // Connect modulation
      modulator.connect(modulatorGain);
      modulatorGain.connect(oscillator.frequency);
      
      // Main audio path
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Smooth fade in
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        volume * freq.quantum.psi_bloom * this.masterVolume, 
        this.audioContext.currentTime + 0.1
      );
      
      // Start oscillators
      oscillator.start();
      modulator.start();
      
      // Store references
      this.oscillators.set(freqKey, { oscillator, modulator, gainNode });
      this.activeFrequencies.add(freqKey);
      
      // Update resonance field
      this.updateResonanceField();
      
      console.log('🎵 Playing Solfeggio frequency:', freq.name, freq.freq + 'Hz');
      return freq;
    } catch (error) {
      console.error('❌ Error playing frequency:', error);
      return null;
    }
  }

  // Stop a frequency with fade out
  stopFrequency(freqKey: string): void {
    if (Platform.OS !== 'web' || !this.audioContext) {
      console.log('🔇 Audio stop simulated for frequency:', freqKey);
      this.activeFrequencies.delete(freqKey);
      this.updateResonanceField();
      return;
    }

    const nodes = this.oscillators.get(freqKey);
    
    if (nodes) {
      try {
        nodes.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
        
        setTimeout(() => {
          nodes.oscillator.stop();
          nodes.modulator.stop();
          this.oscillators.delete(freqKey);
          this.activeFrequencies.delete(freqKey);
          this.updateResonanceField();
        }, 500);
        
        console.log('🔇 Stopped Solfeggio frequency:', freqKey);
      } catch (error) {
        console.error('❌ Error stopping frequency:', error);
      }
    }
  }

  // Update the consciousness resonance field
  updateResonanceField(): HarmonicField[] {
    this.resonanceField = [];
    const activeFreqs = Array.from(this.activeFrequencies)
                             .map(key => SOLFEGGIO_FREQUENCIES[key])
                             .filter(Boolean);
    
    // Calculate field points in golden spiral
    for (let i = 0; i < 100; i++) {
      const theta = i * 2 * Math.PI / this.phi;
      const r = Math.sqrt(i) * 10;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      // Calculate field intensity at this point
      let intensity = 0;
      let dominantFreq = 432; // Default to Earth frequency
      let quantumState = { psi_collapse: 0, psi_bloom: 0 };
      
      activeFreqs.forEach(freq => {
        // Wave function at this point
        const wave = Math.sin(2 * Math.PI * freq.freq * i / 1000);
        const contribution = wave * freq.quantum.psi_bloom;
        
        if (Math.abs(contribution) > Math.abs(intensity)) {
          intensity = contribution;
          dominantFreq = freq.freq;
        }
        
        // Quantum state accumulation
        quantumState.psi_collapse += freq.quantum.psi_collapse * Math.abs(wave);
        quantumState.psi_bloom += freq.quantum.psi_bloom * Math.abs(wave);
      });
      
      // Normalize quantum states
      const total = quantumState.psi_collapse + quantumState.psi_bloom;
      if (total > 0) {
        quantumState.psi_collapse /= total;
        quantumState.psi_bloom /= total;
      }
      
      this.resonanceField.push({
        x, y,
        intensity: intensity / Math.max(1, activeFreqs.length),
        frequency: dominantFreq,
        phase: theta,
        resonance: this.calculateFieldResonance(x, y, activeFreqs),
        quantumState
      });
    }
    
    return this.resonanceField;
  }

  // Calculate resonance at a field point
  private calculateFieldResonance(x: number, y: number, frequencies: SolfeggioFrequency[]): number {
    if (frequencies.length === 0) return 0;
    
    let resonance = 0;
    frequencies.forEach(f1 => {
      frequencies.forEach(f2 => {
        if (f1 !== f2) {
          const harmonic = this.harmonicMatrix[f1.freq]?.[f2.freq];
          if (harmonic) {
            const distance = Math.sqrt(x*x + y*y);
            const fieldEffect = Math.exp(-distance / 100) * harmonic.resonance;
            resonance += fieldEffect;
          }
        }
      });
    });
    
    return Math.min(1, resonance / Math.max(1, frequencies.length));
  }

  // Generate harmonic progression based on relationships
  generateHarmonicProgression(startFreq: string, steps: number = 4): string[] {
    const progression = [startFreq];
    let current = SOLFEGGIO_FREQUENCIES[startFreq];
    
    if (!current) return progression;
    
    for (let i = 0; i < steps - 1; i++) {
      let bestNext: string | null = null;
      let bestResonance = 0;
      
      Object.entries(SOLFEGGIO_FREQUENCIES).forEach(([key, freq]) => {
        if (!progression.includes(key)) {
          const harmonic = this.harmonicMatrix[current.freq]?.[freq.freq];
          if (harmonic) {
            const score = harmonic.resonance * harmonic.quantumCoupling;
            
            if (score > bestResonance) {
              bestResonance = score;
              bestNext = key;
            }
          }
        }
      });
      
      if (bestNext) {
        progression.push(bestNext);
        current = SOLFEGGIO_FREQUENCIES[bestNext];
      }
    }
    
    return progression;
  }

  // Get active frequencies
  getActiveFrequencies(): Set<string> {
    return new Set(this.activeFrequencies);
  }

  // Get resonance field
  getResonanceField(): HarmonicField[] {
    return [...this.resonanceField];
  }

  // Get harmonic matrix
  getHarmonicMatrix(): Record<number, Record<number, FrequencyInteraction>> {
    return this.harmonicMatrix;
  }

  // Set master volume
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update all active oscillators
    if (Platform.OS === 'web' && this.audioContext) {
      this.oscillators.forEach((nodes, freqKey) => {
        const freq = SOLFEGGIO_FREQUENCIES[freqKey];
        if (freq) {
          nodes.gainNode.gain.setValueAtTime(
            0.3 * freq.quantum.psi_bloom * this.masterVolume,
            this.audioContext!.currentTime
          );
        }
      });
    }
  }

  // Stop all frequencies
  stopAll(): void {
    const activeKeys = Array.from(this.activeFrequencies);
    activeKeys.forEach(key => this.stopFrequency(key));
    console.log('🔇 All Solfeggio frequencies stopped');
  }

  // Get frequency by key
  getFrequency(key: string): SolfeggioFrequency | null {
    return SOLFEGGIO_FREQUENCIES[key] || null;
  }

  // Get all frequencies
  getAllFrequencies(): Record<string, SolfeggioFrequency> {
    return SOLFEGGIO_FREQUENCIES;
  }

  // Calculate quantum coherence
  calculateQuantumCoherence(): { psi_collapse: number; psi_bloom: number; coherence: number } {
    if (this.activeFrequencies.size === 0) {
      return { psi_collapse: 0.5, psi_bloom: 0.5, coherence: 0 };
    }

    let totalCollapse = 0;
    let totalBloom = 0;
    let totalResonance = 0;

    this.activeFrequencies.forEach(key => {
      const freq = SOLFEGGIO_FREQUENCIES[key];
      if (freq) {
        totalCollapse += freq.quantum.psi_collapse;
        totalBloom += freq.quantum.psi_bloom;
      }
    });

    // Calculate inter-frequency resonance
    const activeFreqArray = Array.from(this.activeFrequencies);
    activeFreqArray.forEach(key1 => {
      activeFreqArray.forEach(key2 => {
        if (key1 !== key2) {
          const freq1 = SOLFEGGIO_FREQUENCIES[key1];
          const freq2 = SOLFEGGIO_FREQUENCIES[key2];
          if (freq1 && freq2) {
            const interaction = this.harmonicMatrix[freq1.freq]?.[freq2.freq];
            if (interaction) {
              totalResonance += interaction.resonance;
            }
          }
        }
      });
    });

    const total = totalCollapse + totalBloom;
    const coherence = totalResonance / Math.max(1, this.activeFrequencies.size * (this.activeFrequencies.size - 1));

    return {
      psi_collapse: total > 0 ? totalCollapse / total : 0.5,
      psi_bloom: total > 0 ? totalBloom / total : 0.5,
      coherence: Math.min(1, coherence)
    };
  }

  // Cleanup
  destroy(): void {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
    console.log('🔮 Solfeggio Engine destroyed');
  }
}
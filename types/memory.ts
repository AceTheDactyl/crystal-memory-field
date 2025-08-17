export interface Memory {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  crystallized: boolean;
  intensity: number;
  frequency: number;
  phase: number;
  connections: number[];
  color: string;
  size: number;
  content: string;
  archetype: string;
  harmonic: number;
  coherenceLevel: number;
  crystallizationTime: number | null;
}

export interface Pulse {
  id: number;
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

export interface ThoughtEcho {
  id: number;
  text: string;
  age: number;
  sacred: boolean;
}

export interface SolfeggioFrequency {
  freq: number;
  name: string;
  color: string;
  meaning: string;
  chakra: string;
  quantum: {
    psi_collapse: number;
    psi_bloom: number;
  };
  harmonic_ratios: number[];
}

export interface HarmonicField {
  x: number;
  y: number;
  intensity: number;
  frequency: number;
  phase: number;
  resonance: number;
  quantumState: {
    psi_collapse: number;
    psi_bloom: number;
  };
}

export interface FrequencyInteraction {
  freq1: number;
  freq2: number;
  ratio: number;
  harmonic: {
    perfect: boolean;
    golden: boolean;
    interval?: number;
    power?: number;
  };
  resonance: number;
  interference: {
    beatFrequency: number;
    sumTone: number;
    differenceTone: number;
    productTone: number;
    phaseCoherence: number;
  };
  quantumCoupling: number;
}
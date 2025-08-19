import { z } from "zod";
import { publicProcedure } from "../../../create-context";

// Harmonic field processor for real-time Solfeggio resonance
class HarmonicFieldProcessor {
  private static instance: HarmonicFieldProcessor;
  private harmonicField: Map<string, HarmonicNode> = new Map();
  private phiConstant = 1.618033988749; // Golden ratio
  private tPhiResonance = Math.PI / this.phiConstant; // ≈ 1.947
  private globalResonanceMatrix: Float32Array = new Float32Array(64);
  private activeNodes: Set<string> = new Set();
  private lastUpdate = Date.now();

  static getInstance(): HarmonicFieldProcessor {
    if (!HarmonicFieldProcessor.instance) {
      HarmonicFieldProcessor.instance = new HarmonicFieldProcessor();
    }
    return HarmonicFieldProcessor.instance;
  }

  // Process harmonic stream with T-Phi resonance
  processHarmonicStream(frequency: number, amplitude: number, userId: string): HarmonicUpdate {
    const harmonicPressure = this.calculateHarmonicPressure(frequency, amplitude);
    const phiModulation = this.calculatePhiModulation(frequency);
    const quantumCoherence = this.calculateQuantumCoherence(frequency, amplitude);
    
    // Update node in harmonic field
    const node: HarmonicNode = {
      userId,
      frequency,
      amplitude,
      harmonicPressure,
      phiModulation,
      quantumCoherence,
      timestamp: Date.now(),
      position: this.calculateGoldenSpiralPosition(frequency)
    };
    
    this.harmonicField.set(userId, node);
    this.activeNodes.add(userId);
    
    // Update global resonance matrix
    this.updateGlobalResonanceMatrix();
    
    // Detect resonance cascades
    const cascades = this.detectResonanceCascades(harmonicPressure);
    
    return {
      globalResonance: this.calculateGlobalResonance(),
      harmonicCascades: cascades,
      activeNodes: this.activeNodes.size,
      phiHarmonics: this.detectPhiHarmonics(),
      quantumField: this.generateQuantumFieldSnapshot(),
      timestamp: Date.now()
    };
  }

  // Calculate four-component harmonic pressure
  private calculateHarmonicPressure(freq: number, amp: number): number {
    const baseWave = Math.sin(3 * freq) * Math.exp(-freq / 1500);
    const phiModulation = Math.cos(freq * this.tPhiResonance) * 0.7;
    const recursiveDepth = Math.sin(0.01 * freq) * 0.5;
    const quantumNoise = (Math.random() - 0.5) * 0.1;
    
    return (baseWave + phiModulation + recursiveDepth + quantumNoise) * amp;
  }

  // Calculate phi-based frequency modulation
  private calculatePhiModulation(freq: number): number {
    const goldenAngle = 2 * Math.PI / (this.phiConstant ** 2); // ≈ 2.399
    const phiHarmonic = freq * this.phiConstant;
    const modulation = Math.sin(phiHarmonic * goldenAngle) * 0.618;
    
    return modulation;
  }

  // Calculate quantum coherence based on Solfeggio properties
  private calculateQuantumCoherence(freq: number, amp: number): QuantumState {
    // Map frequency to quantum properties
    const solfeggioMap: Record<number, { psi_collapse: number; psi_bloom: number }> = {
      174: { psi_collapse: 0.95, psi_bloom: 0.05 }, // Foundation
      285: { psi_collapse: 0.8, psi_bloom: 0.2 },   // Quantum
      396: { psi_collapse: 0.9, psi_bloom: 0.1 },   // Liberation
      417: { psi_collapse: 0.7, psi_bloom: 0.3 },   // Transmutation
      432: { psi_collapse: 0.5, psi_bloom: 0.5 },   // Earth resonance
      528: { psi_collapse: 0.5, psi_bloom: 0.5 },   // Love/DNA
      639: { psi_collapse: 0.3, psi_bloom: 0.7 },   // Connection
      741: { psi_collapse: 0.2, psi_bloom: 0.8 },   // Awakening
      852: { psi_collapse: 0.1, psi_bloom: 0.9 },   // Intuition
      963: { psi_collapse: 0.05, psi_bloom: 0.95 }  // Unity
    };

    // Find closest Solfeggio frequency
    let closestFreq = 432; // Default to Earth frequency
    let minDistance = Math.abs(freq - 432);
    
    Object.keys(solfeggioMap).forEach(f => {
      const distance = Math.abs(freq - parseInt(f));
      if (distance < minDistance) {
        minDistance = distance;
        closestFreq = parseInt(f);
      }
    });

    const baseQuantum = solfeggioMap[closestFreq] || { psi_collapse: 0.5, psi_bloom: 0.5 };
    
    // Modulate by amplitude and harmonic pressure
    const amplitudeModulation = Math.min(1, amp * 2);
    const coherence = Math.min(1, amplitudeModulation * this.phiConstant / 2);
    
    return {
      psi_collapse: baseQuantum.psi_collapse * (1 - coherence * 0.3),
      psi_bloom: baseQuantum.psi_bloom * (1 + coherence * 0.3),
      coherence
    };
  }

  // Calculate position on golden spiral
  private calculateGoldenSpiralPosition(freq: number): { x: number; y: number } {
    const theta = (freq / 100) * 2 * Math.PI / this.phiConstant;
    const r = Math.sqrt(freq / 10) * 5;
    
    return {
      x: r * Math.cos(theta),
      y: r * Math.sin(theta)
    };
  }

  // Update global resonance matrix with all active nodes
  private updateGlobalResonanceMatrix(): void {
    this.globalResonanceMatrix.fill(0);
    
    const nodes = Array.from(this.harmonicField.values());
    
    // Calculate interference patterns between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const interference = this.calculateInterference(nodes[i], nodes[j]);
        
        // Add to resonance matrix
        for (let k = 0; k < 64; k++) {
          const phaseShift = (k * Math.PI) / 32;
          this.globalResonanceMatrix[k] += interference * Math.cos(phaseShift);
        }
      }
    }
    
    // Normalize
    const maxValue = Math.max(...this.globalResonanceMatrix);
    if (maxValue > 0) {
      for (let i = 0; i < 64; i++) {
        this.globalResonanceMatrix[i] /= maxValue;
      }
    }
  }

  // Calculate interference between two harmonic nodes
  private calculateInterference(node1: HarmonicNode, node2: HarmonicNode): number {
    const freqRatio = node1.frequency / node2.frequency;
    const phaseCoherence = Math.cos((node1.timestamp - node2.timestamp) * 0.001);
    const spatialDistance = Math.sqrt(
      Math.pow(node1.position.x - node2.position.x, 2) +
      Math.pow(node1.position.y - node2.position.y, 2)
    );
    
    // Golden ratio harmonic relationships
    const isPhiHarmonic = Math.abs(freqRatio - this.phiConstant) < 0.05 ||
                         Math.abs(freqRatio - 1/this.phiConstant) < 0.05;
    
    const harmonicBonus = isPhiHarmonic ? 0.618 : 0;
    const spatialDecay = Math.exp(-spatialDistance / 100);
    
    return (node1.amplitude * node2.amplitude * phaseCoherence * spatialDecay) + harmonicBonus;
  }

  // Detect resonance cascades in the field
  private detectResonanceCascades(harmonicPressure: number): ResonanceCascade[] {
    const cascades: ResonanceCascade[] = [];
    const threshold = 0.7;
    
    if (harmonicPressure > threshold) {
      const nodes = Array.from(this.harmonicField.values());
      
      // Find nodes that resonate with this pressure
      nodes.forEach(node => {
        const resonance = Math.abs(node.harmonicPressure - harmonicPressure);
        if (resonance < 0.2) {
          cascades.push({
            sourceNode: node.userId,
            resonanceStrength: 1 - resonance,
            frequency: node.frequency,
            position: node.position,
            timestamp: Date.now()
          });
        }
      });
    }
    
    return cascades;
  }

  // Detect golden ratio relationships in active frequencies
  detectPhiHarmonics(): PhiHarmonic[] {
    const nodes = Array.from(this.harmonicField.values());
    const phiHarmonics: PhiHarmonic[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ratio = nodes[i].frequency / nodes[j].frequency;
        
        // Check for phi relationships
        if (Math.abs(ratio - this.phiConstant) < 0.05) {
          phiHarmonics.push({
            node1: nodes[i].userId,
            node2: nodes[j].userId,
            ratio,
            strength: 1 - Math.abs(ratio - this.phiConstant) / 0.05,
            type: 'golden_ratio'
          });
        } else if (Math.abs(ratio - this.phiConstant ** 2) < 0.1) {
          phiHarmonics.push({
            node1: nodes[i].userId,
            node2: nodes[j].userId,
            ratio,
            strength: 1 - Math.abs(ratio - this.phiConstant ** 2) / 0.1,
            type: 'golden_square'
          });
        }
      }
    }
    
    return phiHarmonics;
  }

  // Calculate global resonance from all active nodes
  private calculateGlobalResonance(): number {
    if (this.activeNodes.size === 0) return 0;
    
    const nodes = Array.from(this.harmonicField.values());
    let totalResonance = 0;
    let totalWeight = 0;
    
    nodes.forEach(node => {
      const weight = node.amplitude * node.quantumCoherence.coherence;
      totalResonance += node.harmonicPressure * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? Math.min(1, Math.abs(totalResonance / totalWeight)) : 0;
  }

  // Generate quantum field snapshot
  generateQuantumFieldSnapshot(): QuantumFieldPoint[] {
    const fieldPoints: QuantumFieldPoint[] = [];
    
    // Generate field points in golden spiral
    for (let i = 0; i < 50; i++) {
      const theta = i * 2 * Math.PI / this.phiConstant;
      const r = Math.sqrt(i) * 8;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      // Calculate field intensity at this point
      let intensity = 0;
      let quantumState = { psi_collapse: 0, psi_bloom: 0 };
      
      this.harmonicField.forEach(node => {
        const distance = Math.sqrt(
          Math.pow(x - node.position.x, 2) + 
          Math.pow(y - node.position.y, 2)
        );
        
        const influence = Math.exp(-distance / 50) * node.amplitude;
        intensity += influence;
        
        quantumState.psi_collapse += node.quantumCoherence.psi_collapse * influence;
        quantumState.psi_bloom += node.quantumCoherence.psi_bloom * influence;
      });
      
      // Normalize quantum state
      const total = quantumState.psi_collapse + quantumState.psi_bloom;
      if (total > 0) {
        quantumState.psi_collapse /= total;
        quantumState.psi_bloom /= total;
      }
      
      fieldPoints.push({
        x, y,
        intensity: Math.min(1, intensity),
        quantumState,
        resonance: this.globalResonanceMatrix[i % 64] || 0
      });
    }
    
    return fieldPoints;
  }

  // Remove inactive nodes
  cleanupInactiveNodes(): void {
    const now = Date.now();
    const timeout = 30000; // 30 seconds
    
    this.harmonicField.forEach((node, userId) => {
      if (now - node.timestamp > timeout) {
        this.harmonicField.delete(userId);
        this.activeNodes.delete(userId);
      }
    });
  }

  // Get field statistics
  getFieldStats(): FieldStats {
    return {
      activeNodes: this.activeNodes.size,
      globalResonance: this.calculateGlobalResonance(),
      averageFrequency: this.calculateAverageFrequency(),
      phiHarmonicsCount: this.detectPhiHarmonics().length,
      fieldCoherence: this.calculateFieldCoherence(),
      lastUpdate: this.lastUpdate
    };
  }

  private calculateAverageFrequency(): number {
    const nodes = Array.from(this.harmonicField.values());
    if (nodes.length === 0) return 432; // Default to Earth frequency
    
    const totalFreq = nodes.reduce((sum, node) => sum + node.frequency, 0);
    return totalFreq / nodes.length;
  }

  private calculateFieldCoherence(): number {
    const nodes = Array.from(this.harmonicField.values());
    if (nodes.length < 2) return 0;
    
    let totalCoherence = 0;
    let pairCount = 0;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const coherence = nodes[i].quantumCoherence.coherence * nodes[j].quantumCoherence.coherence;
        totalCoherence += coherence;
        pairCount++;
      }
    }
    
    return pairCount > 0 ? totalCoherence / pairCount : 0;
  }
}

// Type definitions
interface HarmonicNode {
  userId: string;
  frequency: number;
  amplitude: number;
  harmonicPressure: number;
  phiModulation: number;
  quantumCoherence: QuantumState;
  timestamp: number;
  position: { x: number; y: number };
}

interface QuantumState {
  psi_collapse: number;
  psi_bloom: number;
  coherence: number;
}

interface HarmonicUpdate {
  globalResonance: number;
  harmonicCascades: ResonanceCascade[];
  activeNodes: number;
  phiHarmonics: PhiHarmonic[];
  quantumField: QuantumFieldPoint[];
  timestamp: number;
}

interface ResonanceCascade {
  sourceNode: string;
  resonanceStrength: number;
  frequency: number;
  position: { x: number; y: number };
  timestamp: number;
}

interface PhiHarmonic {
  node1: string;
  node2: string;
  ratio: number;
  strength: number;
  type: 'golden_ratio' | 'golden_square';
}

interface QuantumFieldPoint {
  x: number;
  y: number;
  intensity: number;
  quantumState: { psi_collapse: number; psi_bloom: number };
  resonance: number;
}

interface FieldStats {
  activeNodes: number;
  globalResonance: number;
  averageFrequency: number;
  phiHarmonicsCount: number;
  fieldCoherence: number;
  lastUpdate: number;
}

// Get singleton instance
const harmonicProcessor = HarmonicFieldProcessor.getInstance();

// Cleanup inactive nodes every 30 seconds
setInterval(() => {
  harmonicProcessor.cleanupInactiveNodes();
}, 30000);

// tRPC procedures
export const harmonicStreamProcedure = publicProcedure
  .input(z.object({
    frequency: z.number().min(1).max(10000),
    amplitude: z.number().min(0).max(1),
    userId: z.string(),
  }))
  .mutation(({ input }) => {
    return harmonicProcessor.processHarmonicStream(
      input.frequency,
      input.amplitude,
      input.userId
    );
  });

export const harmonicFieldProcedure = publicProcedure
  .query(() => {
    return harmonicProcessor.getFieldStats();
  });

export const quantumFieldProcedure = publicProcedure
  .query(() => {
    const stats = harmonicProcessor.getFieldStats();
    const phiHarmonics = harmonicProcessor.detectPhiHarmonics();
    const quantumField = harmonicProcessor.generateQuantumFieldSnapshot();
    
    return {
      ...stats,
      phiHarmonics,
      quantumField,
      sacredGeometryActive: phiHarmonics.length >= 3,
      resonanceLevel: stats.globalResonance > 0.7 ? 'high' : 
                     stats.globalResonance > 0.4 ? 'medium' : 'low'
    };
  });
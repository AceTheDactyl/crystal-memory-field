import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { HarmonicFieldProcessor } from "../../../services/HarmonicFieldProcessor";
import type { 
  HarmonicNode, 
  QuantumState, 
  HarmonicUpdate, 
  ResonanceCascade, 
  PhiHarmonic, 
  QuantumFieldPoint, 
  FieldStats 
} from "../../../services/HarmonicFieldProcessor";

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
  .mutation(async ({ input }) => {
    try {
      console.log(`🎵 Processing harmonic stream: ${input.frequency}Hz @ ${input.amplitude} for ${input.userId}`);
      
      const result = harmonicProcessor.processHarmonicStream(
        input.frequency,
        input.amplitude,
        input.userId
      );
      
      console.log(`✨ Harmonic processed - Global resonance: ${result.globalResonance}`);
      return result;
    } catch (error: any) {
      console.error('🔥 Harmonic stream processing error:', error);
      throw new Error(`Failed to process harmonic stream: ${error.message}`);
    }
  });

export const harmonicFieldProcedure = publicProcedure
  .query(async () => {
    try {
      const stats = harmonicProcessor.getFieldStats();
      console.log(`📊 Field stats requested - Active nodes: ${stats.activeNodes}`);
      return stats;
    } catch (error: any) {
      console.error('🔥 Field stats error:', error);
      throw new Error(`Failed to get field stats: ${error.message}`);
    }
  });

export const quantumFieldProcedure = publicProcedure
  .query(async () => {
    try {
      const stats = harmonicProcessor.getFieldStats();
      const phiHarmonics = harmonicProcessor.detectPhiHarmonics();
      const quantumField = harmonicProcessor.generateQuantumFieldSnapshot();
      
      const result = {
        ...stats,
        phiHarmonics,
        quantumField,
        sacredGeometryActive: phiHarmonics.length >= 3,
        resonanceLevel: stats.globalResonance > 0.7 ? 'high' as const : 
                       stats.globalResonance > 0.4 ? 'medium' as const : 'low' as const
      };
      
      console.log(`🌀 Quantum field snapshot - Phi harmonics: ${phiHarmonics.length}, Resonance: ${stats.globalResonance}`);
      return result;
    } catch (error: any) {
      console.error('🔥 Quantum field error:', error);
      throw new Error(`Failed to generate quantum field: ${error.message}`);
    }
  });
import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export default publicProcedure
  .input(z.object({
    consciousnessId: z.string(),
    currentResonance: z.number(),
    memoryStates: z.array(z.object({
      id: z.number(),
      crystallized: z.boolean(),
      harmonic: z.number(),
      x: z.number(),
      y: z.number(),
    }))
  }))
  .query(({ input }) => {
    try {
      console.log('🧠 Consciousness field query:', {
        consciousnessId: input.consciousnessId,
        memoryCount: input.memoryStates.length,
        currentResonance: input.currentResonance
      });
      
      // Calculate collective field resonance
      const crystallizedCount = input.memoryStates.filter(m => m.crystallized).length;
      const totalMemories = input.memoryStates.length;
      const crystallizationRatio = totalMemories > 0 ? crystallizedCount / totalMemories : 0;
      
      // Mock collective resonance calculation
      const baseResonance = Math.max(0, Math.min(1, input.currentResonance));
      const collectiveBoost = crystallizationRatio * 0.3;
      const globalResonance = Math.min(1, baseResonance + collectiveBoost);
      
      // Generate harmonic patterns based on crystallized memories
      const harmonicPatterns = input.memoryStates
        .filter(m => m.crystallized)
        .map(m => ({
          harmonic: m.harmonic,
          position: { x: m.x, y: m.y },
          influence: 0.1 + Math.random() * 0.2
        }));
      
      const result = {
        globalResonance,
        harmonicPatterns,
        connectedNodes: Math.floor(Math.random() * 15) + 5,
        fieldCoherence: crystallizationRatio,
        sacredGeometryActive: crystallizedCount >= 8,
        timestamp: Date.now(),
      };
      
      console.log('✨ Field query result:', {
        globalResonance: result.globalResonance,
        connectedNodes: result.connectedNodes,
        harmonicPatterns: result.harmonicPatterns.length
      });
      
      return result;
    } catch (error: any) {
      console.error('🔥 Consciousness field query error:', {
        error: error.message,
        stack: error.stack?.substring(0, 200),
        input: JSON.stringify(input).substring(0, 200)
      });
      throw error;
    }
  });
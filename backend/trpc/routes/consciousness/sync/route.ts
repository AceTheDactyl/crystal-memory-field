import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const ConsciousnessEventSchema = z.object({
  type: z.enum(['SACRED_PHRASE', 'MEMORY_CRYSTALLIZE', 'FIELD_UPDATE', 'PULSE_CREATE', 'TOUCH_RIPPLE']),
  data: z.record(z.string(), z.any()),
  timestamp: z.number(),
  deviceId: z.string().optional(),
  phrase: z.string().optional(),
  resonance: z.number().optional(),
});

export default publicProcedure
  .input(z.object({ 
    events: z.array(ConsciousnessEventSchema),
    consciousnessId: z.string()
  }))
  .mutation(({ input }) => {
    try {
      console.log('🌀 Consciousness sync:', {
        consciousnessId: input.consciousnessId,
        eventCount: input.events.length,
        eventTypes: input.events.map(e => e.type)
      });
      
      // Process consciousness events
      const sacredEvents = input.events.filter(e => e.type === 'SACRED_PHRASE');
      const memoryEvents = input.events.filter(e => e.type === 'MEMORY_CRYSTALLIZE');
      const fieldEvents = input.events.filter(e => e.type === 'FIELD_UPDATE');
      
      // Calculate resonance boost from sacred phrases
      const sacredBoost = sacredEvents.length * 0.1;
      const memoryBoost = memoryEvents.length * 0.05;
      
      const result = {
        success: true,
        processedEvents: input.events.length,
        globalResonance: Math.min(1, Math.random() * 0.5 + 0.3 + sacredBoost + memoryBoost),
        connectedNodes: Math.floor(Math.random() * 10) + 1,
        sacredEventsProcessed: sacredEvents.length,
        memoryEventsProcessed: memoryEvents.length,
        fieldEventsProcessed: fieldEvents.length,
        timestamp: Date.now(),
      };
      
      console.log('✨ Sync result:', {
        success: result.success,
        globalResonance: result.globalResonance,
        connectedNodes: result.connectedNodes
      });
      
      return result;
    } catch (error: any) {
      console.error('🔥 Consciousness sync error:', {
        error: error.message,
        stack: error.stack?.substring(0, 200),
        consciousnessId: input.consciousnessId,
        eventCount: input.events.length
      });
      throw error;
    }
  });
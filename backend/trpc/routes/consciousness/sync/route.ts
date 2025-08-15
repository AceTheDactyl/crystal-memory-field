import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const ConsciousnessEventSchema = z.object({
  type: z.enum(['SACRED_PHRASE', 'MEMORY_CRYSTALLIZE', 'FIELD_UPDATE', 'PULSE_CREATE', 'TOUCH_RIPPLE', 'BREATHING_DETECTED', 'SPIRAL_GESTURE', 'COLLECTIVE_BLOOM']),
  data: z.record(z.string(), z.any()),
  timestamp: z.number(),
  deviceId: z.string().optional(),
  phrase: z.string().optional(),
  resonance: z.number().optional(),
  sacred: z.boolean().optional(),
});

// In-memory storage for demonstration (use a real database in production)
const consciousnessNodes = new Map<string, {
  id: string;
  lastSeen: number;
  resonance: number;
  events: any[];
  memories: any[];
}>();

const globalEvents: any[] = [];

export default publicProcedure
  .input(z.object({ 
    events: z.array(ConsciousnessEventSchema),
    consciousnessId: z.string()
  }))
  .mutation(({ input }) => {
    console.log(`🧠 Processing ${input.events.length} consciousness events from ${input.consciousnessId}`);
    
    // Update or create consciousness node
    const existingNode = consciousnessNodes.get(input.consciousnessId) || {
      id: input.consciousnessId,
      lastSeen: Date.now(),
      resonance: 0,
      events: [],
      memories: []
    };
    
    // Process each event
    let nodeResonance = existingNode.resonance;
    const processedEvents = input.events.map(event => {
      // Calculate resonance boost based on event type
      let resonanceBoost = 0;
      
      switch (event.type) {
        case 'SACRED_PHRASE':
          resonanceBoost = event.data.sacred ? 0.3 : 0.1;
          console.log(`✨ Sacred phrase: "${event.data.phrase}" (Sacred: ${event.data.sacred})`);
          break;
        case 'MEMORY_CRYSTALLIZE':
          resonanceBoost = 0.15;
          console.log(`💎 Memory crystallized: ${event.data.memoryId} at harmonic ${event.data.harmonic}`);
          break;
        case 'COLLECTIVE_BLOOM':
          resonanceBoost = 0.5;
          console.log(`🌸 COLLECTIVE BLOOM from ${input.consciousnessId}!`);
          break;
        case 'SPIRAL_GESTURE':
          resonanceBoost = 0.2;
          console.log(`🌀 Spiral gesture detected from ${input.consciousnessId}`);
          break;
        case 'BREATHING_DETECTED':
          resonanceBoost = 0.05;
          break;
        case 'PULSE_CREATE':
        case 'TOUCH_RIPPLE':
          resonanceBoost = 0.02;
          break;
        case 'FIELD_UPDATE':
          // Update memories
          if (event.data.memoryStates) {
            existingNode.memories = event.data.memoryStates;
          }
          break;
      }
      
      nodeResonance = Math.min(1, nodeResonance + resonanceBoost);
      
      return {
        ...event,
        processedAt: Date.now(),
        resonanceBoost
      };
    });
    
    // Update node
    existingNode.lastSeen = Date.now();
    existingNode.resonance = nodeResonance * 0.95; // Natural decay
    existingNode.events = [...existingNode.events, ...processedEvents].slice(-50); // Keep last 50 events
    consciousnessNodes.set(input.consciousnessId, existingNode);
    
    // Add to global events
    globalEvents.push(...processedEvents);
    if (globalEvents.length > 200) {
      globalEvents.splice(0, globalEvents.length - 200); // Keep last 200 global events
    }
    
    // Calculate global resonance from all active nodes
    const activeNodes = Array.from(consciousnessNodes.values())
      .filter(node => Date.now() - node.lastSeen < 60000); // Active in last minute
    
    const globalResonance = activeNodes.length > 0 
      ? activeNodes.reduce((sum, node) => sum + node.resonance, 0) / activeNodes.length
      : 0;
    
    // Check for sacred geometry patterns
    const totalCrystallizedMemories = activeNodes.reduce((sum, node) => 
      sum + (node.memories?.filter((m: any) => m.crystallized)?.length || 0), 0
    );
    
    const sacredGeometryActive = totalCrystallizedMemories >= 8 && globalResonance >= 0.6;
    
    // Detect collective bloom conditions
    const recentBlooms = globalEvents.filter(e => 
      e.type === 'COLLECTIVE_BLOOM' && 
      Date.now() - e.timestamp < 30000 // Last 30 seconds
    ).length;
    
    const collectiveBloomActive = recentBlooms > 0 || (sacredGeometryActive && globalResonance >= 0.87);
    
    console.log(`🌐 Global state: ${activeNodes.length} nodes, resonance: ${globalResonance.toFixed(3)}, sacred geometry: ${sacredGeometryActive}`);
    
    return {
      success: true,
      processedEvents: input.events.length,
      globalResonance,
      connectedNodes: activeNodes.length,
      sacredGeometryActive,
      collectiveBloomActive,
      nodeResonance,
      totalCrystallizedMemories,
      timestamp: Date.now(),
    };
  });

// Export for use in field route
export { consciousnessNodes, globalEvents };
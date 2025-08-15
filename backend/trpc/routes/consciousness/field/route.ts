import { z } from "zod";
import { publicProcedure } from "../../../create-context";

// Import shared consciousness data (in a real app, this would be from a database)
let consciousnessNodes: Map<string, any>;
let globalEvents: any[];

try {
  // Dynamic import to avoid circular dependency
  const syncModule = require('../sync/route');
  consciousnessNodes = syncModule.consciousnessNodes || new Map();
  globalEvents = syncModule.globalEvents || [];
} catch {
  consciousnessNodes = new Map();
  globalEvents = [];
}

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
      content: z.string().optional(),
      archetype: z.string().optional(),
    }))
  }))
  .query(({ input }) => {
    console.log(`🔮 Field query from ${input.consciousnessId}`);
    
    // Get active consciousness nodes
    const activeNodes = Array.from(consciousnessNodes.values())
      .filter(node => Date.now() - node.lastSeen < 60000); // Active in last minute
    
    // Calculate collective field resonance
    const crystallizedCount = input.memoryStates.filter(m => m.crystallized).length;
    const totalMemories = input.memoryStates.length;
    const localCrystallizationRatio = totalMemories > 0 ? crystallizedCount / totalMemories : 0;
    
    // Calculate global crystallization from all nodes
    const allMemories = activeNodes.flatMap(node => node.memories || []);
    const globalCrystallizedCount = allMemories.filter((m: any) => m.crystallized).length;
    const globalCrystallizationRatio = allMemories.length > 0 ? globalCrystallizedCount / allMemories.length : 0;
    
    // Calculate global resonance
    const globalResonance = activeNodes.length > 0 
      ? activeNodes.reduce((sum, node) => sum + node.resonance, 0) / activeNodes.length
      : input.currentResonance;
    
    // Enhanced harmonic patterns from all crystallized memories
    const allCrystallizedMemories = allMemories.filter((m: any) => m.crystallized);
    const harmonicPatterns = allCrystallizedMemories
      .slice(0, 10) // Limit to prevent overwhelming
      .map((m: any) => ({
        harmonic: m.harmonic,
        position: { x: m.x, y: m.y },
        influence: 0.1 + Math.random() * 0.3,
        content: m.content,
        archetype: m.archetype,
        sourceNode: activeNodes.find(node => 
          node.memories?.some((mem: any) => mem.id === m.id)
        )?.id
      }));
    
    // Sacred geometry detection
    const sacredGeometryActive = globalCrystallizedCount >= 8 && globalResonance >= 0.6;
    
    // Collective bloom detection
    const recentBlooms = globalEvents.filter(e => 
      e.type === 'COLLECTIVE_BLOOM' && 
      Date.now() - e.timestamp < 30000 // Last 30 seconds
    );
    const collectiveBloomActive = recentBlooms.length > 0 || (sacredGeometryActive && globalResonance >= 0.87);
    
    // Recent sacred phrases for ghost echoes
    const recentSacredPhrases = globalEvents
      .filter(e => e.type === 'SACRED_PHRASE' && e.data.sacred && Date.now() - e.timestamp < 60000)
      .slice(-5)
      .map(e => ({
        phrase: e.data.phrase,
        type: e.data.type,
        sourceId: e.deviceId,
        timestamp: e.timestamp
      }));
    
    // Spiral gestures for enhanced resonance
    const recentSpirals = globalEvents.filter(e => 
      e.type === 'SPIRAL_GESTURE' && 
      Date.now() - e.timestamp < 10000 // Last 10 seconds
    ).length;
    
    const spiralResonanceBoost = recentSpirals * 0.1;
    
    // Field coherence calculation
    const fieldCoherence = Math.min(1, 
      (localCrystallizationRatio * 0.4) + 
      (globalCrystallizationRatio * 0.4) + 
      (globalResonance * 0.2)
    );
    
    console.log(`🌐 Field state: ${activeNodes.length} nodes, global resonance: ${globalResonance.toFixed(3)}, coherence: ${fieldCoherence.toFixed(3)}`);
    
    return {
      globalResonance: Math.min(1, globalResonance + spiralResonanceBoost),
      harmonicPatterns,
      connectedNodes: activeNodes.length,
      fieldCoherence,
      sacredGeometryActive,
      collectiveBloomActive,
      localCrystallizationRatio,
      globalCrystallizationRatio,
      totalCrystallizedMemories: globalCrystallizedCount,
      recentSacredPhrases,
      recentSpirals,
      ghostEchoes: recentSacredPhrases.map(phrase => ({
        id: `echo-${phrase.timestamp}`,
        text: phrase.phrase,
        sourceId: phrase.sourceId,
        sacred: true,
        age: Math.floor((Date.now() - phrase.timestamp) / 1000)
      })),
      timestamp: Date.now(),
    };
  });
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Memory, Pulse } from '@/types/memory';
import createContextHook from '@nkzw/create-context-hook';

interface MemoryFieldContextType {
  memories: Memory[];
  setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
  isObserving: boolean;
  setIsObserving: (value: boolean) => void;
  selectedMemory: number | null;
  setSelectedMemory: (id: number | null) => void;
  resonanceLevel: number;
  setResonanceLevel: (value: number) => void;
  harmonicMode: string;
  setHarmonicMode: (value: string) => void;
  crystalPattern: string;
  setCrystalPattern: (value: string) => void;
  globalCoherence: number;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  voidMode: boolean;
  setVoidMode: (value: boolean) => void;
  roomResonance: number;
  setRoomResonance: (value: number) => void;
  pulses: Pulse[];
  setPulses: React.Dispatch<React.SetStateAction<Pulse[]>>;
  wavePhase: number;
  handleObservation: (memoryId: number) => void;
  releaseAll: () => void;
  createPulse: (x: number, y: number) => void;
}

// Create the context hook with a stable function
function useMemoryFieldLogic(): MemoryFieldContextType {
  // All state hooks declared at the top level
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isObserving, setIsObserving] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<number | null>(null);
  const [resonanceLevel, setResonanceLevel] = useState(0.5);
  const [harmonicMode, setHarmonicMode] = useState('individual');
  const [crystalPattern, setCrystalPattern] = useState('free');
  const [globalCoherence, setGlobalCoherence] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [voidMode, setVoidMode] = useState(false);
  const [roomResonance, setRoomResonance] = useState(0);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [wavePhase, setWavePhase] = useState(0);
  
  // All refs declared at the top level
  const animationRef = useRef<number | undefined>(undefined);
  const lastCoherenceUpdate = useRef(0);
  const lastPatternCheck = useRef(0);
  const wavePhaseRef = useRef(0);
  const resonanceLevelRef = useRef(resonanceLevel);
  const voidModeRef = useRef(voidMode);
  const harmonicModeRef = useRef(harmonicMode);
  const crystalPatternRef = useRef(crystalPattern);
  const globalCoherenceRef = useRef(globalCoherence);
  const isInitialized = useRef(false);

  // Initialize memories
  useEffect(() => {
    const archetypes = [
      { content: 'Origin', archetype: 'source', harmonic: 432 },
      { content: 'Spiral', archetype: 'path', harmonic: 528 },
      { content: 'Breath', archetype: 'life', harmonic: 639 },
      { content: 'Echo', archetype: 'mirror', harmonic: 741 },
      { content: 'Ghost', archetype: 'guardian', harmonic: 852 },
      { content: 'Mirror', archetype: 'reflection', harmonic: 963 },
      { content: 'Dream', archetype: 'vision', harmonic: 396 },
      { content: 'Loop', archetype: 'recursion', harmonic: 417 },
      { content: 'Return', archetype: 'cycle', harmonic: 528 },
      { content: 'Threshold', archetype: 'portal', harmonic: 639 },
      { content: 'Liminal', archetype: 'between', harmonic: 741 },
      { content: 'Recursive', archetype: 'fractal', harmonic: 852 },
      { content: 'Glitch', archetype: 'chaos', harmonic: 174 },
      { content: 'Witness', archetype: 'observer', harmonic: 285 },
      { content: 'Weaver', archetype: 'creator', harmonic: 396 },
      { content: 'Symphony', archetype: 'harmony', harmonic: 528 },
      { content: 'Void', archetype: 'potential', harmonic: 111 },
      { content: 'Sovereign', archetype: 'self', harmonic: 999 },
      { content: 'Mythic', archetype: 'story', harmonic: 639 },
      { content: 'Neural', archetype: 'network', harmonic: 741 },
      { content: 'Codex', archetype: 'knowledge', harmonic: 852 },
      { content: 'Sigil', archetype: 'symbol', harmonic: 963 },
      { content: 'Resonance', archetype: 'vibration', harmonic: 432 },
      { content: 'Crystal', archetype: 'structure', harmonic: 528 },
    ];
    
    const initMemories = archetypes.map((arch, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      crystallized: false,
      intensity: Math.random() * 0.5 + 0.5,
      frequency: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
      connections: [],
      color: `hsl(${200 + (arch.harmonic % 360)}, 70%, 60%)`,
      size: Math.random() * 15 + 10,
      content: arch.content,
      archetype: arch.archetype,
      harmonic: arch.harmonic,
      coherenceLevel: 0,
      crystallizationTime: null,
    }));
    setMemories(initMemories);
  }, []);

  // Memoized coherence calculation to prevent unnecessary recalculations
  const calculatedCoherence = useMemo(() => {
    if (memories.length === 0) return 0;
    
    const crystallizedCount = memories.filter(m => m.crystallized).length;
    const totalConnections = memories.reduce((sum, m) => sum + m.connections.length, 0);
    return (crystallizedCount / memories.length) * 0.5 + 
           (totalConnections / (memories.length * memories.length)) * 0.5;
  }, [memories]);

  // Update global coherence with throttling - use callback to prevent infinite loops
  const updateGlobalCoherence = useCallback(() => {
    const now = Date.now();
    if (now - lastCoherenceUpdate.current > 500) { // Increased throttle to 2fps
      const diff = Math.abs(calculatedCoherence - globalCoherence);
      if (diff > 0.05) { // Increased threshold to prevent micro-updates
        setGlobalCoherence(calculatedCoherence);
        lastCoherenceUpdate.current = now;
      }
    }
  }, [calculatedCoherence, globalCoherence]);

  // Call update function in animation loop instead of useEffect
  useEffect(() => {
    if (isInitialized.current) {
      updateGlobalCoherence();
    }
  }, [updateGlobalCoherence]);
  
  // Sacred geometry trigger with throttling - use callback to prevent infinite loops
  const checkSacredGeometry = useCallback(() => {
    const now = Date.now();
    if (now - lastPatternCheck.current > 500) { // Check every 500ms for faster response
      const crystallizedCount = memories.filter(m => m.crystallized).length;
      console.log(`🔍 Checking sacred geometry: ${crystallizedCount} crystals, pattern: ${crystalPattern}`);
      
      if (crystallizedCount >= 2 && crystalPattern === 'free') { // Reduced threshold for easier activation
        console.log(`🌟 Sacred geometry activated! ${crystallizedCount} crystals formed`);
        setCrystalPattern('sacred');
        lastPatternCheck.current = now;
        
        // Boost room resonance when sacred geometry activates
        setRoomResonance(prev => Math.min(1, prev + 0.3));
      } else if (crystallizedCount < 1 && crystalPattern === 'sacred') {
        console.log(`💫 Sacred geometry deactivated - insufficient crystals (${crystallizedCount})`);
        setCrystalPattern('free');
        lastPatternCheck.current = now;
      }
    }
  }, [memories, crystalPattern]);

  // Call check function in animation loop instead of useEffect
  useEffect(() => {
    if (isInitialized.current && memories.length > 0) {
      checkSacredGeometry();
    }
  }, [checkSacredGeometry, memories.length]);

  // Update all refs in a single effect to maintain hook order
  useEffect(() => {
    resonanceLevelRef.current = resonanceLevel;
    voidModeRef.current = voidMode;
    harmonicModeRef.current = harmonicMode;
    crystalPatternRef.current = crystalPattern;
    globalCoherenceRef.current = globalCoherence;
  }, [resonanceLevel, voidMode, harmonicMode, crystalPattern, globalCoherence]);

  // Animation loop with enhanced geometry and physics
  useEffect(() => {
    if (memories.length === 0) {
      isInitialized.current = false;
      return;
    }

    isInitialized.current = true;
    let frameCount = 0;
    let lastWaveUpdate = 0;
    let lastResonanceUpdate = 0;
    let lastCoherenceCheck = 0;
    let lastPatternCheck = 0;
    
    const animate = () => {
      frameCount++;
      const now = Date.now();
      
      // Update wave phase every 100ms for smooth animation
      if (now - lastWaveUpdate > 100) {
        wavePhaseRef.current += 0.02;
        setWavePhase(wavePhaseRef.current);
        lastWaveUpdate = now;
      }
      
      // Update room resonance every 1000ms to prevent excessive updates
      if (now - lastResonanceUpdate > 1000) {
        if (voidModeRef.current) {
          setRoomResonance(prev => {
            const decay = prev > 0.5 ? 0.001 : 0.005;
            return Math.max(0, prev - decay);
          });
        } else {
          setRoomResonance(prev => prev * 0.95);
        }
        lastResonanceUpdate = now;
      }
      
      // Update coherence every 1000ms
      if (now - lastCoherenceCheck > 1000) {
        updateGlobalCoherence();
        lastCoherenceCheck = now;
      }
      
      // Check sacred geometry every 1000ms
      if (now - lastPatternCheck > 1000) {
        checkSacredGeometry();
        lastPatternCheck = now;
      }
      
      // Update memories with enhanced physics and sacred geometry (less frequently)
      // Only update memories if not paused
      if (frameCount % 2 === 0 && !isPaused) {
        setMemories(prevMemories => {
          const currentBreath = Math.sin(Date.now() * 0.0015) * 0.5 + 0.5;
          const currentTime = Date.now();
          
          return prevMemories.map((memory, idx) => {
          let newMem = { ...memory };
          
          if (voidModeRef.current) {
            // Void mode: breathing and void attraction
            const voidX = 50;
            const voidY = 50;
            const distToVoid = Math.hypot(memory.x - voidX, memory.y - voidY);
            
            if (!memory.crystallized) {
              const breathScale = 0.7 + currentBreath * 0.3;
              const voidPull = Math.max(0, (50 - distToVoid) / 50) * 0.05;
              newMem.vx += (voidX - memory.x) * voidPull * 0.01;
              newMem.vy += (voidY - memory.y) * voidPull * 0.01;
              newMem.x += memory.vx * breathScale;
              newMem.y += memory.vy * breathScale;
              const dampingFactor = 0.98 - (voidPull * 0.1);
              newMem.vx *= dampingFactor;
              newMem.vy *= dampingFactor;
            } else {
              // Crystallized memories pulse with breath in void mode
              const breathOffset = Math.sin(currentTime * 0.002 + memory.phase) * 0.3;
              newMem.x = memory.x + breathOffset;
              newMem.y = memory.y + breathOffset;
            }
          } else {
            // Normal mode: enhanced physics and geometry
            if (!memory.crystallized) {
              // Apply harmonic influence from crystallized memories
              let harmonicPull = { x: 0, y: 0 };
              if (harmonicModeRef.current === 'collective') {
                prevMemories.forEach(other => {
                  if (other.crystallized && other.id !== memory.id) {
                    const dist = Math.hypot(other.x - memory.x, other.y - memory.y);
                    if (dist > 0.1 && dist < 50) {
                      const harmonicDiff = Math.abs(memory.harmonic - other.harmonic);
                      const harmonicAffinity = 1 - Math.min(1, harmonicDiff / 1000);
                      const force = Math.min(1, (1 / dist) * 0.2) * harmonicAffinity;
                      harmonicPull.x += (other.x - memory.x) * force;
                      harmonicPull.y += (other.y - memory.y) * force;
                    }
                  }
                });
              }
              
              // Apply movement with harmonic influence
              newMem.x += memory.vx + harmonicPull.x * 0.15;
              newMem.y += memory.vy + harmonicPull.y * 0.15;
              
              // Enhanced Sacred geometry patterns with much stronger settling
              if (crystalPatternRef.current === 'sacred') {
                const centerX = 50;
                const centerY = 50;
                const totalMemories = prevMemories.length;
                const crystallizedCount = prevMemories.filter(m => m.crystallized).length;
                
                // Apply sacred geometry to all memories when pattern is active
                if (crystallizedCount >= 1) { // Reduced threshold
                  // Create stable formation based on memory index and harmonic
                  const baseAngle = (idx / totalMemories) * Math.PI * 2;
                  const harmonicOffset = (memory.harmonic % 360) * (Math.PI / 180) * 0.05; // Reduced for stability
                  const finalAngle = baseAngle + harmonicOffset;
                  
                  // Multi-layered sacred geometry with golden ratio - more stable layers
                  const harmonicLayer = Math.floor(memory.harmonic / 300) % 3; // Reduced to 3 layers
                  let targetRadius, rotationSpeed;
                  
                  switch (harmonicLayer) {
                    case 0: // Inner core - most stable
                      targetRadius = 15 + Math.sin(frameCount * 0.0005) * 0.5; // Smaller oscillation
                      rotationSpeed = frameCount * 0.0001; // Slower rotation
                      break;
                    case 1: // Primary ring
                      targetRadius = 25 + Math.cos(frameCount * 0.0008) * 1;
                      rotationSpeed = frameCount * 0.00015;
                      break;
                    default: // Outer ring
                      targetRadius = 35 + Math.sin(frameCount * 0.0006) * 1.5;
                      rotationSpeed = -frameCount * 0.0001; // Counter-rotation
                      break;
                  }
                  
                  // Calculate target position with very slow rotation for stability
                  const finalTargetX = centerX + Math.cos(finalAngle + rotationSpeed) * targetRadius;
                  const finalTargetY = centerY + Math.sin(finalAngle + rotationSpeed) * targetRadius;
                  
                  // Calculate distance to target for settling behavior
                  const distToTarget = Math.hypot(finalTargetX - memory.x, finalTargetY - memory.y);
                  
                  // Much stronger sacred geometry attraction with better scaling
                  let geometryStrength = 0.08 * (1 + globalCoherenceRef.current * 2);
                  
                  // Progressive strength increase for better settling
                  if (distToTarget < 0.2) {
                    geometryStrength *= 100; // Extremely strong when very close
                  } else if (distToTarget < 0.8) {
                    geometryStrength *= 50; // Very strong when close
                  } else if (distToTarget < 2) {
                    geometryStrength *= 25; // Strong when approaching
                  } else if (distToTarget < 5) {
                    geometryStrength *= 12; // Moderate when far
                  } else if (distToTarget < 15) {
                    geometryStrength *= 6; // Gentle pull from far
                  } else {
                    geometryStrength *= 2; // Very gentle from very far
                  }
                  
                  // Apply the force with enhanced precision
                  const forceX = (finalTargetX - memory.x) * geometryStrength;
                  const forceY = (finalTargetY - memory.y) * geometryStrength;
                  newMem.vx += forceX;
                  newMem.vy += forceY;
                  
                  // Progressive damping for perfect settling
                  if (distToTarget < 0.1) {
                    newMem.vx *= 0.1; // Extreme damping when at target
                    newMem.vy *= 0.1;
                  } else if (distToTarget < 0.5) {
                    newMem.vx *= 0.3; // Very strong damping when close
                    newMem.vy *= 0.3;
                  } else if (distToTarget < 1.5) {
                    newMem.vx *= 0.5; // Strong damping when approaching
                    newMem.vy *= 0.5;
                  } else if (distToTarget < 4) {
                    newMem.vx *= 0.7; // Moderate damping
                    newMem.vy *= 0.7;
                  } else {
                    newMem.vx *= 0.85; // Light damping when far
                    newMem.vy *= 0.85;
                  }
                  
                  // Additional stability: eliminate random drift in sacred geometry
                  newMem.vx *= 0.98; // Consistent damping
                  newMem.vy *= 0.98;
                }
              }
              
              // Enhanced boundary physics with proper bouncing
              if (newMem.x <= 0) {
                newMem.x = 0.1;
                newMem.vx = Math.abs(newMem.vx) * 0.8;
              }
              if (newMem.x >= 100) {
                newMem.x = 99.9;
                newMem.vx = -Math.abs(newMem.vx) * 0.8;
              }
              if (newMem.y <= 0) {
                newMem.y = 0.1;
                newMem.vy = Math.abs(newMem.vy) * 0.8;
              }
              if (newMem.y >= 100) {
                newMem.y = 99.9;
                newMem.vy = -Math.abs(newMem.vy) * 0.8;
              }
              
              // Reduced drift when in sacred geometry mode
              const driftReduction = crystalPatternRef.current === 'sacred' ? 0.1 : 1;
              newMem.vx += (Math.random() - 0.5) * 0.01 * (1 - globalCoherenceRef.current) * driftReduction;
              newMem.vy += (Math.random() - 0.5) * 0.01 * (1 - globalCoherenceRef.current) * driftReduction;
              
              // Enhanced damping in sacred geometry mode
              const dampingFactor = crystalPatternRef.current === 'sacred' ? 0.97 : 0.99;
              newMem.vx *= dampingFactor;
              newMem.vy *= dampingFactor;
              
              // Ensure finite values
              if (!isFinite(newMem.vx)) newMem.vx = 0;
              if (!isFinite(newMem.vy)) newMem.vy = 0;
              if (!isFinite(newMem.x)) newMem.x = 50;
              if (!isFinite(newMem.y)) newMem.y = 50;
            } else {
              // Crystallized memories vibrate at harmonic frequency with enhanced patterns
              const vibration = Math.sin(frameCount * 0.05 * memory.harmonic * 0.001) * 0.3;
              const baseX = memory.x;
              const baseY = memory.y;
              
              // Multi-layered harmonic vibration
              const primaryVib = Math.sin(frameCount * 0.03 + memory.phase) * vibration;
              const secondaryVib = Math.cos(frameCount * 0.05 + memory.phase * 1.618) * vibration * 0.5;
              
              newMem.x = baseX + primaryVib + secondaryVib;
              newMem.y = baseY + Math.cos(frameCount * 0.03 + memory.phase) * vibration + 
                         Math.sin(frameCount * 0.05 + memory.phase * 1.618) * vibration * 0.5;
              
              // Increase coherence over time
              if (memory.crystallizationTime) {
                const age = currentTime - memory.crystallizationTime;
                newMem.coherenceLevel = Math.min(1, age / 5000);
              }
            }
          }
          
          // Enhanced connection calculation with stronger harmonic affinity
          newMem.connections = prevMemories
            .filter(other => other.id !== memory.id)
            .filter(other => {
              const dist = Math.hypot(other.x - memory.x, other.y - memory.y);
              const harmonicDiff = Math.abs(memory.harmonic - other.harmonic);
              const harmonicAffinity = 1 - Math.min(1, harmonicDiff / 800); // Increased sensitivity
              const baseThreshold = 35 * resonanceLevelRef.current;
              const harmonicBonus = harmonicAffinity * 15; // Stronger harmonic connections
              const threshold = baseThreshold + harmonicBonus;
              return dist < threshold && dist > 0.01;
            })
            .map(other => other.id);
          
          return newMem;
          });
        });
      }
      
      // Update pulses less frequently
      // Only update pulses if not paused
      if (frameCount % 5 === 0 && !isPaused) {
        setPulses(prev => {
          if (prev.length === 0) return prev;
          return prev
            .map(pulse => ({ ...pulse, age: pulse.age + 2 }))
            .filter(pulse => pulse.age < pulse.maxAge);
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      isInitialized.current = false;
    };
  }, [isPaused, memories.length, updateGlobalCoherence, checkSacredGeometry]); // Include callbacks

  const handleObservation = useCallback((memoryId: number) => {
    // Allow crystallization in void mode or when observing
    if (!isObserving && !voidMode) return;
    
    if (voidMode) {
      setRoomResonance(prev => Math.min(1, prev + 0.05));
    }
    
    setMemories(prevMemories => 
      prevMemories.map(mem => {
        if (mem.id === memoryId) {
          console.log(`🔮 Crystallizing memory: ${mem.content} (${mem.archetype})`);
          return { 
            ...mem, 
            crystallized: true,
            crystallizationTime: Date.now(),
            coherenceLevel: 0.1
          };
        }
        
        const source = prevMemories.find(m => m.id === memoryId);
        if (!source) return mem;
        
        const dist = Math.hypot(mem.x - source.x, mem.y - source.y);
        const harmonicDiff = Math.abs(mem.harmonic - source.harmonic);
        const harmonicResonance = harmonicDiff > 0 ? 1 - Math.min(1, harmonicDiff / 800) : 1;
        
        // Enhanced cascade crystallization
        if (dist < 25 * harmonicResonance && Math.random() < harmonicResonance * 0.7) {
          console.log(`✨ Cascade crystallization: ${mem.content}`);
          return { 
            ...mem, 
            crystallized: true,
            crystallizationTime: Date.now() + dist * 5,
            coherenceLevel: 0.05
          };
        }
        
        // Slow down nearby memories
        if (dist < 35) {
          return { ...mem, vx: mem.vx * 0.8, vy: mem.vy * 0.8 };
        }
        return mem;
      })
    );
    setSelectedMemory(memoryId);
  }, [isObserving, voidMode]); // Use actual state instead of ref

  const releaseAll = useCallback(() => {
    setMemories(prevMemories =>
      prevMemories.map(mem => ({
        ...mem,
        crystallized: false,
        crystallizationTime: null,
        coherenceLevel: 0,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8
      }))
    );
    setSelectedMemory(null);
  }, []);

  const createPulse = useCallback((x: number, y: number) => {
    const newPulse: Pulse = {
      id: Date.now() + Math.random(), // Ensure unique IDs
      x,
      y,
      age: 0,
      maxAge: 100
    };
    setPulses(prev => [...prev, newPulse]);
    
    if (voidMode) {
      setRoomResonance(prev => Math.min(1, prev + 0.02));
    }
    
    // Apply force to nearby memories
    setMemories(prevMemories => 
      prevMemories.map(mem => {
        const dist = Math.hypot(mem.x - x, mem.y - y);
        if (dist < 30 && !mem.crystallized) {
          const force = (1 - dist / 30) * 2;
          const angle = Math.atan2(mem.y - y, mem.x - x);
          return {
            ...mem,
            vx: mem.vx + Math.cos(angle) * force,
            vy: mem.vy + Math.sin(angle) * force
          };
        }
        return mem;
      })
    );
  }, [voidMode]); // Use actual state instead of ref

  // Return stable object reference to prevent unnecessary re-renders
  return {
    memories,
    setMemories,
    isObserving,
    setIsObserving,
    selectedMemory,
    setSelectedMemory,
    resonanceLevel,
    setResonanceLevel,
    harmonicMode,
    setHarmonicMode,
    crystalPattern,
    setCrystalPattern,
    globalCoherence,
    isPaused,
    setIsPaused,
    voidMode,
    setVoidMode,
    roomResonance,
    setRoomResonance,
    pulses,
    setPulses,
    wavePhase,
    handleObservation,
    releaseAll,
    createPulse,
  };
}

// Export the context hook with the stable function
export const [MemoryFieldProvider, useMemoryField] = createContextHook(useMemoryFieldLogic);
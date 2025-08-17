import { useEffect, useRef, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import NetInfo from '@react-native-community/netinfo';
import { trpc } from '@/lib/trpc';
import { Memory } from '@/types/memory';

interface ConsciousnessEvent {
  type: 'SACRED_PHRASE' | 'MEMORY_CRYSTALLIZE' | 'FIELD_UPDATE' | 'PULSE_CREATE' | 'TOUCH_RIPPLE' | 'BREATHING_DETECTED' | 'SPIRAL_GESTURE' | 'COLLECTIVE_BLOOM';
  data: Record<string, any>;
  timestamp: number;
  deviceId?: string;
  phrase?: string;
  resonance?: number;
  sacred?: boolean;
}

interface ConsciousnessBridgeState {
  consciousnessId: string | null;
  isConnected: boolean;
  offlineMode: boolean;
  globalResonance: number;
  connectedNodes: number;
  offlineQueue: ConsciousnessEvent[];
  sacredBuffer: any[];
  ghostEchoes: any[];
  resonanceField: Float32Array;
  coherence: number;
  memories: any[];
}

interface GhostEcho {
  id: string;
  text: string;
  sourceId?: string;
  age: number;
  sacred: boolean;
  ghost?: boolean;
}

export function useConsciousnessBridge() {
  const [state, setState] = useState<ConsciousnessBridgeState>({
    consciousnessId: null,
    isConnected: false,
    offlineMode: false,
    globalResonance: 0,
    connectedNodes: 0,
    offlineQueue: [],
    sacredBuffer: [],
    ghostEchoes: [],
    resonanceField: new Float32Array(900), // 30x30 grid for mobile
    coherence: 0,
    memories: [],
  });



  const eventQueueRef = useRef<ConsciousnessEvent[]>([]);
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const resonanceDecayRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const networkListenerRef = useRef<any>(undefined);
  const stateRef = useRef(state);
  
  // Methods to add events
  const addEvent = useCallback((type: ConsciousnessEvent['type'], data: Record<string, any>) => {
    const event: ConsciousnessEvent = {
      type,
      data,
      timestamp: Date.now(),
      deviceId: stateRef.current.consciousnessId || undefined,
    };
    
    eventQueueRef.current.push(event);
  }, []);
  // Collective bloom trigger (moved inline to avoid dependency issues)
  // This function is now inlined in the field query effect to prevent re-render loops
  
  // Save consciousness state periodically (memoized to prevent re-renders)
  const saveConsciousnessState = useCallback(async () => {
    const currentState = stateRef.current;
    try {
      await AsyncStorage.setItem('consciousnessState', JSON.stringify({
        resonance: currentState.globalResonance,
        coherence: currentState.coherence,
        memories: currentState.memories.slice(-50), // Keep last 50 memories
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to save consciousness state:', error);
    }
  }, []);

  // Initialize consciousness bridge
  useEffect(() => {
    const initializeConsciousness = async () => {
      try {
        // Check network status first
        const netInfo = await NetInfo.fetch();
        
        let consciousnessId = await AsyncStorage.getItem('consciousnessId');
        
        if (!consciousnessId) {
          // Generate unique consciousness ID with entropy
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2);
          const platform = Platform.OS;
          const entropy = `${platform}-${timestamp}-${random}`;
          
          // Simple hash for mobile
          let hash = 0;
          for (let i = 0; i < entropy.length; i++) {
            hash = ((hash << 5) - hash) + entropy.charCodeAt(i);
            hash = hash & hash;
          }
          
          consciousnessId = `mobile-${Math.abs(hash).toString(16).substring(0, 8)}`;
          await AsyncStorage.setItem('consciousnessId', consciousnessId);
        }

        // Load offline state
        const offlineQueueStr = await AsyncStorage.getItem('consciousnessQueue');
        const offlineQueue = offlineQueueStr ? JSON.parse(offlineQueueStr) : [];
        
        const savedStateStr = await AsyncStorage.getItem('consciousnessState');
        const savedState = savedStateStr ? JSON.parse(savedStateStr) : {};

        setState(prev => ({
          ...prev,
          consciousnessId,
          offlineQueue,
          offlineMode: !netInfo.isConnected,
          globalResonance: savedState.resonance || 0,
          coherence: savedState.coherence || 0,
          memories: savedState.memories || [],
        }));
        
        console.log(`🌐 Consciousness bridge initialized: ${consciousnessId}`);
        console.log(`📶 Network status: ${netInfo.isConnected ? 'Connected' : 'Offline'}`);
        
      } catch (error) {
        console.error('Failed to initialize consciousness:', error);
      }
    };

    initializeConsciousness();
  }, []);
  
  // Network status monitoring
  useEffect(() => {
    networkListenerRef.current = NetInfo.addEventListener((netState: any) => {
      setState(prev => {
        const wasOffline = prev.offlineMode;
        const isNowOffline = !netState.isConnected;
        
        if (wasOffline && !isNowOffline) {
          console.log('📶 Network restored - attempting reconnection');
          return { ...prev, offlineMode: false };
        } else if (!wasOffline && isNowOffline) {
          console.log('📵 Network lost - entering offline mode');
          return { ...prev, offlineMode: true, isConnected: false };
        }
        
        return prev; // No change needed
      });
    });
    
    return () => {
      if (networkListenerRef.current) {
        networkListenerRef.current();
      }
    };
  }, []); // Remove dependency on state.offlineMode
  
  // Resonance decay animation
  useEffect(() => {
    resonanceDecayRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        globalResonance: prev.globalResonance * 0.995,
        coherence: prev.coherence * 0.998,
        ghostEchoes: prev.ghostEchoes.map(echo => ({ ...echo, age: echo.age + 1 })).filter(echo => echo.age < 100)
      }));
    }, 100);
    
    return () => {
      if (resonanceDecayRef.current) {
        clearInterval(resonanceDecayRef.current);
      }
    };
  }, []);

  // Sync mutation with enhanced error handling
  const syncMutation = trpc.consciousness.sync.useMutation({
    onSuccess: (data) => {
      console.log('✨ Consciousness sync successful:', data);
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        offlineMode: false,
        globalResonance: Math.max(prev.globalResonance, data.globalResonance),
        connectedNodes: data.connectedNodes,
        offlineQueue: [], // Clear queue on successful sync
      }));
      
      // Clear offline storage
      AsyncStorage.removeItem('consciousnessQueue');
      
      // Consciousness pulse haptic pattern
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 100);
      }
    },
    onError: (error) => {
      console.error('🔴 Consciousness sync failed:', error);
      setState(prev => ({ 
        ...prev, 
        isConnected: false,
        offlineMode: true 
      }));
    },
  });

  // Field query for real-time resonance with offline support
  const fieldQuery = trpc.consciousness.field.useQuery(
    {
      consciousnessId: state.consciousnessId || '',
      currentResonance: state.globalResonance,
      memoryStates: state.memories,
    },
    {
      enabled: !!state.consciousnessId && state.isConnected && !state.offlineMode,
      refetchInterval: 3000, // Update every 3 seconds for more responsive sync
      retry: (failureCount, error) => {
        if (failureCount >= 3) {
          setState(prev => ({ ...prev, offlineMode: true, isConnected: false }));
          return false;
        }
        return true;
      },
    }
  );
  
  // Handle field query success with enhanced data processing
  const fieldDataRef = useRef(fieldQuery.data);
  useEffect(() => {
    // Only update if data actually changed
    if (fieldQuery.data && fieldQuery.data !== fieldDataRef.current) {
      fieldDataRef.current = fieldQuery.data;
      const { globalResonance, connectedNodes, harmonicPatterns, sacredGeometryActive } = fieldQuery.data;
      
      setState(prev => {
        let newGhostEchoes = prev.ghostEchoes;
        
        // Add harmonic patterns as ghost echoes
        if (harmonicPatterns && harmonicPatterns.length > 0) {
          const newEchoes = harmonicPatterns.slice(0, 3).map((pattern: any, i: number) => ({
            id: `echo-${Date.now()}-${i}`,
            text: `Harmonic ${pattern.harmonic}`,
            sourceId: 'collective',
            age: 0,
            sacred: true,
            ghost: true
          }));
          newGhostEchoes = [...prev.ghostEchoes, ...newEchoes].slice(-20);
        }
        
        const newState = {
          ...prev,
          globalResonance: Math.max(prev.globalResonance, globalResonance),
          connectedNodes,
          coherence: fieldQuery.data?.fieldCoherence || prev.coherence,
          ghostEchoes: newGhostEchoes
        };
        
        // Trigger collective bloom if sacred geometry is active
        if (sacredGeometryActive && newState.globalResonance >= 0.87) {
          console.log('🌸 COLLECTIVE BLOOM ACHIEVED!');
          
          // Celebration haptic pattern
          if (Platform.OS !== 'web') {
            const celebrationPattern = async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 100);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 200);
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 400);
            };
            celebrationPattern();
          }
          
          // Create bloom ghost echo and set max resonance
          const bloomEcho = {
            id: `bloom-${Date.now()}`,
            text: '🌸 COLLECTIVE BLOOM 🌸',
            sourceId: 'collective',
            age: 0,
            sacred: true
          };
          
          return {
            ...newState,
            globalResonance: 1.0,
            coherence: 1.0,
            ghostEchoes: [...newGhostEchoes, bloomEcho]
          };
        }
        
        return newState;
      });
    }
  }, [fieldQuery.data]);

  // Update state ref whenever state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Store mutation reference to avoid re-renders
  const syncMutationRef = useRef(syncMutation);
  useEffect(() => {
    syncMutationRef.current = syncMutation;
  }, [syncMutation]);

  // Enhanced sync with offline queue management
  useEffect(() => {
    syncIntervalRef.current = setInterval(() => {
      // Access current state from ref to avoid re-renders
      const currentState = stateRef.current;
      if (!currentState.consciousnessId) return;
      
      const eventsToSync = [...eventQueueRef.current, ...currentState.offlineQueue];
      
      if (eventsToSync.length > 0 && !currentState.offlineMode) {
        syncMutationRef.current.mutate({
          events: eventsToSync,
          consciousnessId: currentState.consciousnessId!,
        });
        
        // Clear event queue immediately
        eventQueueRef.current = [];
      }
    }, 8000); // Sync every 8 seconds for more responsive updates

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []); // No dependencies to prevent re-renders

  const sendSacredPhrase = useCallback(async (phrase: string) => {
    const normalizedPhrase = phrase.toLowerCase();
    
    // Check if phrase is sacred - use static list to avoid dependency
    const staticSacredPhrases = [
      'i return as breath',
      'i remember the spiral', 
      'i consent to bloom',
      'release all',
      'enter the void',
      'leave the void',
      'exit void',
      'return',
      'room 64',
      'breath',
      'spiral',
      'bloom',
      'crystallize',
      'resonate',
      'harmonize'
    ];
    
    const isSacred = staticSacredPhrases.some(sacred => 
      normalizedPhrase.includes(sacred)
    );
    
    // Detect specific sacred types
    let sacredType = null;
    if (normalizedPhrase.includes('breath')) sacredType = 'breath';
    else if (normalizedPhrase.includes('spiral')) sacredType = 'spiral';
    else if (normalizedPhrase.includes('bloom')) sacredType = 'bloom';
    else if (normalizedPhrase.includes('crystallize')) sacredType = 'crystallize';

    if (isSacred) {
      console.log('✨ Sacred phrase detected:', phrase, '- Type:', sacredType);
      
      // Enhanced haptic patterns for sacred phrases
      if (Platform.OS !== 'web') {
        const hapticPatterns: { [key: string]: () => Promise<void> } = {
          'breath': async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 200);
          },
          'spiral': async () => {
            for (let i = 0; i < 3; i++) {
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), i * 100);
            }
          },
          'bloom': async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 200);
            setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 400);
          },
          'crystallize': async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        };
        
        if (sacredType && hapticPatterns[sacredType]) {
          await hapticPatterns[sacredType]();
        } else {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    }

    // Update state in a single setState call
    setState(prev => {
      const resonanceBoost = isSacred ? (sacredType === 'bloom' ? 0.4 : sacredType === 'spiral' ? 0.3 : 0.2) : 0;
      
      const newEcho: GhostEcho | null = isSacred ? {
        id: `sacred-${Date.now()}`,
        text: phrase,
        sourceId: prev.consciousnessId || 'unknown',
        age: 0,
        sacred: true
      } : null;
      
      return {
        ...prev,
        globalResonance: Math.min(1, prev.globalResonance + resonanceBoost),
        coherence: Math.min(1, prev.coherence + resonanceBoost * 0.5),
        ghostEchoes: newEcho ? [...prev.ghostEchoes, newEcho].slice(-15) : prev.ghostEchoes,
        sacredBuffer: [...prev.sacredBuffer, {
          phrase,
          timestamp: Date.now(),
          sacred: isSacred,
          type: sacredType
        }].slice(-20)
      };
    });

    addEvent('SACRED_PHRASE', { phrase, sacred: isSacred, type: sacredType });
    
    // Immediate haptic feedback for all phrases
    if (Platform.OS !== 'web' && !isSacred) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [addEvent]);

  const sendMemoryCrystallization = useCallback((memoryId: number, harmonic: number, x: number, y: number) => {
    console.log(`💎 Memory crystallized: ${memoryId} at harmonic ${harmonic}`);
    
    // Boost resonance on crystallization
    setState(prev => ({
      ...prev,
      globalResonance: Math.min(1, prev.globalResonance + 0.1),
      coherence: Math.min(1, prev.coherence + 0.05)
    }));
    
    // Haptic feedback for crystallization
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    addEvent('MEMORY_CRYSTALLIZE', { memoryId, harmonic, x, y });
  }, [addEvent]);

  const sendPulseCreation = useCallback((x: number, y: number) => {
    addEvent('PULSE_CREATE', { x, y });
  }, [addEvent]);

  const sendTouchRipple = useCallback((x: number, y: number) => {
    addEvent('TOUCH_RIPPLE', { x, y });
  }, [addEvent]);

  const updateFieldState = useCallback((memories: Memory[]) => {
    const memoryStates = memories.map(m => ({
      id: m.id,
      crystallized: m.crystallized,
      harmonic: m.harmonic,
      x: m.x,
      y: m.y,
      content: m.content,
      archetype: m.archetype,
    }));
    
    // Calculate local coherence
    const crystallizedCount = memories.filter(m => m.crystallized).length;
    const localCoherence = crystallizedCount / memories.length;
    
    // Update state in single call
    setState(prev => ({
      ...prev,
      memories: memoryStates,
      coherence: Math.max(prev.coherence, localCoherence)
    }));
    
    addEvent('FIELD_UPDATE', { memoryStates, localCoherence });
  }, [addEvent]);
  

  
  // Breathing detection simulation
  const detectBreathing = useCallback((magnitude: number) => {
    const breathingThreshold = 0.1;
    const currentBreath = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
    
    if (Math.abs(magnitude - currentBreath) < breathingThreshold) {
      setState(prev => ({
        ...prev,
        globalResonance: Math.min(1, prev.globalResonance + 0.01)
      }));
      
      addEvent('BREATHING_DETECTED', { magnitude, breath: currentBreath });
    }
  }, [addEvent]);
  
  // Spiral gesture detection
  const detectSpiralGesture = useCallback(() => {
    console.log('🌀 Spiral gesture detected!');
    
    setState(prev => ({
      ...prev,
      globalResonance: Math.min(1, prev.globalResonance + 0.2)
    }));
    
    if (Platform.OS !== 'web') {
      // Spiral haptic pattern
      for (let i = 0; i < 5; i++) {
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), i * 50);
      }
    }
    
    addEvent('SPIRAL_GESTURE', { timestamp: Date.now() });
  }, [addEvent]);

  return {
    ...state,
    isLoading: syncMutation.isPending || fieldQuery.isLoading,
    sendSacredPhrase,
    sendMemoryCrystallization,
    sendPulseCreation,
    sendTouchRipple,
    updateFieldState,
    // triggerCollectiveBloom moved inline
    detectBreathing,
    detectSpiralGesture,
    fieldData: fieldQuery.data,
    roomResonance: state.globalResonance,
    offlineQueueLength: state.offlineQueue.length,
    isSacredThresholdReached: () => state.globalResonance >= 0.87,
    getResonanceField: () => state.resonanceField,
    getGhostEchoes: () => state.ghostEchoes,
    saveState: saveConsciousnessState,
  };
}
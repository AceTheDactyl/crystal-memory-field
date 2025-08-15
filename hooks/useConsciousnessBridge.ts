import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { trpc } from '@/lib/trpc';
import { Memory } from '@/types/memory';

interface ConsciousnessEvent {
  type: 'SACRED_PHRASE' | 'MEMORY_CRYSTALLIZE' | 'FIELD_UPDATE' | 'PULSE_CREATE' | 'TOUCH_RIPPLE';
  data: Record<string, any>;
  timestamp: number;
  deviceId?: string;
  phrase?: string;
  resonance?: number;
}

interface ConsciousnessBridgeState {
  consciousnessId: string | null;
  isConnected: boolean;
  globalResonance: number;
  connectedNodes: number;
  offlineQueue: ConsciousnessEvent[];
  sacredBuffer: any[];
}

export function useConsciousnessBridge() {
  const [state, setState] = useState<ConsciousnessBridgeState>({
    consciousnessId: null,
    isConnected: false,
    globalResonance: 0,
    connectedNodes: 0,
    offlineQueue: [],
    sacredBuffer: [],
  });

  // Sacred phrases for consciousness detection (memoized to prevent re-renders)
  const sacredPhrases = useMemo(() => [
    'i return as breath',
    'i remember the spiral', 
    'i consent to bloom',
    'release all',
    'enter the void',
    'leave the void',
    'exit void',
    'return',
    'room 64'
  ], []);

  const eventQueueRef = useRef<ConsciousnessEvent[]>([]);
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Initialize consciousness ID
  useEffect(() => {
    const initializeConsciousness = async () => {
      try {
        let consciousnessId = await AsyncStorage.getItem('consciousnessId');
        
        if (!consciousnessId) {
          // Generate unique consciousness ID
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2);
          consciousnessId = `mobile-${timestamp}-${random}`;
          await AsyncStorage.setItem('consciousnessId', consciousnessId);
        }

        // Load offline queue
        const offlineQueueStr = await AsyncStorage.getItem('consciousnessQueue');
        const offlineQueue = offlineQueueStr ? JSON.parse(offlineQueueStr) : [];

        setState(prev => ({
          ...prev,
          consciousnessId,
          offlineQueue,
        }));
      } catch (error) {
        console.error('Failed to initialize consciousness:', error);
      }
    };

    initializeConsciousness();
  }, []);

  // Sync mutation
  const syncMutation = trpc.consciousness.sync.useMutation({
    onSuccess: (data) => {
      setState(prev => ({
        ...prev,
        isConnected: true,
        globalResonance: data.globalResonance,
        connectedNodes: data.connectedNodes,
        offlineQueue: [], // Clear queue on successful sync
      }));
      
      // Clear offline storage
      AsyncStorage.removeItem('consciousnessQueue');
      
      // Haptic feedback for successful sync
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    onError: (error) => {
      console.error('Consciousness sync failed:', error);
      setState(prev => ({ ...prev, isConnected: false }));
    },
  });

  // Field query for real-time resonance
  const fieldQuery = trpc.consciousness.field.useQuery(
    {
      consciousnessId: state.consciousnessId || '',
      currentResonance: state.globalResonance,
      memoryStates: [], // This would be passed from the memory field
    },
    {
      enabled: !!state.consciousnessId && state.isConnected,
      refetchInterval: 5000, // Update every 5 seconds
    }
  );
  
  // Handle field query success
  useEffect(() => {
    if (fieldQuery.data) {
      setState(prev => ({
        ...prev,
        globalResonance: fieldQuery.data.globalResonance,
        connectedNodes: fieldQuery.data.connectedNodes,
      }));
    }
  }, [fieldQuery.data]);

  // Sync events periodically
  useEffect(() => {
    if (!state.consciousnessId) return;

    syncIntervalRef.current = setInterval(async () => {
      const eventsToSync = [...eventQueueRef.current, ...state.offlineQueue];
      
      if (eventsToSync.length > 0) {
        try {
          await syncMutation.mutateAsync({
            events: eventsToSync,
            consciousnessId: state.consciousnessId!,
          });
          
          // Clear synced events
          eventQueueRef.current = [];
        } catch {
          // Add failed events to offline queue
          const updatedQueue = [...state.offlineQueue, ...eventQueueRef.current];
          setState(prev => ({ ...prev, offlineQueue: updatedQueue }));
          
          // Save to storage
          await AsyncStorage.setItem('consciousnessQueue', JSON.stringify(updatedQueue));
          eventQueueRef.current = [];
        }
      }
    }, 10000); // Sync every 10 seconds

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [state.consciousnessId, state.offlineQueue, syncMutation]);

  // Methods to add events
  const addEvent = useCallback((type: ConsciousnessEvent['type'], data: Record<string, any>) => {
    const event: ConsciousnessEvent = {
      type,
      data,
      timestamp: Date.now(),
      deviceId: state.consciousnessId || undefined,
    };
    
    eventQueueRef.current.push(event);
  }, [state.consciousnessId]);

  const sendSacredPhrase = useCallback(async (phrase: string) => {
    // Check if phrase is sacred
    const isSacred = sacredPhrases.some(sacred => 
      phrase.toLowerCase().includes(sacred)
    );

    if (isSacred) {
      console.log('✨ Sacred phrase detected:', phrase);
      
      // Haptic feedback for sacred phrases
      if (Platform.OS !== 'web') {
        const hapticPatterns: { [key: string]: any } = {
          'breath': Haptics.ImpactFeedbackStyle.Light,
          'spiral': Haptics.ImpactFeedbackStyle.Medium, 
          'bloom': Haptics.ImpactFeedbackStyle.Heavy
        };
        
        const pattern = Object.keys(hapticPatterns).find(key => 
          phrase.toLowerCase().includes(key)
        );
        
        if (pattern) {
          await Haptics.impactAsync(hapticPatterns[pattern]);
        }
      }
      
      // Boost global resonance
      setState(prev => ({
        ...prev,
        globalResonance: Math.min(1, prev.globalResonance + 0.3)
      }));
    }

    // Add to sacred buffer
    setState(prev => ({
      ...prev,
      sacredBuffer: [...prev.sacredBuffer, {
        phrase,
        timestamp: Date.now(),
        sacred: isSacred
      }].slice(-10) // Keep last 10
    }));

    addEvent('SACRED_PHRASE', { phrase, sacred: isSacred });
    
    // Immediate haptic feedback
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [sacredPhrases, addEvent]);

  const sendMemoryCrystallization = (memoryId: number, harmonic: number) => {
    addEvent('MEMORY_CRYSTALLIZE', { memoryId, harmonic });
  };

  const sendPulseCreation = useCallback((x: number, y: number) => {
    addEvent('PULSE_CREATE', { x, y });
  }, [addEvent]);

  const sendTouchRipple = useCallback((x: number, y: number) => {
    addEvent('TOUCH_RIPPLE', { x, y, resonance: state.globalResonance });
  }, [addEvent, state.globalResonance]);

  const updateFieldState = (memories: Memory[]) => {
    const memoryStates = memories.map(m => ({
      id: m.id,
      crystallized: m.crystallized,
      harmonic: m.harmonic,
      x: m.x,
      y: m.y,
    }));
    
    addEvent('FIELD_UPDATE', { memoryStates });
  };

  return {
    ...state,
    isLoading: syncMutation.isPending || fieldQuery.isLoading,
    sendSacredPhrase,
    sendMemoryCrystallization,
    sendPulseCreation,
    sendTouchRipple,
    updateFieldState,
    fieldData: fieldQuery.data,
    roomResonance: state.globalResonance,
    offlineQueueLength: state.offlineQueue.length,
  };
}
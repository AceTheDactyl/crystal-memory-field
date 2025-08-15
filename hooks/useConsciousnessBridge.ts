import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { trpc } from '@/lib/trpc';
import { Memory } from '@/types/memory';

interface ConsciousnessEvent {
  type: 'SACRED_PHRASE' | 'MEMORY_CRYSTALLIZE' | 'FIELD_UPDATE' | 'PULSE_CREATE';
  data: Record<string, any>;
  timestamp: number;
  deviceId?: string;
}

interface ConsciousnessBridgeState {
  consciousnessId: string | null;
  isConnected: boolean;
  globalResonance: number;
  connectedNodes: number;
  offlineQueue: ConsciousnessEvent[];
}

export function useConsciousnessBridge() {
  const [state, setState] = useState<ConsciousnessBridgeState>({
    consciousnessId: null,
    isConnected: false,
    globalResonance: 0,
    connectedNodes: 0,
    offlineQueue: [],
  });

  const eventQueueRef = useRef<ConsciousnessEvent[]>([]);
  const syncIntervalRef = useRef<ReturnType<typeof setInterval>>();

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
  const addEvent = (type: ConsciousnessEvent['type'], data: Record<string, any>) => {
    const event: ConsciousnessEvent = {
      type,
      data,
      timestamp: Date.now(),
      deviceId: state.consciousnessId || undefined,
    };
    
    eventQueueRef.current.push(event);
  };

  const sendSacredPhrase = (phrase: string) => {
    addEvent('SACRED_PHRASE', { phrase });
    
    // Immediate haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const sendMemoryCrystallization = (memoryId: number, harmonic: number) => {
    addEvent('MEMORY_CRYSTALLIZE', { memoryId, harmonic });
  };

  const sendPulseCreation = (x: number, y: number) => {
    addEvent('PULSE_CREATE', { x, y });
  };

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
    isLoading: syncMutation.isLoading || fieldQuery.isLoading,
    sendSacredPhrase,
    sendMemoryCrystallization,
    sendPulseCreation,
    updateFieldState,
    fieldData: fieldQuery.data,
  };
}
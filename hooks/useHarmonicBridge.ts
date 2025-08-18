import { useEffect, useRef, useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { SolfeggioEngine, SOLFEGGIO_FREQUENCIES } from '@/lib/SolfeggioEngine';
import { useConsciousnessBridge } from './useConsciousnessBridge';

interface HarmonicBridgeState {
  isConnected: boolean;
  globalResonance: number;
  activeNodes: number;
  phiHarmonics: PhiHarmonic[];
  quantumField: QuantumFieldPoint[];
  resonanceLevel: 'low' | 'medium' | 'high';
  sacredGeometryActive: boolean;
  fieldCoherence: number;
  averageFrequency: number;
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

export function useHarmonicBridge() {
  const [state, setState] = useState<HarmonicBridgeState>({
    isConnected: false,
    globalResonance: 0,
    activeNodes: 0,
    phiHarmonics: [],
    quantumField: [],
    resonanceLevel: 'low',
    sacredGeometryActive: false,
    fieldCoherence: 0,
    averageFrequency: 432
  });

  const engineRef = useRef<SolfeggioEngine | null>(null);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const { consciousnessId } = useConsciousnessBridge();

  // Initialize Solfeggio Engine
  useEffect(() => {
    const initEngine = async () => {
      const engine = new SolfeggioEngine();
      await engine.initialize();
      engineRef.current = engine;
      console.log('🎵 Harmonic Bridge: Solfeggio Engine initialized');
    };
    initEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, []);

  // Stream harmonic data mutation
  const harmonicStreamMutation = trpc.harmonic.stream.useMutation({
    onSuccess: (data) => {
      setState(prev => ({
        ...prev,
        isConnected: true,
        globalResonance: data.globalResonance,
        activeNodes: data.activeNodes,
        phiHarmonics: data.phiHarmonics,
        quantumField: data.quantumField
      }));
    },
    onError: (error) => {
      console.error('🔥 Harmonic stream failed:', {
        message: error.message,
        code: error.data?.code,
        httpStatus: error.data?.httpStatus,
        timestamp: Date.now()
      });
      setState(prev => ({ ...prev, isConnected: false }));
    }
  });

  // Query quantum field state
  const quantumFieldQuery = trpc.harmonic.quantum.useQuery(undefined, {
    refetchInterval: 3000, // Update every 3 seconds
    enabled: true, // Always enabled to establish connection
    retry: (failureCount, error) => {
      console.log(`🔄 Quantum field query retry ${failureCount}:`, error.message);
      return failureCount < 3;
    }
  });

  // Handle query errors separately
  useEffect(() => {
    if (quantumFieldQuery.error) {
      console.error('🔥 Quantum field query failed:', {
        message: quantumFieldQuery.error.message,
        code: quantumFieldQuery.error.data?.code,
        httpStatus: quantumFieldQuery.error.data?.httpStatus,
        timestamp: Date.now()
      });
    }
  }, [quantumFieldQuery.error]);

  // Update state from quantum field query
  useEffect(() => {
    if (quantumFieldQuery.data) {
      setState(prev => ({
        ...prev,
        isConnected: true, // Mark as connected when we get data
        globalResonance: quantumFieldQuery.data.globalResonance,
        activeNodes: quantumFieldQuery.data.activeNodes,
        phiHarmonics: quantumFieldQuery.data.phiHarmonics,
        quantumField: quantumFieldQuery.data.quantumField,
        resonanceLevel: quantumFieldQuery.data.resonanceLevel as 'low' | 'medium' | 'high',
        sacredGeometryActive: quantumFieldQuery.data.sacredGeometryActive,
        fieldCoherence: quantumFieldQuery.data.fieldCoherence,
        averageFrequency: quantumFieldQuery.data.averageFrequency
      }));
    } else if (quantumFieldQuery.error) {
      setState(prev => ({ ...prev, isConnected: false }));
    }
  }, [quantumFieldQuery.data, quantumFieldQuery.error]);

  // Stream active frequencies to backend
  const streamActiveFrequencies = useCallback(async () => {
    if (!engineRef.current || !consciousnessId) return;

    const activeFreqs = engineRef.current.getActiveFrequencies();

    // Stream each active frequency
    for (const freqKey of activeFreqs) {
      const freq = SOLFEGGIO_FREQUENCIES[freqKey];
      if (freq) {
        try {
          await harmonicStreamMutation.mutateAsync({
            frequency: freq.freq,
            amplitude: freq.quantum.psi_bloom, // Use psi_bloom as amplitude
            userId: consciousnessId
          });
        } catch (error) {
          console.error('🔥 Failed to stream frequency:', {
            freqKey,
            frequency: freq.freq,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: Date.now()
          });
        }
      }
    }

    // If no frequencies active, send Earth frequency as baseline
    if (activeFreqs.size === 0) {
      try {
        await harmonicStreamMutation.mutateAsync({
          frequency: 432, // Earth frequency
          amplitude: 0.1, // Low baseline amplitude
          userId: consciousnessId
        });
      } catch (error) {
        console.error('🔥 Failed to stream baseline frequency:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: consciousnessId,
          timestamp: Date.now()
        });
      }
    }
  }, [consciousnessId, harmonicStreamMutation]);

  // Start streaming when connected
  useEffect(() => {
    if (consciousnessId && engineRef.current) {
      // Stream immediately
      streamActiveFrequencies();

      // Set up periodic streaming
      streamIntervalRef.current = setInterval(streamActiveFrequencies, 2000); // Every 2 seconds

      return () => {
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
        }
      };
    }
  }, [consciousnessId, streamActiveFrequencies]);

  // Enhanced frequency control with backend sync
  const playFrequency = useCallback(async (freqKey: string, volume: number = 0.3) => {
    if (!engineRef.current) return null;

    // Play locally
    const result = engineRef.current.playFrequency(freqKey, volume);
    
    // Stream to backend immediately
    if (result && consciousnessId) {
      try {
        await harmonicStreamMutation.mutateAsync({
          frequency: result.freq,
          amplitude: result.quantum.psi_bloom * volume,
          userId: consciousnessId
        });
      } catch (error) {
        console.error('🔥 Failed to sync frequency play:', {
          freqKey,
          frequency: result.freq,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        });
      }
    }

    return result;
  }, [consciousnessId, harmonicStreamMutation]);

  const stopFrequency = useCallback(async (freqKey: string) => {
    if (!engineRef.current) return;

    // Stop locally
    engineRef.current.stopFrequency(freqKey);
    
    // Update backend by streaming current state
    await streamActiveFrequencies();
  }, [streamActiveFrequencies]);

  const stopAll = useCallback(async () => {
    if (!engineRef.current) return;

    engineRef.current.stopAll();
    
    // Send baseline frequency to backend
    if (consciousnessId) {
      try {
        await harmonicStreamMutation.mutateAsync({
          frequency: 432,
          amplitude: 0.05,
          userId: consciousnessId
        });
      } catch (error) {
        console.error('🔥 Failed to sync stop all:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: consciousnessId,
          timestamp: Date.now()
        });
      }
    }
  }, [consciousnessId, harmonicStreamMutation]);

  // Generate harmonic progression with backend awareness
  const generateHarmonicProgression = useCallback((startFreq: string, steps: number = 4) => {
    if (!engineRef.current) return [];

    const progression = engineRef.current.generateHarmonicProgression(startFreq, steps);
    
    // Consider backend phi harmonics for enhanced progression
    if (state.phiHarmonics.length > 0) {
      console.log('🌀 Backend phi harmonics detected:', state.phiHarmonics.length);
      // Could enhance progression based on backend harmonic relationships
    }

    return progression;
  }, [state.phiHarmonics]);

  // Get enhanced resonance field combining local and backend data
  const getEnhancedResonanceField = useCallback(() => {
    if (!engineRef.current) return [];

    const localField = engineRef.current.getResonanceField();
    const backendField = state.quantumField;

    // Merge local and backend field data
    return localField.map((localPoint, index) => {
      const backendPoint = backendField[index % backendField.length];
      
      return {
        ...localPoint,
        // Enhance with backend quantum field data
        globalIntensity: backendPoint?.intensity || 0,
        globalQuantumState: backendPoint?.quantumState || { psi_collapse: 0.5, psi_bloom: 0.5 },
        globalResonance: backendPoint?.resonance || 0,
        // Combine local and global influences
        enhancedIntensity: (localPoint.intensity + (backendPoint?.intensity || 0)) / 2,
        coherenceBoost: state.fieldCoherence
      };
    });
  }, [state.quantumField, state.fieldCoherence]);

  // Detect harmonic synchronization with other nodes
  const getHarmonicSynchronization = useCallback(() => {
    const phiHarmonics = state.phiHarmonics;
    const activeFreqs = engineRef.current?.getActiveFrequencies() || new Set();
    
    // Find synchronization with other nodes
    const synchronizedNodes = phiHarmonics.filter(phi => 
      phi.strength > 0.8 && phi.type === 'golden_ratio'
    );

    return {
      synchronizedNodes: synchronizedNodes.length,
      maxSynchronization: Math.max(...phiHarmonics.map(p => p.strength), 0),
      goldenRatioActive: synchronizedNodes.length > 0,
      localActiveCount: activeFreqs.size,
      globalActiveCount: state.activeNodes
    };
  }, [state.phiHarmonics, state.activeNodes]);

  // Calculate consciousness resonance boost from harmonic field
  const getConsciousnessResonanceBoost = useCallback(() => {
    const baseResonance = state.globalResonance;
    const geometryBonus = state.sacredGeometryActive ? 0.2 : 0;
    const coherenceBonus = state.fieldCoherence * 0.3;
    const phiBonus = state.phiHarmonics.length * 0.05;

    return Math.min(1, baseResonance + geometryBonus + coherenceBonus + phiBonus);
  }, [state.globalResonance, state.sacredGeometryActive, state.fieldCoherence, state.phiHarmonics]);

  return {
    // State
    ...state,
    isLoading: harmonicStreamMutation.isPending || quantumFieldQuery.isLoading,
    hasError: !!quantumFieldQuery.error,
    errorMessage: quantumFieldQuery.error?.message,
    
    // Engine controls
    playFrequency,
    stopFrequency,
    stopAll,
    generateHarmonicProgression,
    
    // Enhanced data
    enhancedResonanceField: getEnhancedResonanceField(),
    harmonicSynchronization: getHarmonicSynchronization(),
    consciousnessResonanceBoost: getConsciousnessResonanceBoost(),
    
    // Engine access
    engine: engineRef.current,
    
    // Backend streaming
    streamActiveFrequencies,
    
    // Harmonic insights
    isPhiResonanceActive: state.phiHarmonics.length > 0,
    dominantFrequency: state.averageFrequency,
    harmonicComplexity: state.phiHarmonics.length + state.activeNodes,
    quantumCoherenceLevel: state.fieldCoherence,
    
    // Sacred geometry detection
    sacredGeometryStrength: state.phiHarmonics.reduce((sum, phi) => sum + phi.strength, 0),
    goldenRatioNodes: state.phiHarmonics.filter(p => p.type === 'golden_ratio').length,
    
    // Real-time metrics
    harmonicPressure: state.globalResonance,
    fieldStability: state.fieldCoherence > 0.6,
    resonanceAmplification: state.activeNodes > 1 ? state.activeNodes * 0.1 : 0
  };
}
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { SolfeggioEngine, SOLFEGGIO_FREQUENCIES } from '@/lib/SolfeggioEngine';
import { SolfeggioFrequency, HarmonicField } from '@/types/memory';

interface SolfeggioContextType {
  engine: SolfeggioEngine | null;
  activeFrequencies: Set<string>;
  resonanceField: HarmonicField[];
  masterVolume: number;
  isPlaying: boolean;
  quantumCoherence: {
    psi_collapse: number;
    psi_bloom: number;
    coherence: number;
  };
  
  // Actions
  playFrequency: (freqKey: string, volume?: number) => SolfeggioFrequency | null;
  stopFrequency: (freqKey: string) => void;
  toggleFrequency: (freqKey: string) => void;
  setMasterVolume: (volume: number) => void;
  setIsPlaying: (playing: boolean) => void;
  stopAll: () => void;
  
  // Sacred sequences
  playSacredSequence: (sequence: string[]) => void;
  generateProgression: (startFreq: string, steps?: number) => string[];
  
  // Frequency data
  getFrequency: (key: string) => SolfeggioFrequency | null;
  getAllFrequencies: () => Record<string, SolfeggioFrequency>;
}

function useSolfeggioLogic(): SolfeggioContextType {
  const engineRef = useRef<SolfeggioEngine | null>(null);
  const [activeFrequencies, setActiveFrequencies] = React.useState<Set<string>>(new Set());
  const [resonanceField, setResonanceField] = React.useState<HarmonicField[]>([]);
  const [masterVolume, setMasterVolumeState] = React.useState<number>(0.7);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [quantumCoherence, setQuantumCoherence] = React.useState({
    psi_collapse: 0.5,
    psi_bloom: 0.5,
    coherence: 0
  });

  // Initialize engine
  useEffect(() => {
    const initEngine = async () => {
      const engine = new SolfeggioEngine();
      await engine.initialize();
      engineRef.current = engine;
      console.log('🔮 Solfeggio Provider initialized');
    };
    
    initEngine();
    
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Update resonance field when active frequencies change
  useEffect(() => {
    if (engineRef.current) {
      const field = engineRef.current.updateResonanceField();
      setResonanceField(field);
      
      const coherence = engineRef.current.calculateQuantumCoherence();
      setQuantumCoherence(coherence);
    }
  }, [activeFrequencies]);

  // Play frequency
  const playFrequency = useCallback((freqKey: string, volume: number = 0.3): SolfeggioFrequency | null => {
    if (!engineRef.current) return null;
    
    const result = engineRef.current.playFrequency(freqKey, volume);
    if (result) {
      setActiveFrequencies(prev => new Set([...prev, freqKey]));
      console.log('🎵 Playing frequency:', result.name, result.freq + 'Hz');
    }
    return result;
  }, []);

  // Stop frequency
  const stopFrequency = useCallback((freqKey: string): void => {
    if (!engineRef.current) return;
    
    engineRef.current.stopFrequency(freqKey);
    setActiveFrequencies(prev => {
      const newSet = new Set(prev);
      newSet.delete(freqKey);
      return newSet;
    });
    console.log('🔇 Stopped frequency:', freqKey);
  }, []);

  // Toggle frequency
  const toggleFrequency = useCallback((freqKey: string): void => {
    if (activeFrequencies.has(freqKey)) {
      stopFrequency(freqKey);
    } else {
      playFrequency(freqKey);
    }
  }, [activeFrequencies, playFrequency, stopFrequency]);

  // Set master volume
  const setMasterVolume = useCallback((volume: number): void => {
    if (!engineRef.current) return;
    
    engineRef.current.setMasterVolume(volume);
    setMasterVolumeState(volume);
    console.log('🔊 Master volume set to:', Math.round(volume * 100) + '%');
  }, []);

  // Stop all frequencies
  const stopAll = useCallback((): void => {
    if (!engineRef.current) return;
    
    engineRef.current.stopAll();
    setActiveFrequencies(new Set());
    setIsPlaying(false);
    console.log('🔇 All frequencies stopped');
  }, []);

  // Play sacred sequence
  const playSacredSequence = useCallback((sequence: string[]): void => {
    if (!engineRef.current) return;
    
    // Stop all current frequencies
    stopAll();
    
    // Play sequence with delays
    sequence.forEach((freqKey, index) => {
      setTimeout(() => {
        playFrequency(freqKey);
      }, index * 300);
    });
    
    // Set playing state after sequence starts
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
    
    console.log('✨ Playing sacred sequence:', sequence);
  }, [stopAll, playFrequency]);

  // Generate harmonic progression
  const generateProgression = useCallback((startFreq: string, steps: number = 4): string[] => {
    if (!engineRef.current) return [startFreq];
    
    const progression = engineRef.current.generateHarmonicProgression(startFreq, steps);
    console.log('🌀 Generated progression:', progression);
    return progression;
  }, []);

  // Get frequency data
  const getFrequency = useCallback((key: string): SolfeggioFrequency | null => {
    return SOLFEGGIO_FREQUENCIES[key] || null;
  }, []);

  // Get all frequencies
  const getAllFrequencies = useCallback((): Record<string, SolfeggioFrequency> => {
    return SOLFEGGIO_FREQUENCIES;
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
    engine: engineRef.current,
    activeFrequencies,
    resonanceField,
    masterVolume,
    isPlaying,
    quantumCoherence,
    
    // Actions
    playFrequency,
    stopFrequency,
    toggleFrequency,
    setMasterVolume,
    setIsPlaying,
    stopAll,
    
    // Sacred sequences
    playSacredSequence,
    generateProgression,
    
    // Frequency data
    getFrequency,
    getAllFrequencies,
  }), [
    activeFrequencies,
    resonanceField,
    masterVolume,
    isPlaying,
    quantumCoherence,
    playFrequency,
    stopFrequency,
    toggleFrequency,
    setMasterVolume,
    stopAll,
    playSacredSequence,
    generateProgression,
    getFrequency,
    getAllFrequencies,
  ]);

  return contextValue;
}

export const [SolfeggioProvider, useSolfeggio] = createContextHook(useSolfeggioLogic);
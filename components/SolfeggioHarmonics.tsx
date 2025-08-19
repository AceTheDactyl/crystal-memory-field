import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useMemoryField } from '@/providers/MemoryFieldProvider';
import { useSolfeggio } from '@/providers/SolfeggioProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');



interface SolfeggioHarmonicsProps {
  visible: boolean;
  onClose: () => void;
}

export default function SolfeggioHarmonics({ visible, onClose }: SolfeggioHarmonicsProps) {
  // Always call hooks in the same order, regardless of visibility
  const { memories, setMemories, harmonicMode, setHarmonicMode, globalCoherence } = useMemoryField();
  const {
    activeFrequencies,
    masterVolume,
    isPlaying,
    quantumCoherence,
    toggleFrequency,
    setMasterVolume,
    setIsPlaying,
    stopAll,
    playSacredSequence,
    generateProgression,
    getAllFrequencies
  } = useSolfeggio();
  
  const [harmonicResonance, setHarmonicResonance] = useState(0);
  
  // Get all frequencies from the engine
  const solfeggioFreqs = useMemo(() => {
    const allFreqs = getAllFrequencies();
    return Object.entries(allFreqs).map(([key, freq]) => ({
      key,
      freq: freq.freq,
      name: freq.name,
      color: freq.color,
      meaning: freq.meaning
    }));
  }, [getAllFrequencies]);
  
  // Animation refs for each frequency - always initialize
  const frequencyAnims = useRef(
    solfeggioFreqs.reduce((acc, freq) => {
      acc[freq.key] = new Animated.Value(0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;
  
  const resonanceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  
  // Calculate harmonic resonance based on quantum coherence and memory alignment
  const calculatedResonance = useMemo(() => {
    if (!visible || activeFrequencies.size === 0) return 0;
    
    // Use quantum coherence from the engine
    const baseResonance = quantumCoherence.coherence;
    
    // Factor in memory alignment
    let memoryAlignment = 0;
    let alignedCount = 0;
    
    const allFreqs = getAllFrequencies();
    memories.forEach(memory => {
      activeFrequencies.forEach(freqKey => {
        const freq = allFreqs[freqKey];
        if (freq) {
          const harmonicDiff = Math.abs(memory.harmonic - freq.freq);
          const alignment = Math.max(0, 1 - harmonicDiff / 200);
          if (alignment > 0.3) {
            memoryAlignment += alignment * (memory.crystallized ? 1.5 : 1);
            alignedCount++;
          }
        }
      });
    });
    
    const avgMemoryAlignment = alignedCount > 0 ? memoryAlignment / alignedCount : 0;
    return (baseResonance * 0.7 + avgMemoryAlignment * 0.3) * globalCoherence;
  }, [visible, activeFrequencies, memories, globalCoherence, quantumCoherence, getAllFrequencies]);
  
  // Update harmonic resonance with smooth animation
  useEffect(() => {
    if (!visible) return;
    
    Animated.timing(resonanceAnim, {
      toValue: calculatedResonance,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    setHarmonicResonance(calculatedResonance);
  }, [visible, calculatedResonance, resonanceAnim]);
  
  // Pulse animation for active frequencies
  useEffect(() => {
    if (!visible) {
      pulseAnim.setValue(0);
      return;
    }
    
    if (isPlaying && activeFrequencies.size > 0) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      
      return () => {
        animation.stop();
      };
    } else {
      pulseAnim.setValue(0);
    }
  }, [visible, isPlaying, activeFrequencies.size, pulseAnim]);
  
  // Toggle frequency activation with animation
  const handleToggleFrequency = useCallback((freqKey: string) => {
    if (!visible) return;
    
    const isActive = activeFrequencies.has(freqKey);
    
    // Animate
    Animated.timing(frequencyAnims[freqKey], {
      toValue: isActive ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Toggle in engine
    toggleFrequency(freqKey);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [visible, activeFrequencies, frequencyAnims, toggleFrequency]);
  
  // Apply harmonic influence to memories
  const applyHarmonicInfluence = useCallback(() => {
    if (!visible || activeFrequencies.size === 0) return;
    
    const allFreqs = getAllFrequencies();
    
    setMemories(prevMemories => 
      prevMemories.map(memory => {
        let maxInfluence = 0;
        let influencingFreqKey = '';
        
        activeFrequencies.forEach(freqKey => {
          const freq = allFreqs[freqKey];
          if (freq) {
            const harmonicDiff = Math.abs(memory.harmonic - freq.freq);
            const influence = Math.max(0, 1 - harmonicDiff / 300);
            if (influence > maxInfluence) {
              maxInfluence = influence;
              influencingFreqKey = freqKey;
            }
          }
        });
        
        if (maxInfluence > 0.2 && influencingFreqKey) {
          const targetFreq = allFreqs[influencingFreqKey];
          if (targetFreq) {
            return {
              ...memory,
              harmonic: memory.harmonic + (targetFreq.freq - memory.harmonic) * 0.1 * maxInfluence,
              color: targetFreq.color,
              intensity: Math.min(1, memory.intensity + maxInfluence * 0.2),
            };
          }
        }
        
        return memory;
      })
    );
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible, activeFrequencies, setMemories, getAllFrequencies]);
  
  // Master play/pause
  const togglePlayback = useCallback(() => {
    if (!visible) return;
    
    setIsPlaying(!isPlaying);
    if (!isPlaying && activeFrequencies.size > 0) {
      applyHarmonicInfluence();
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [visible, isPlaying, activeFrequencies.size, applyHarmonicInfluence, setIsPlaying]);
  
  // Clear all frequencies
  const clearAll = useCallback(() => {
    if (!visible) return;
    
    activeFrequencies.forEach(freqKey => {
      Animated.timing(frequencyAnims[freqKey], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    stopAll();
  }, [visible, activeFrequencies, frequencyAnims, stopAll]);
  
  // Activate sacred sequence (3-6-9 Tesla pattern)
  const activateSacredSequence = useCallback(() => {
    if (!visible) return;
    
    const sacredSequence = ['UT', 'FA', 'SI']; // 396, 639, 963 Hz - 3-6-9 pattern
    playSacredSequence(sacredSequence);
    setHarmonicMode('collective');
    
    // Animate the sequence
    sacredSequence.forEach((freqKey, index) => {
      setTimeout(() => {
        Animated.timing(frequencyAnims[freqKey], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, index * 300);
    });
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible, playSacredSequence, setHarmonicMode, frequencyAnims]);
  
  if (!visible) return null;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      
      <View style={styles.panel}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={90} style={StyleSheet.absoluteFillObject} />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, styles.androidBlur]} />
        )}
        
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Music size={24} color="#93c5fd" />
              <Text style={styles.title}>Solfeggio Harmonics</Text>
            </View>
            
            <View style={styles.headerControls}>
              <TouchableOpacity
                style={[styles.controlButton, isPlaying && styles.controlButtonActive]}
                onPress={togglePlayback}
              >
                {isPlaying ? (
                  <Pause size={20} color={isPlaying ? '#ffffff' : '#93c5fd'} />
                ) : (
                  <Play size={20} color="#93c5fd" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setMasterVolume(masterVolume > 0 ? 0 : 0.7)}
              >
                {masterVolume > 0 ? (
                  <Volume2 size={20} color="#93c5fd" />
                ) : (
                  <VolumeX size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Resonance Meter */}
          <View style={styles.resonanceMeter}>
            <Text style={styles.resonanceLabel}>Harmonic Resonance</Text>
            <View style={styles.resonanceBar}>
              <Animated.View
                style={[
                  styles.resonanceFill,
                  {
                    width: resonanceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={['#3b82f6', '#06b6d4', '#10b981']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>
            </View>
            <Text style={styles.resonanceValue}>
              {(harmonicResonance * 100).toFixed(1)}%
            </Text>
          </View>
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={activateSacredSequence}
            >
              <Text style={styles.actionButtonText}>Sacred 3-6-9</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={clearAll}
            >
              <Text style={styles.actionButtonText}>Clear All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={applyHarmonicInfluence}
            >
              <Text style={styles.actionButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          
          {/* Frequency Grid */}
          <View style={styles.frequencyGrid}>
            {solfeggioFreqs.map((freq, index) => {
              const isActive = activeFrequencies.has(freq.key);
              
              return (
                <TouchableOpacity
                  key={freq.key}
                  style={[
                    styles.frequencyButton,
                    isActive && styles.frequencyButtonActive,
                  ]}
                  onPress={() => handleToggleFrequency(freq.key)}
                >
                  <Animated.View
                    style={[
                      styles.frequencyInner,
                      {
                        transform: [
                          {
                            scale: frequencyAnims[freq.key]?.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.1],
                            }) || 1,
                          },
                        ],
                        opacity: frequencyAnims[freq.key]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 1],
                        }) || 0.6,
                      },
                    ]}
                  >
                    {/* Pulse effect for active frequencies */}
                    {isActive && isPlaying && (
                      <Animated.View
                        style={[
                          styles.pulseRing,
                          {
                            borderColor: freq.color,
                            transform: [
                              {
                                scale: pulseAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [1, 1.5],
                                }),
                              },
                            ],
                            opacity: pulseAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 0],
                            }),
                          },
                        ]}
                      />
                    )}
                    
                    <LinearGradient
                      colors={[
                        isActive ? freq.color : 'rgba(30, 41, 59, 0.8)',
                        isActive ? `${freq.color}80` : 'rgba(15, 23, 42, 0.9)',
                      ]}
                      style={styles.frequencyGradient}
                    />
                    
                    <Text style={[styles.frequencyText, isActive && styles.frequencyTextActive]}>
                      {freq.freq}Hz
                    </Text>
                    <Text style={[styles.frequencyName, isActive && styles.frequencyNameActive]}>
                      {freq.name}
                    </Text>
                    <Text style={styles.frequencyMeaning}>
                      {freq.meaning}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {/* Status */}
          <View style={styles.status}>
            <Text style={styles.statusText}>
              Active: {activeFrequencies.size} frequencies • 
              Mode: {harmonicMode} • 
              Coherence: {(globalCoherence * 100).toFixed(0)}% • 
              Ψ-Bloom: {(quantumCoherence.psi_bloom * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  panel: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    bottom: 100,
    borderRadius: 24,
    overflow: 'hidden',
  },
  androidBlur: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#93c5fd',
  },
  headerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
  },
  resonanceMeter: {
    marginBottom: 20,
  },
  resonanceLabel: {
    color: '#60a5fa',
    fontSize: 12,
    marginBottom: 8,
  },
  resonanceBar: {
    height: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  resonanceFill: {
    height: '100%',
    borderRadius: 4,
  },
  resonanceValue: {
    color: '#60a5fa',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  actionButtonText: {
    color: '#93c5fd',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  frequencyGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  frequencyButton: {
    width: (SCREEN_WIDTH - 80) / 3 - 8,
    aspectRatio: 0.8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  frequencyButtonActive: {
    elevation: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  frequencyInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    borderWidth: 2,
  },
  frequencyGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  frequencyText: {
    color: '#93c5fd',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  frequencyTextActive: {
    color: '#ffffff',
  },
  frequencyName: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  frequencyNameActive: {
    color: '#ffffff',
  },
  frequencyMeaning: {
    color: '#64748b',
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
  },
  status: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(96, 165, 250, 0.1)',
  },
  statusText: {
    color: '#64748b',
    fontSize: 11,
    textAlign: 'center',
  },
});
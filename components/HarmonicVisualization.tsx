import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemoryField } from '@/providers/MemoryFieldProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Solfeggio frequencies for reference
const SOLFEGGIO_FREQUENCIES = [174, 285, 396, 417, 528, 639, 741, 852, 963];

export default function HarmonicVisualization() {
  const { memories, globalCoherence, harmonicMode } = useMemoryField();
  
  const waveAnim = useRef(new Animated.Value(0)).current;
  const resonanceAnim = useRef(new Animated.Value(0)).current;
  const wavePhase = useRef(0);
  
  // Start wave animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );
    animation.start();
    
    // Update wave phase for path generation
    const interval = setInterval(() => {
      wavePhase.current += 0.1;
    }, 50);
    
    return () => {
      animation.stop();
      clearInterval(interval);
    };
  }, [waveAnim]);
  
  // Animate resonance based on global coherence
  useEffect(() => {
    Animated.timing(resonanceAnim, {
      toValue: globalCoherence,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [globalCoherence, resonanceAnim]);
  
  // Calculate frequency distribution
  const frequencyDistribution = useMemo(() => {
    const distribution: Record<number, number> = {};
    
    memories.forEach(memory => {
      const freq = Math.round(memory.harmonic / 50) * 50; // Group by 50Hz intervals
      distribution[freq] = (distribution[freq] || 0) + (memory.crystallized ? 2 : 1);
    });
    
    return distribution;
  }, [memories]);
  
  // Calculate Solfeggio alignment
  const solfeggioAlignment = useMemo(() => {
    return SOLFEGGIO_FREQUENCIES.map(freq => {
      const alignedMemories = memories.filter(memory => {
        const diff = Math.abs(memory.harmonic - freq);
        return diff < 50; // Within 50Hz tolerance
      });
      
      const strength = alignedMemories.reduce((sum, mem) => {
        const proximity = 1 - Math.min(1, Math.abs(mem.harmonic - freq) / 50);
        return sum + proximity * (mem.crystallized ? 1.5 : 1);
      }, 0);
      
      return {
        frequency: freq,
        strength: Math.min(1, strength / 3), // Normalize
        crystallized: alignedMemories.filter(m => m.crystallized).length,
        total: alignedMemories.length,
      };
    });
  }, [memories]);
  

  
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Background harmonic field */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: resonanceAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={[
            'transparent',
            harmonicMode === 'collective' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            'transparent',
          ]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      {/* Solfeggio frequency rings - Web-safe implementation */}
      {Platform.OS !== 'web' ? (
        <View style={StyleSheet.absoluteFillObject}>
          {solfeggioAlignment.map((freq, index) => {
            if (freq.strength < 0.1) return null;
            
            const centerX = SCREEN_WIDTH / 2;
            const centerY = SCREEN_HEIGHT / 2;
            const baseRadius = 50 + index * 25;
            const finalRadius = baseRadius * (1 + freq.strength * 0.5);
            
            return (
              <Animated.View
                key={freq.frequency}
                style={[
                  styles.frequencyRing,
                  {
                    left: centerX - finalRadius,
                    top: centerY - finalRadius,
                    width: finalRadius * 2,
                    height: finalRadius * 2,
                    borderRadius: finalRadius,
                    borderWidth: Math.max(1, freq.strength * 4),
                    borderColor: `hsl(${200 + (freq.frequency % 160)}, 70%, 60%)`,
                    opacity: freq.strength * 0.6,
                    borderStyle: freq.crystallized > 0 ? 'solid' : 'dashed',
                  },
                ]}
              />
            );
          })}
        </View>
      ) : (
        <View style={StyleSheet.absoluteFillObject}>
          {solfeggioAlignment.map((freq, index) => {
            if (freq.strength < 0.1) return null;
            
            const centerX = SCREEN_WIDTH / 2;
            const centerY = SCREEN_HEIGHT / 2;
            const baseRadius = 50 + index * 25;
            const finalRadius = baseRadius * (1 + freq.strength * 0.5);
            
            return (
              <View
                key={freq.frequency}
                style={[
                  styles.frequencyRing,
                  {
                    left: centerX - finalRadius,
                    top: centerY - finalRadius,
                    width: finalRadius * 2,
                    height: finalRadius * 2,
                    borderRadius: finalRadius,
                    borderWidth: Math.max(1, freq.strength * 4),
                    borderColor: `hsl(${200 + (freq.frequency % 160)}, 70%, 60%)`,
                    opacity: freq.strength * 0.6,
                  },
                ]}
              />
            );
          })}
        </View>
      )}
      
      {/* Harmonic wave visualization - Simplified for web compatibility */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: waveAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.6, 0.3],
            }),
          },
        ]}
      >
        {solfeggioAlignment
          .filter(freq => freq.strength > 0.2)
          .map((freq, index) => {
            const phase = wavePhase.current + index * 0.5;
            const waveHeight = freq.strength * 30;
            
            return (
              <View
                key={freq.frequency}
                style={[
                  styles.waveBar,
                  {
                    left: SCREEN_WIDTH * 0.1 + (index * (SCREEN_WIDTH * 0.8) / 9),
                    top: SCREEN_HEIGHT * 0.7 - waveHeight / 2,
                    width: 4,
                    height: waveHeight,
                    backgroundColor: `hsl(${200 + (freq.frequency % 160)}, 70%, 60%)`,
                    opacity: freq.strength * 0.4,
                    transform: [
                      {
                        scaleY: 1 + Math.sin(phase) * 0.5,
                      },
                    ],
                  },
                ]}
              />
            );
          })}
      </Animated.View>
      
      {/* Frequency spectrum bars */}
      <View style={styles.spectrumContainer}>
        {Object.entries(frequencyDistribution)
          .sort(([a], [b]) => Number(a) - Number(b))
          .slice(0, 12) // Show top 12 frequencies
          .map(([freq, count], index) => {
            const frequency = Number(freq);
            const isSolfeggio = SOLFEGGIO_FREQUENCIES.some(sf => Math.abs(sf - frequency) < 25);
            const height = Math.min(60, count * 8);
            
            return (
              <Animated.View
                key={freq}
                style={[
                  styles.spectrumBar,
                  {
                    height: resonanceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height * 0.3, height],
                    }),
                    backgroundColor: isSolfeggio 
                      ? `hsl(${200 + (frequency % 160)}, 80%, 60%)`
                      : `hsl(${200 + (frequency % 160)}, 50%, 40%)`,
                    opacity: resonanceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 0.8],
                    }),
                  },
                ]}
              />
            );
          })}
      </View>
      
      {/* Coherence pulse */}
      <Animated.View
        style={[
          styles.coherencePulse,
          {
            transform: [
              {
                scale: resonanceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.2],
                }),
              },
            ],
            opacity: resonanceAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.6, 0.2],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={[
            harmonicMode === 'collective' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)',
            'transparent',
          ]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  spectrumContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
  },
  spectrumBar: {
    width: (SCREEN_WIDTH - 60) / 12,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  coherencePulse: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginTop: -100,
    marginLeft: -100,
    borderRadius: 100,
  },
  frequencyRing: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  waveBar: {
    position: 'absolute',
    borderRadius: 2,
  },
});
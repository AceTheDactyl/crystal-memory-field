import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemoryField } from '@/providers/MemoryFieldProvider';
import { useSolfeggio } from '@/providers/SolfeggioProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



export default function HarmonicVisualization() {
  const { memories, globalCoherence, harmonicMode } = useMemoryField();
  const { activeFrequencies, resonanceField, quantumCoherence, getAllFrequencies } = useSolfeggio();
  
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
  
  // Calculate Solfeggio alignment using the engine data
  const solfeggioAlignment = useMemo(() => {
    const allFreqs = getAllFrequencies();
    
    return Object.entries(allFreqs).map(([key, freq]) => {
      const isActive = activeFrequencies.has(key);
      
      const alignedMemories = memories.filter(memory => {
        const diff = Math.abs(memory.harmonic - freq.freq);
        return diff < 50; // Within 50Hz tolerance
      });
      
      const strength = alignedMemories.reduce((sum, mem) => {
        const proximity = 1 - Math.min(1, Math.abs(mem.harmonic - freq.freq) / 50);
        return sum + proximity * (mem.crystallized ? 1.5 : 1);
      }, 0);
      
      // Boost strength for active frequencies
      const finalStrength = isActive ? Math.min(1, strength / 2 + 0.3) : Math.min(1, strength / 3);
      
      return {
        key,
        frequency: freq.freq,
        name: freq.name,
        color: freq.color,
        strength: finalStrength,
        crystallized: alignedMemories.filter(m => m.crystallized).length,
        total: alignedMemories.length,
        isActive,
        quantumState: freq.quantum
      };
    }).filter(alignment => alignment.strength > 0.05); // Only show significant alignments
  }, [memories, activeFrequencies, getAllFrequencies]);
  

  
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
      
      {/* Enhanced Solfeggio frequency rings with quantum states */}
      {Platform.OS !== 'web' ? (
        <View style={StyleSheet.absoluteFillObject}>
          {solfeggioAlignment.map((freq, index) => {
            const centerX = SCREEN_WIDTH / 2;
            const centerY = SCREEN_HEIGHT / 2;
            const baseRadius = 40 + index * 20;
            const finalRadius = baseRadius * (1 + freq.strength * 0.8);
            
            // Quantum state influences appearance
            const bloomIntensity = freq.quantumState.psi_bloom;
            // const collapseIntensity = freq.quantumState.psi_collapse; // Reserved for future use
            
            return (
              <Animated.View
                key={freq.key}
                style={[
                  styles.frequencyRing,
                  {
                    left: centerX - finalRadius,
                    top: centerY - finalRadius,
                    width: finalRadius * 2,
                    height: finalRadius * 2,
                    borderRadius: finalRadius,
                    borderWidth: Math.max(1, freq.strength * 5 * (freq.isActive ? 1.5 : 1)),
                    borderColor: freq.isActive ? freq.color : `${freq.color}80`,
                    opacity: freq.strength * (0.4 + bloomIntensity * 0.4),
                    borderStyle: freq.crystallized > 0 ? 'solid' : 'dashed',
                    shadowColor: freq.isActive ? freq.color : 'transparent',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: freq.isActive ? bloomIntensity * 0.8 : 0,
                    shadowRadius: freq.isActive ? 10 : 0,
                    elevation: freq.isActive ? 5 : 0,
                  },
                ]}
              />
            );
          })}
        </View>
      ) : (
        <View style={StyleSheet.absoluteFillObject}>
          {solfeggioAlignment.map((freq, index) => {
            const centerX = SCREEN_WIDTH / 2;
            const centerY = SCREEN_HEIGHT / 2;
            const baseRadius = 40 + index * 20;
            const finalRadius = baseRadius * (1 + freq.strength * 0.8);
            
            const bloomIntensity = freq.quantumState.psi_bloom;
            
            return (
              <View
                key={freq.key}
                style={[
                  styles.frequencyRing,
                  {
                    left: centerX - finalRadius,
                    top: centerY - finalRadius,
                    width: finalRadius * 2,
                    height: finalRadius * 2,
                    borderRadius: finalRadius,
                    borderWidth: Math.max(1, freq.strength * 5 * (freq.isActive ? 1.5 : 1)),
                    borderColor: freq.isActive ? freq.color : `${freq.color}80`,
                    opacity: freq.strength * (0.4 + bloomIntensity * 0.4),
                  },
                ]}
              />
            );
          })}
        </View>
      )}
      
      {/* Enhanced harmonic wave visualization with quantum field data */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: waveAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.7, 0.3],
            }),
          },
        ]}
      >
        {/* Resonance field visualization */}
        {resonanceField.slice(0, 20).map((point, index) => {
          const x = SCREEN_WIDTH / 2 + point.x * 2;
          const y = SCREEN_HEIGHT / 2 + point.y * 2;
          
          if (x < 0 || x > SCREEN_WIDTH || y < 0 || y > SCREEN_HEIGHT) return null;
          
          const bloomIntensity = point.quantumState.psi_bloom;
          const size = 2 + Math.abs(point.intensity) * 8;
          
          return (
            <View
              key={index}
              style={[
                styles.resonancePoint,
                {
                  left: x - size / 2,
                  top: y - size / 2,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: `hsl(${200 + (point.frequency % 160)}, 70%, ${50 + bloomIntensity * 30}%)`,
                  opacity: Math.abs(point.intensity) * 0.6 + bloomIntensity * 0.4,
                },
              ]}
            />
          );
        })}
        
        {/* Active frequency wave bars */}
        {solfeggioAlignment
          .filter(freq => freq.isActive && freq.strength > 0.1)
          .map((freq, index) => {
            const phase = wavePhase.current + index * 0.8;
            const waveHeight = freq.strength * 40 * (1 + freq.quantumState.psi_bloom);
            
            return (
              <View
                key={freq.key}
                style={[
                  styles.waveBar,
                  {
                    left: SCREEN_WIDTH * 0.1 + (index * (SCREEN_WIDTH * 0.8) / Math.max(1, solfeggioAlignment.filter(f => f.isActive).length)),
                    top: SCREEN_HEIGHT * 0.75 - waveHeight / 2,
                    width: 6,
                    height: waveHeight,
                    backgroundColor: freq.color,
                    opacity: freq.strength * 0.6,
                    transform: [
                      {
                        scaleY: 1 + Math.sin(phase) * freq.quantumState.psi_bloom * 0.8,
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
            const allFreqs = getAllFrequencies();
            const isSolfeggio = Object.values(allFreqs).some(sf => Math.abs(sf.freq - frequency) < 25);
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
      
      {/* Enhanced quantum coherence pulse */}
      <Animated.View
        style={[
          styles.coherencePulse,
          {
            transform: [
              {
                scale: resonanceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1.5],
                }),
              },
            ],
            opacity: resonanceAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.8, 0.1],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={[
            harmonicMode === 'collective' 
              ? `rgba(16, 185, 129, ${quantumCoherence.psi_bloom * 0.5})` 
              : `rgba(59, 130, 246, ${quantumCoherence.psi_bloom * 0.5})`,
            `rgba(147, 197, 253, ${quantumCoherence.coherence * 0.3})`,
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
    width: 250,
    height: 250,
    marginTop: -125,
    marginLeft: -125,
    borderRadius: 125,
  },
  frequencyRing: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  waveBar: {
    position: 'absolute',
    borderRadius: 3,
  },
  resonancePoint: {
    position: 'absolute',
  },
});
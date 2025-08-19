import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';
import {
  Eye,
  EyeOff,
  Waves,
  Sparkles,
  Circle,
  Zap,
  Heart,
  Pause,
  Play,
  X,
  Info,
  Moon,
  Settings,
  Music,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useMemoryField } from '@/providers/MemoryFieldProvider';
import { useSolfeggio } from '@/providers/SolfeggioProvider';
import MemoryParticle from '@/components/MemoryParticle';
import WaveField from '@/components/WaveField';
import VoidMode from '@/components/VoidMode';
import ControlPanel from '@/components/ControlPanel';
import SolfeggioHarmonics from '@/components/SolfeggioHarmonics';
import HarmonicVisualization from '@/components/HarmonicVisualization';
import { HarmonicConnectionStatus } from '@/components/HarmonicConnectionStatus';
import { useHarmonicWebSocket } from '@/hooks/useHarmonicWebSocket';
import { Memory } from '@/types/memory';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CrystalMemoryField() {
  const {
    memories,
    isObserving,
    setIsObserving,
    harmonicMode,
    setHarmonicMode,
    globalCoherence,
    isPaused,
    setIsPaused,
    voidMode,
    setVoidMode,
    handleObservation,
    releaseAll,
    createPulse,
    addMemory,
  } = useMemoryField();

  const { activeFrequencies, quantumCoherence, playSacredSequence, toggleFrequency } = useSolfeggio();
  
  // Harmonic WebSocket connection
  const {
    isConnected: harmonicConnected,
    globalResonance
  } = useHarmonicWebSocket();

  const [uiVisible, setUiVisible] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSolfeggio, setShowSolfeggio] = useState(false);
  const [bloomingState, setBloomingState] = useState(false);
  const [breathingMode, setBreathingMode] = useState(false);
  const rotationAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const spiralAnim = useRef(new Animated.Value(0)).current;
  const bloomAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;

  // Pan responder for rotation gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return evt.nativeEvent.touches.length === 2;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return evt.nativeEvent.touches.length === 2;
      },
      onPanResponderMove: (evt, gestureState) => {
        rotationAnim.setValue({
          x: gestureState.dy * 0.5,
          y: gestureState.dx * 0.5,
        });
      },
      onPanResponderRelease: () => {
        Animated.spring(rotationAnim, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }).start();
      },
    })
  ).current;

  // Handle empty space touches to create pulses
  const handleBackgroundPress = useCallback((event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    const x = (pageX / SCREEN_WIDTH) * 100;
    const y = (pageY / SCREEN_HEIGHT) * 100;
    
    // Check if we clicked on a memory
    const clickedMemory = memories.find((mem: Memory) => {
      const memX = (mem.x / 100) * SCREEN_WIDTH;
      const memY = (mem.y / 100) * SCREEN_HEIGHT;
      const dist = Math.hypot(memX - pageX, memY - pageY);
      return dist < 30;
    });
    
    if (!clickedMemory) {
      createPulse(x, y);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [createPulse, memories]);

  // UI fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: uiVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [uiVisible, fadeAnim]);

  // Spiral animation - the eternal return
  useEffect(() => {
    const spiralAnimation = Animated.loop(
      Animated.timing(spiralAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    spiralAnimation.start();
    
    return () => {
      spiralAnimation.stop();
    };
  }, [spiralAnim]);

  // Breathing animation - the rhythm of consciousness
  useEffect(() => {
    if (breathingMode) {
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 1.3,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(breathAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      );
      breathingAnimation.start();
      
      return () => {
        breathingAnimation.stop();
      };
    } else {
      breathAnim.setValue(1);
    }
  }, [breathingMode, breathAnim]);

  // Blooming sequence - consciousness expansion
  const activateBloomSequence = useCallback(() => {
    setBloomingState(true);
    setHarmonicMode('collective');
    
    // Sacred 3-6-9 Tesla sequence for blooming consciousness
    const bloomSequence = ['UT', 'FA', 'SI']; // 396, 639, 963 Hz - Liberation, Connection, Unity
    playSacredSequence(bloomSequence);
    
    // Bloom animation
    Animated.sequence([
      Animated.timing(bloomAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(bloomAnim, {
        toValue: 0.7,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Create blooming memories in sacred geometry pattern
    setTimeout(() => {
      // Center bloom - Love frequency (528 Hz)
      addMemory({
        x: 50,
        y: 50,
        intensity: 0.9,
        harmonic: 528,
        color: '#FFD700',
        crystallized: false,
      });
      
      // Golden ratio spiral positions
      const phi = (1 + Math.sqrt(5)) / 2;
      for (let i = 0; i < 5; i++) {
        const angle = i * 2 * Math.PI / phi;
        const radius = 20 + i * 8;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        
        setTimeout(() => {
          addMemory({
            x: Math.max(10, Math.min(90, x)),
            y: Math.max(10, Math.min(90, y)),
            intensity: 0.7 - i * 0.1,
            harmonic: 432 + i * 50, // Earth resonance variations
            color: i % 2 === 0 ? '#00CED1' : '#9400D3',
            crystallized: false,
          });
        }, i * 500);
      }
    }, 1000);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    console.log('🌸 Consciousness blooming sequence activated - Welcome back');
  }, [setBloomingState, setHarmonicMode, playSacredSequence, bloomAnim, addMemory]);

  // Activate breathing mode
  const activateBreathingMode = useCallback(() => {
    setBreathingMode(!breathingMode);
    if (!breathingMode) {
      // Activate Schumann resonance for grounding
      toggleFrequency('SCHUMANN');
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [breathingMode, setBreathingMode, toggleFrequency]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Background gradient - responsive to consciousness state */}
      <LinearGradient
        colors={
          voidMode
            ? ['#1a0033', '#2d1b69', '#1a0033']
            : bloomingState
            ? ['#0f0f23', '#2d1b69', '#1a0f33', '#0f172a']
            : activeFrequencies.size > 0
            ? ['#0f172a', '#1e293b', '#0f1f2a']
            : ['#0f172a', '#1e293b', '#0f172a']
        }
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Sacred geometry overlay for blooming state */}
      {bloomingState && (
        <Animated.View
          style={[
            styles.sacredGeometry,
            {
              transform: [
                {
                  scale: bloomAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.5],
                  }),
                },
                {
                  rotate: spiralAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: bloomAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.6, 0.3],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.3)', 'rgba(255, 105, 180, 0.2)', 'rgba(138, 43, 226, 0.1)']}
            style={styles.geometryGradient}
          />
        </Animated.View>
      )}

      {/* Resonance field overlay */}
      {activeFrequencies.size > 0 && (
        <Animated.View
          style={[
            styles.resonanceOverlay,
            {
              opacity: quantumCoherence.psi_bloom * 0.4,
            },
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(255, 215, 0, 0.1)',
              'rgba(16, 185, 129, 0.1)',
              'rgba(139, 92, 246, 0.1)',
            ]}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      )}

      {/* Wave field background */}
      <WaveField />
      
      {/* Harmonic visualization */}
      {harmonicMode === 'collective' && <HarmonicVisualization />}

      {/* Main interaction area */}
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={StyleSheet.absoluteFillObject}>
          {/* Memory particles - enhanced with breathing and blooming */}
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [
                  { perspective: 1000 },
                  {
                    scale: breathingMode ? breathAnim : 1,
                  },
                  {
                    rotateX: rotationAnim.x.interpolate({
                      inputRange: [-180, 180],
                      outputRange: ['-180deg', '180deg'],
                    }),
                  },
                  {
                    rotateY: rotationAnim.y.interpolate({
                      inputRange: [-180, 180],
                      outputRange: ['-180deg', '180deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            {memories.map((memory: Memory) => (
              <MemoryParticle
                key={memory.id}
                memory={memory}
                onPress={() => handleObservation(memory.id)}
                isObserving={isObserving}
              />
            ))}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      {/* Void mode overlay */}
      {voidMode && <VoidMode />}

      {/* UI Controls */}
      {!voidMode && (
        <>
          {/* Top bar */}
          <Animated.View
            style={[
              styles.topBar,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setUiVisible(!uiVisible)}
            >
              {uiVisible ? (
                <EyeOff size={20} color="#60a5fa" />
              ) : (
                <Eye size={20} color="#60a5fa" />
              )}
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Sparkles size={16} color={bloomingState ? '#FFD700' : '#93c5fd'} />
              <Text style={[styles.title, bloomingState && styles.titleBlooming]}>Crystal Memory Field</Text>
              {activeFrequencies.size > 0 && (
                <Text style={styles.frequencyIndicator}>
                  ♪ {activeFrequencies.size} • Ψ{(quantumCoherence.psi_bloom * 100).toFixed(0)}%
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowControls(true)}
            >
              <Settings size={20} color="#60a5fa" />
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom controls */}
          <Animated.View
            style={[
              styles.bottomControls,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.controlButton,
                isObserving && styles.controlButtonActive,
              ]}
              onPress={() => {
                setIsObserving(!isObserving);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
              }}
            >
              {isObserving ? (
                <Eye size={24} color="#ffffff" />
              ) : (
                <EyeOff size={24} color="#93c5fd" />
              )}
              <Text style={[styles.controlText, isObserving && styles.controlTextActive]}>
                {isObserving ? 'Observing' : 'Flowing'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                releaseAll();
                if (Platform.OS !== 'web') {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
              }}
            >
              <Waves size={24} color="#c084fc" />
              <Text style={styles.controlText}>Release</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                breathingMode && styles.controlButtonActive,
              ]}
              onPress={activateBreathingMode}
            >
              <Heart size={24} color={breathingMode ? '#ffffff' : '#f472b6'} />
              <Text style={[styles.controlText, breathingMode && styles.controlTextActive]}>
                Breathe
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                bloomingState && styles.controlButtonActive,
              ]}
              onPress={activateBloomSequence}
            >
              <Sparkles size={24} color={bloomingState ? '#ffffff' : '#FFD700'} />
              <Text style={[styles.controlText, bloomingState && styles.controlTextActive]}>
                Bloom
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                setShowSolfeggio(true);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
              }}
            >
              <Music size={24} color="#f59e0b" />
              <Text style={styles.controlText}>Solfeggio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                setVoidMode(true);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                }
              }}
            >
              <Moon size={24} color="#a78bfa" />
              <Text style={styles.controlText}>Void</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                isPaused && styles.controlButtonActive,
              ]}
              onPress={() => setIsPaused(!isPaused)}
            >
              {isPaused ? (
                <Play size={24} color="#ffffff" />
              ) : (
                <Pause size={24} color="#93c5fd" />
              )}
              <Text style={[styles.controlText, isPaused && styles.controlTextActive]}>
                {isPaused ? 'Play' : 'Pause'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Harmonic Connection Status */}
          <Animated.View
            style={[
              styles.connectionStatus,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <HarmonicConnectionStatus />
          </Animated.View>

          {/* Coherence meter */}
          <Animated.View
            style={[
              styles.coherenceMeter,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.coherenceLabel}>
              {bloomingState ? 'Consciousness Blooming' : harmonicConnected ? 'Harmonic Coherence' : 'Local Coherence'}
            </Text>
            <View style={styles.coherenceBar}>
              <LinearGradient
                colors={
                  bloomingState
                    ? ['#FFD700', '#FF69B4', '#9400D3']
                    : harmonicConnected
                    ? ['#00ff88', '#06b6d4', '#10b981']
                    : activeFrequencies.size > 0
                    ? ['#3b82f6', '#06b6d4', '#10b981']
                    : ['#3b82f6', '#06b6d4']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.coherenceFill,
                  { 
                    width: `${bloomingState 
                      ? Math.max(globalCoherence, quantumCoherence.psi_bloom) * 100
                      : harmonicConnected
                      ? Math.max(globalCoherence, globalResonance) * 100
                      : globalCoherence * 100}%` 
                  },
                ]}
              />
            </View>
            <Text style={styles.coherenceValue}>
              {bloomingState 
                ? `${(Math.max(globalCoherence, quantumCoherence.psi_bloom) * 100).toFixed(1)}%`
                : harmonicConnected
                ? `${(Math.max(globalCoherence, globalResonance) * 100).toFixed(1)}%`
                : `${(globalCoherence * 100).toFixed(1)}%`}
            </Text>
          </Animated.View>
        </>
      )}

      {/* Control Panel Modal */}
      <ControlPanel
        visible={showControls}
        onClose={() => setShowControls(false)}
      />

      {/* Solfeggio Harmonics Modal */}
      <SolfeggioHarmonics
        visible={showSolfeggio}
        onClose={() => setShowSolfeggio(false)}
      />

      {/* Info button */}
      {!voidMode && (
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setShowInfo(!showInfo)}
        >
          <Info size={20} color="#60a5fa" />
        </TouchableOpacity>
      )}

      {/* Info panel */}
      {showInfo && !voidMode && (
        <View style={styles.infoPanel}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowInfo(false)}
          >
            <X size={16} color="#60a5fa" />
          </TouchableOpacity>
          <Text style={styles.infoTitle}>How to Interact</Text>
          <View style={styles.infoItem}>
            <Circle size={12} color="#60a5fa" />
            <Text style={styles.infoText}>Tap empty space to create pulses</Text>
          </View>
          <View style={styles.infoItem}>
            <Eye size={12} color="#06b6d4" />
            <Text style={styles.infoText}>Tap memories while observing to crystallize</Text>
          </View>
          <View style={styles.infoItem}>
            <Zap size={12} color="#fbbf24" />
            <Text style={styles.infoText}>Two-finger drag to rotate view</Text>
          </View>
          <View style={styles.infoItem}>
            <Heart size={12} color="#f472b6" />
            <Text style={styles.infoText}>Coherence builds over time</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 100,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#93c5fd',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 100,
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    minWidth: 70,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
  },
  controlText: {
    color: '#93c5fd',
    fontSize: 11,
    marginTop: 4,
  },
  controlTextActive: {
    color: '#ffffff',
  },
  connectionStatus: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 95,
  },
  coherenceMeter: {
    position: 'absolute',
    top: 180,
    left: 20,
    right: 20,
    zIndex: 90,
  },
  coherenceLabel: {
    color: '#60a5fa',
    fontSize: 12,
    marginBottom: 4,
  },
  coherenceBar: {
    height: 6,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  coherenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  coherenceValue: {
    color: '#60a5fa',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'right',
  },
  infoButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 70,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    zIndex: 100,
  },
  infoPanel: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    zIndex: 110,
    minWidth: 250,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  infoTitle: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    color: '#93c5fd',
    fontSize: 12,
    flex: 1,
  },
  titleBlooming: {
    color: '#FFD700',
  },
  frequencyIndicator: {
    color: '#FFD700',
    fontSize: 10,
    marginLeft: 8,
  },
  sacredGeometry: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
    borderRadius: 1000,
  },
  geometryGradient: {
    flex: 1,
    borderRadius: 1000,
  },
  resonanceOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
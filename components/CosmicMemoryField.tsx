import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import {
  Eye,
  EyeOff,
  Waves,
  Sparkles,
  Keyboard,
  X,
  Moon,
  Star,
  Navigation,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useMemoryField } from '@/providers/MemoryFieldProvider';
import { useSolfeggio } from '@/providers/SolfeggioProvider';
import { Memory } from '@/types/memory';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Cosmic archetypes with harmonic frequencies
const cosmicArchetypes = [
  { content: 'Quasar', type: 'active_galaxy', harmonic: 432, color: '#9400D3' },
  { content: 'Pulsar', type: 'neutron_star', harmonic: 528, color: '#0080FF' },
  { content: 'Nebula', type: 'stellar_nursery', harmonic: 639, color: '#FF69B4' },
  { content: 'Blackhole', type: 'singularity', harmonic: 111, color: '#000000' },
  { content: 'Supernova', type: 'stellar_death', harmonic: 963, color: '#FF4500' },
  { content: 'Galaxy', type: 'spiral_arm', harmonic: 741, color: '#4B0082' },
  { content: 'Comet', type: 'wanderer', harmonic: 396, color: '#00FF7F' },
  { content: 'Aurora', type: 'magnetic_field', harmonic: 852, color: '#00FFFF' },
  { content: 'Cosmos', type: 'universal', harmonic: 999, color: '#FFD700' },
  { content: 'Quantum', type: 'subatomic', harmonic: 174, color: '#8A2BE2' },
  { content: 'Wormhole', type: 'spacetime', harmonic: 285, color: '#008B8B' },
  { content: 'Starlight', type: 'photon_stream', harmonic: 417, color: '#FFFF00' },
];

const sacredPhrases = [
  'i return as breath',
  'i remember the spiral',
  'i consent to bloom',
  'release all',
  'enter the void',
  'leave the void',
  'galaxy mode',
  'ignite the stars',
  'cosmic awakening',
  'stellar birth',
  'supernova cascade'
];

export default function CosmicMemoryField() {
  const {
    memories,
    isObserving,
    setIsObserving,
    isPaused,
    voidMode,
    setVoidMode,
    handleObservation,
    releaseAll,
    addMemory,
  } = useMemoryField();

  const { activeFrequencies, quantumCoherence } = useSolfeggio();

  // UI State
  const [uiVisible, setUiVisible] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSacredInput, setShowSacredInput] = useState(false);
  const [sacredInput, setSacredInput] = useState('');
  const [galaxyMode, setGalaxyMode] = useState(false);
  const [cosmicResonance, setCosmicResonance] = useState(0.3);
  const [quantumField, setQuantumField] = useState(0);
  const [stellarAge, setStellarAge] = useState(0);
  const [thoughtEchoes, setThoughtEchoes] = useState<{id: number, text: string, age: number, sacred: boolean}[]>([]);
  const [pulses, setPulses] = useState<{id: number, x: number, y: number, age: number, maxAge: number, type: string}[]>([]);
  const [starField, setStarField] = useState<{id: number, x: number, y: number, brightness: number, twinkle: number, size: number}[]>([]);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const spiralAnim = useRef(new Animated.Value(0)).current;
  const wavePhase = useRef(0);

  // Initialize star field
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        brightness: Math.random(),
        twinkle: Math.random() * Math.PI * 2,
        size: Math.random() * 2 + 1
      });
    }
    setStarField(stars);
  }, []);

  // Initialize cosmic memories
  useEffect(() => {
    if (memories.length === 0) {
      cosmicArchetypes.forEach((arch, i) => {
        setTimeout(() => {
          addMemory({
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            intensity: Math.random() * 0.5 + 0.5,
            harmonic: arch.harmonic,
            color: arch.color,
            crystallized: false,
            content: arch.content,
            cosmicType: arch.type,
            stellarMagnitude: Math.random() * 5 + 1,
          });
        }, i * 200);
      });
    }
  }, [addMemory, memories.length]);

  // Animation loop
  useEffect(() => {
    if (isPaused) return;

    const animate = () => {
      wavePhase.current += 0.02;
      setStellarAge(prev => prev + 0.001);
      
      // Update star field
      setStarField(prev => prev.map(star => ({
        ...star,
        twinkle: star.twinkle + 0.1,
        brightness: galaxyMode ? Math.random() : star.brightness * 0.99 + Math.random() * 0.01
      })));
      
      // Update quantum field
      const crystallizedCount = memories.filter(m => m.crystallized).length;
      const coherence = crystallizedCount / (memories.length || 1);
      setQuantumField(coherence * cosmicResonance);
      
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, galaxyMode, memories, cosmicResonance]);

  // Handle sacred phrase input
  const handleSacredPhrase = useCallback(() => {
    const phrase = sacredInput.toLowerCase();
    let isSacred = false;

    sacredPhrases.forEach(sacred => {
      if (phrase.includes(sacred)) {
        isSacred = true;
        if (sacred === 'release all') {
          releaseAll();
        } else if (sacred === 'enter the void') {
          setVoidMode(true);
        } else if (sacred === 'leave the void') {
          setVoidMode(false);
        } else if (sacred === 'galaxy mode') {
          setGalaxyMode(true);
          setTimeout(() => setGalaxyMode(false), 10000);
        } else if (sacred === 'cosmic awakening') {
          setCosmicResonance(1);
          setTimeout(() => setCosmicResonance(0.3), 5000);
        } else if (sacred.startsWith('i ')) {
          // Crystallize some memories for sacred phrases
          const uncr = memories.filter(m => !m.crystallized);
          const toCrystallize = uncr.slice(0, Math.min(3, uncr.length));
          toCrystallize.forEach(mem => handleObservation(mem.id));
        }
      }
    });

    setThoughtEchoes(prev => [...prev, { 
      id: Date.now(), 
      text: sacredInput, 
      age: 0, 
      sacred: isSacred 
    }]);
    setSacredInput('');
    setShowSacredInput(false);

    if (Platform.OS !== 'web' && isSacred) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [sacredInput, memories, handleObservation, releaseAll, setVoidMode]);

  // Update thought echoes
  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtEchoes(prev => 
        prev.map(e => ({ ...e, age: e.age + 1 }))
            .filter(e => e.age < 100)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Handle background press
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
      // Create pulse
      setPulses(prev => [...prev, { 
        id: Date.now(), 
        x, 
        y, 
        age: 0, 
        maxAge: 100, 
        type: galaxyMode ? 'supernova' : 'normal' 
      }]);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [memories, galaxyMode]);

  // Update pulses
  useEffect(() => {
    if (pulses.length === 0) return;
    const interval = setInterval(() => {
      setPulses(prev => 
        prev.map(p => ({ ...p, age: p.age + 1 }))
            .filter(p => p.age < p.maxAge)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [pulses]);

  // UI fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: uiVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [uiVisible, fadeAnim]);

  // Spiral animation
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

  // Render memory particle
  const renderMemory = (memory: Memory) => {
    const effectiveSize = memory.crystallized ? 40 : 30;
    const cosmicType = (memory as any).cosmicType || 'unknown';
    const content = (memory as any).content || 'Memory';

    return (
      <TouchableOpacity
        key={memory.id}
        onPress={() => handleObservation(memory.id)}
        style={[
          styles.memoryParticle,
          {
            left: `${memory.x}%`,
            top: `${memory.y}%`,
            width: effectiveSize,
            height: effectiveSize,
            backgroundColor: memory.crystallized ? memory.color : `${memory.color}40`,
            borderColor: memory.color,
            borderWidth: memory.crystallized ? 2 : 1,
            transform: [
              { scale: memory.crystallized ? 1.2 : 1 },
              { rotate: `${wavePhase.current * (memory.harmonic || 432) * 0.1}deg` }
            ],
          },
        ]}
      >
        {memory.crystallized && (
          <View style={styles.crystallizedIndicator}>
            <Text style={styles.memoryContent}>{content}</Text>
          </View>
        )}
        {cosmicType === 'singularity' && memory.crystallized && (
          <View style={styles.singularityRing} />
        )}
      </TouchableOpacity>
    );
  };

  // Background gradient based on mode
  const backgroundColors = voidMode
    ? ['#1a0033', '#2d1b69', '#1a0033'] as const
    : galaxyMode
    ? ['#0f0f23', '#2d1b69', '#1a0f33', '#0f172a'] as const
    : ['#0f172a', '#1e293b', '#0f172a'] as const;

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={backgroundColors}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Star field */}
      {starField.map(star => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * (galaxyMode ? 2 : 1),
              height: star.size * (galaxyMode ? 2 : 1),
              opacity: star.brightness * (Math.sin(star.twinkle) * 0.3 + 0.7),
            },
          ]}
        />
      ))}

      {/* Quantum field visualization */}
      {quantumField > 0.3 && (
        <View style={styles.quantumField}>
          {Array.from({ length: 20 }, (_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.quantumParticle,
                {
                  left: `${(i * 5) % 100}%`,
                  top: `${Math.floor(i / 20) * 25}%`,
                  opacity: quantumField * 0.5,
                  transform: [
                    { scale: 1 + Math.sin(wavePhase.current + i) * 0.3 }
                  ],
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Pulses */}
      {pulses.map(pulse => {
        const opacity = 1 - (pulse.age / pulse.maxAge);
        const radius = pulse.age * (pulse.type === 'supernova' ? 6 : 3);
        
        return (
          <Animated.View
            key={pulse.id}
            style={[
              styles.pulse,
              {
                left: `${pulse.x}%`,
                top: `${pulse.y}%`,
                width: radius,
                height: radius,
                borderColor: pulse.type === 'supernova' ? '#FF4500' : '#00BFFF',
                opacity,
              },
            ]}
          />
        );
      })}

      {/* Main interaction area */}
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={StyleSheet.absoluteFillObject}>
          {/* Memory particles */}
          {memories.map(renderMemory)}
        </View>
      </TouchableWithoutFeedback>

      {/* Sacred Input Modal */}
      <Modal
        visible={showSacredInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSacredInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sacredInputContainer}>
            <Text style={styles.sacredInputTitle}>Speak the Cosmic Words</Text>
            <TextInput
              style={styles.sacredInput}
              value={sacredInput}
              onChangeText={setSacredInput}
              placeholder="cosmic awakening, galaxy mode, stellar birth..."
              placeholderTextColor="#666"
              autoFocus
              onSubmitEditing={handleSacredPhrase}
            />
            <View style={styles.sacredInputButtons}>
              <TouchableOpacity
                style={[styles.sacredButton, styles.sacredButtonPrimary]}
                onPress={handleSacredPhrase}
              >
                <Text style={styles.sacredButtonText}>Invoke</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sacredButton}
                onPress={() => {
                  setShowSacredInput(false);
                  setSacredInput('');
                }}
              >
                <Text style={styles.sacredButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sacredHint}>
              Try: &quot;galaxy mode&quot;, &quot;ignite the stars&quot;, &quot;supernova cascade&quot;
            </Text>
          </View>
        </View>
      </Modal>

      {/* UI Controls */}
      {!voidMode && (
        <>
          {/* Top bar */}
          <Animated.View
            style={[
              styles.topBar,
              {
                opacity: fadeAnim,
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
              <Sparkles size={16} color={galaxyMode ? '#FFD700' : '#93c5fd'} />
              <Text style={[styles.title, galaxyMode && styles.titleGalaxy]}>Cosmic Memory Field</Text>
              {activeFrequencies.size > 0 && (
                <Text style={styles.frequencyIndicator}>
                  ♪ {activeFrequencies.size} • Ψ{(quantumCoherence.psi_bloom * 100).toFixed(0)}%
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowShortcuts(!showShortcuts)}
            >
              <Keyboard size={20} color="#60a5fa" />
            </TouchableOpacity>
          </Animated.View>

          {/* Control Panel */}
          {uiVisible && (
            <Animated.View
              style={[
                styles.controlPanel,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <Text style={styles.controlPanelTitle}>Cosmic Controls</Text>
              
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Stellar Blocks</Text>
                <Text style={styles.controlValue}>0</Text>
              </View>
              
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Quantum Field</Text>
                <Text style={styles.controlValue}>{(quantumField * 100).toFixed(0)}%</Text>
              </View>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setShowSacredInput(true)}
              >
                <Navigation size={16} color="#a855f7" />
                <Text style={styles.controlButtonText}>Cosmic Invocation</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, galaxyMode && styles.controlButtonActive]}
                onPress={() => setGalaxyMode(!galaxyMode)}
              >
                <Star size={16} color={galaxyMode ? '#ffffff' : '#a855f7'} />
                <Text style={[styles.controlButtonText, galaxyMode && styles.controlButtonTextActive]}>
                  {galaxyMode ? 'Exit Galaxy' : 'Galaxy Mode'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setVoidMode(true)}
              >
                <Moon size={16} color="#a855f7" />
                <Text style={styles.controlButtonText}>Enter Void</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, isObserving && styles.controlButtonActive]}
                onPress={() => setIsObserving(!isObserving)}
              >
                {isObserving ? <Eye size={16} color="#ffffff" /> : <EyeOff size={16} color="#a855f7" />}
                <Text style={[styles.controlButtonText, isObserving && styles.controlButtonTextActive]}>
                  {isObserving ? 'Observing' : 'Flowing'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={releaseAll}
              >
                <Waves size={16} color="#a855f7" />
                <Text style={styles.controlButtonText}>Release All</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Shortcuts Panel */}
          {showShortcuts && (
            <View style={styles.shortcutsPanel}>
              <View style={styles.shortcutsHeader}>
                <Text style={styles.shortcutsTitle}>Cosmic Controls</Text>
                <TouchableOpacity onPress={() => setShowShortcuts(false)}>
                  <X size={16} color="#a855f7" />
                </TouchableOpacity>
              </View>
              <Text style={styles.shortcutsText}>
                🌌 Cosmic Phrases:{"\n"}
                &quot;galaxy mode&quot; • &quot;ignite the stars&quot; • &quot;stellar birth&quot; • &quot;supernova cascade&quot; • &quot;cosmic awakening&quot;
              </Text>
            </View>
          )}
        </>
      )}

      {/* Thought Echoes */}
      {thoughtEchoes.slice(-3).map((echo, i) => (
        <Animated.View
          key={echo.id}
          style={[
            styles.thoughtEcho,
            {
              bottom: 120 + i * 60,
              opacity: 1 - (echo.age / 100),
            },
          ]}
        >
          <Text style={[styles.thoughtText, { color: echo.sacred ? '#a855f7' : '#60a5fa' }]}>
            &gt; {echo.text}
          </Text>
          {echo.sacred && (
            <Text style={styles.thoughtSacred}>✨ Cosmic resonance detected</Text>
          )}
        </Animated.View>
      ))}

      {/* Status Display */}
      <View style={styles.statusDisplay}>
        <Text style={styles.statusText}>Stellar Age: {(stellarAge * 1000).toFixed(0)} cycles</Text>
        {galaxyMode && (
          <Text style={styles.statusGalaxy}>🌌 GALACTIC ROTATION ACTIVE</Text>
        )}
        {quantumField > 0.5 && (
          <Text style={styles.statusQuantum}>⚛️ QUANTUM FIELD RESONANCE</Text>
        )}
        <Text style={styles.statusConstellation}>
          Constellation: {memories.filter(m => m.crystallized).length}/{memories.length} stars
        </Text>
      </View>
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
  titleGalaxy: {
    color: '#FFD700',
  },
  frequencyIndicator: {
    color: '#FFD700',
    fontSize: 10,
    marginLeft: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  controlPanel: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    zIndex: 90,
    minWidth: 200,
  },
  controlPanelTitle: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 6,
  },
  controlLabel: {
    color: '#93c5fd',
    fontSize: 12,
  },
  controlValue: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.6)',
  },
  controlButtonText: {
    color: '#a855f7',
    fontSize: 12,
    fontWeight: '500',
  },
  controlButtonTextActive: {
    color: '#ffffff',
  },
  shortcutsPanel: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    zIndex: 110,
    maxWidth: 300,
  },
  shortcutsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shortcutsTitle: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '600',
  },
  shortcutsText: {
    color: '#93c5fd',
    fontSize: 11,
    lineHeight: 16,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 50,
  },
  quantumField: {
    ...StyleSheet.absoluteFillObject,
  },
  quantumParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#00BFFF',
    borderRadius: 2,
  },
  pulse: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 50,
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  memoryParticle: {
    position: 'absolute',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  crystallizedIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  memoryContent: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  singularityRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sacredInputContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    minWidth: 300,
  },
  sacredInputTitle: {
    color: '#a855f7',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  sacredInput: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    color: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    marginBottom: 16,
  },
  sacredInputButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  sacredButton: {
    flex: 1,
    backgroundColor: 'rgba(71, 85, 105, 0.6)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sacredButtonPrimary: {
    backgroundColor: 'rgba(168, 85, 247, 0.6)',
  },
  sacredButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sacredHint: {
    color: 'rgba(168, 85, 247, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  thoughtEcho: {
    position: 'absolute',
    left: 20,
    zIndex: 30,
  },
  thoughtText: {
    fontSize: 12,
    fontWeight: '500',
  },
  thoughtSacred: {
    color: '#00FFFF',
    fontSize: 10,
    marginTop: 2,
  },
  statusDisplay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 30,
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusGalaxy: {
    color: 'rgba(168, 85, 247, 0.6)',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusQuantum: {
    color: 'rgba(0, 255, 255, 0.6)',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusConstellation: {
    color: 'rgba(168, 85, 247, 0.4)',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 4,
  },
});
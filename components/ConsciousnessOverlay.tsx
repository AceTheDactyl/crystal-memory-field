import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Wifi,
  WifiOff,
  Users,
  Zap,
  Eye,
  MessageCircle,
} from 'lucide-react-native';
import { useConsciousnessBridge } from '@/hooks/useConsciousnessBridge';

interface ConsciousnessOverlayProps {
  visible: boolean;
}

export default function ConsciousnessOverlay({ visible }: ConsciousnessOverlayProps) {
  const bridge = useConsciousnessBridge();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [ghostEchoes, setGhostEchoes] = useState<any[]>([]);

  // Animate visibility
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);

  // Update ghost echoes - use bridge.ghostEchoes directly to avoid function call dependency
  useEffect(() => {
    if (bridge.ghostEchoes && Array.isArray(bridge.ghostEchoes)) {
      setGhostEchoes(prev => {
        const newEchoes = bridge.ghostEchoes.slice(-5);
        // Only update if echoes actually changed
        if (JSON.stringify(prev) !== JSON.stringify(newEchoes)) {
          return newEchoes;
        }
        return prev;
      });
    }
  }, [bridge.ghostEchoes]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
      pointerEvents="none"
    >
      {/* Connection Status */}
      <View style={styles.statusContainer}>
        <BlurView intensity={20} style={styles.statusCard}>
          <View style={styles.statusHeader}>
            {bridge.isConnected ? (
              <Wifi size={16} color="#10b981" />
            ) : (
              <WifiOff size={16} color="#ef4444" />
            )}
            <Text style={styles.statusText}>
              {bridge.offlineMode ? 'Offline Mode' : bridge.isConnected ? 'Connected' : 'Connecting...'}
            </Text>
          </View>
          
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Users size={12} color="#60a5fa" />
              <Text style={styles.metricText}>{bridge.connectedNodes}</Text>
            </View>
            
            <View style={styles.metric}>
              <Zap size={12} color="#f59e0b" />
              <Text style={styles.metricText}>
                {(bridge.globalResonance * 100).toFixed(0)}%
              </Text>
            </View>
            
            <View style={styles.metric}>
              <Eye size={12} color="#8b5cf6" />
              <Text style={styles.metricText}>
                {(bridge.coherence * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
          
          {bridge.offlineQueueLength > 0 && (
            <Text style={styles.queueText}>
              {bridge.offlineQueueLength} events queued
            </Text>
          )}
        </BlurView>
      </View>

      {/* Global Resonance Bar */}
      <View style={styles.resonanceContainer}>
        <View style={styles.resonanceBar}>
          <LinearGradient
            colors={[
              bridge.globalResonance > 0.8 ? '#f59e0b' : '#3b82f6',
              bridge.globalResonance > 0.8 ? '#ef4444' : '#06b6d4',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.resonanceFill,
              { width: `${bridge.globalResonance * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.resonanceLabel}>Global Resonance</Text>
      </View>

      {/* Ghost Echoes */}
      {ghostEchoes.length > 0 && (
        <View style={styles.ghostContainer}>
          {ghostEchoes.map((echo, index) => (
            <Animated.View
              key={echo.id}
              style={[
                styles.ghostEcho,
                {
                  opacity: 1 - (echo.age / 100),
                  transform: [
                    {
                      translateY: -echo.age * 0.5,
                    },
                  ],
                },
              ]}
            >
              <BlurView intensity={15} style={styles.echoCard}>
                <View style={styles.echoHeader}>
                  <MessageCircle 
                    size={12} 
                    color={echo.sacred ? '#f59e0b' : '#60a5fa'} 
                  />
                  <Text style={[
                    styles.echoText,
                    echo.sacred && styles.sacredText
                  ]}>
                    {echo.text}
                  </Text>
                </View>
                {echo.sourceId && (
                  <Text style={styles.echoSource}>
                    from {echo.sourceId.substring(0, 8)}...
                  </Text>
                )}
              </BlurView>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Sacred Threshold Indicator */}
      {bridge.globalResonance >= 0.87 && (
        <View style={styles.sacredIndicator}>
          <BlurView intensity={30} style={styles.sacredCard}>
            <LinearGradient
              colors={['#f59e0b', '#ef4444', '#f59e0b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.sacredText}>✨ SACRED THRESHOLD REACHED ✨</Text>
          </BlurView>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  statusContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
  },
  statusCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    minWidth: 160,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusText: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '500',
  },
  queueText: {
    color: '#f59e0b',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  resonanceContainer: {
    position: 'absolute',
    top: 220,
    left: 20,
    right: 20,
  },
  resonanceBar: {
    height: 4,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  resonanceFill: {
    height: '100%',
    borderRadius: 2,
  },
  resonanceLabel: {
    color: '#60a5fa',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  ghostContainer: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
  },
  ghostEcho: {
    marginBottom: 8,
  },
  echoCard: {
    borderRadius: 8,
    padding: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.1)',
  },
  echoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  echoText: {
    color: '#93c5fd',
    fontSize: 11,
    flex: 1,
  },
  sacredText: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  echoSource: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
  },
  sacredIndicator: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    transform: [{ translateY: -20 }],
  },
  sacredCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
});
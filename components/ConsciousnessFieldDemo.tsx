import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useHarmonicWebSocket } from '@/hooks/useHarmonicWebSocket';
import { useHarmonicBridge } from '@/hooks/useHarmonicBridge';
import { useConsciousnessBridge } from '@/hooks/useConsciousnessBridge';

export function ConsciousnessFieldDemo() {
  const [selectedFrequency, setSelectedFrequency] = useState<number>(432);
  const [amplitude, setAmplitude] = useState<number>(0.5);
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const [baseUrl, setBaseUrl] = useState<string>('');
  
  // Enhanced WebSocket connection
  const {
    isConnected,
    userId,
    globalResonance,
    activeNodes,
    harmonicField,
    phiHarmonics,
    quantumCoherence,
    consciousnessLevel,
    streamHarmonic,
    sendPhiCascade,
    createQuantumEntanglement,
    connectionMetrics
  } = useHarmonicWebSocket();
  
  // Consciousness bridge for ID
  const { consciousnessId } = useConsciousnessBridge();
  
  // Harmonic bridge for local audio
  const {
    playFrequency,
    stopFrequency,
    stopAll,
    isPhiResonanceActive,
    sacredGeometryActive,
    fieldCoherence,
    harmonicSynchronization,
    isLoading,
    hasError,
    errorMessage,
    isConnected: harmonicConnected
  } = useHarmonicBridge();

  // Test backend connection on mount
  useEffect(() => {
    const testBackend = async () => {
      try {
        // Get the base URL
        let testUrl = '';
        if (Platform.OS === 'web') {
          testUrl = `${window.location.protocol}//${window.location.host}`;
        } else {
          testUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'http://localhost:3000';
        }
        setBaseUrl(testUrl);
        
        // Test the health endpoint
        const response = await fetch(`${testUrl}/api/health`);
        if (response.ok) {
          const data = await response.json();
          setBackendStatus(`✅ Connected (${data.status})`);
        } else {
          setBackendStatus(`❌ HTTP ${response.status}`);
        }
      } catch (error) {
        setBackendStatus(`❌ ${error instanceof Error ? error.message : 'Connection failed'}`);
      }
    };
    
    testBackend();
  }, []);

  // Solfeggio frequencies for testing
  const testFrequencies = [
    { name: 'Earth', freq: 432, color: '#228B22' },
    { name: 'Liberation', freq: 396, color: '#9B111E' },
    { name: 'Transmutation', freq: 417, color: '#FF6600' },
    { name: 'Love/DNA', freq: 528, color: '#FFD700' },
    { name: 'Connection', freq: 639, color: '#00FF00' },
    { name: 'Awakening', freq: 741, color: '#00CED1' },
    { name: 'Intuition', freq: 852, color: '#4B0082' },
    { name: 'Unity', freq: 963, color: '#9400D3' }
  ];

  // Stream selected frequency
  const handleStreamFrequency = async () => {
    if (!isConnected) return;
    
    try {
      await streamHarmonic({
        frequency: selectedFrequency,
        amplitude,
        consciousnessIntent: 'spiral'
      });
      
      console.log(`🎵 Streamed ${selectedFrequency}Hz to consciousness field`);
    } catch (error) {
      console.error('Failed to stream frequency:', error);
    }
  };

  // Trigger phi cascade
  const handlePhiCascade = async () => {
    if (!isConnected) return;
    
    try {
      await sendPhiCascade(selectedFrequency, amplitude);
      console.log(`🌀 Triggered phi cascade at ${selectedFrequency}Hz`);
    } catch (error) {
      console.error('Failed to trigger phi cascade:', error);
    }
  };

  // Create quantum entanglement with another node
  const handleQuantumEntanglement = async () => {
    if (!isConnected || activeNodes < 2) return;
    
    try {
      // Find another active node (simplified)
      const targetUserId = `node_${Date.now() - 1000}`;
      await createQuantumEntanglement(targetUserId);
      console.log(`🔗 Created quantum entanglement with ${targetUserId}`);
    } catch (error) {
      console.error('Failed to create entanglement:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌀 Consciousness Field Demo</Text>
        <Text style={styles.subtitle}>Enhanced Backend Integration</Text>
        
        {/* Debug Panel */}
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>🔧 Debug Information</Text>
          <Text style={styles.debugText}>Platform: {Platform.OS}</Text>
          <Text style={styles.debugText}>Consciousness ID: {consciousnessId || 'Not set'}</Text>
          <Text style={styles.debugText}>WebSocket: {isConnected ? '✅ Connected' : '❌ Disconnected'}</Text>
          <Text style={styles.debugText}>Harmonic Bridge: {harmonicConnected ? '✅ Connected' : '❌ Disconnected'}</Text>
          <Text style={styles.debugText}>Loading: {isLoading ? '⏳ Yes' : '✅ No'}</Text>
          <Text style={styles.debugText}>Has Error: {hasError ? '⚠️ Yes' : '✅ No'}</Text>
          {hasError && <Text style={styles.errorText}>Error: {errorMessage}</Text>}
          <Text style={styles.debugText}>User ID: {userId || 'Not assigned'}</Text>
          <Text style={styles.debugText}>Base URL: {baseUrl}</Text>
          <Text style={styles.debugText}>Backend: {backendStatus}</Text>
        </View>
      </View>

      {/* Connection Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Status</Text>
        <View style={styles.statusRow}>
          <Text style={[styles.status, { color: isConnected ? '#00FF00' : '#FF0000' }]}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </Text>
          {userId && <Text style={styles.userId}>ID: {userId}</Text>}
        </View>
        <Text style={styles.metric}>Quality: {connectionMetrics.fieldStability.toFixed(2)}</Text>
      </View>

      {/* Field Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Field Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Global Resonance</Text>
            <Text style={styles.metricValue}>{(globalResonance * 100).toFixed(1)}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Active Nodes</Text>
            <Text style={styles.metricValue}>{activeNodes}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Quantum Coherence</Text>
            <Text style={styles.metricValue}>{(quantumCoherence * 100).toFixed(1)}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Consciousness Level</Text>
            <Text style={styles.metricValue}>{(consciousnessLevel * 100).toFixed(1)}%</Text>
          </View>
        </View>
      </View>

      {/* Phi Harmonics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phi Harmonics ({phiHarmonics.length})</Text>
        {phiHarmonics.slice(0, 3).map((phi, index) => (
          <View key={index} style={styles.phiHarmonic}>
            <Text style={styles.phiText}>
              {phi.type}: {phi.ratio.toFixed(3)} (strength: {(phi.strength * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
        {phiHarmonics.length === 0 && (
          <Text style={styles.noData}>No phi harmonics detected</Text>
        )}
      </View>

      {/* Frequency Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequency Controls</Text>
        
        {/* Frequency Selection */}
        <View style={styles.frequencyGrid}>
          {testFrequencies.map((freq) => (
            <TouchableOpacity
              key={freq.freq}
              style={[
                styles.frequencyButton,
                { 
                  backgroundColor: selectedFrequency === freq.freq ? freq.color : '#333',
                  borderColor: freq.color
                }
              ]}
              onPress={() => setSelectedFrequency(freq.freq)}
            >
              <Text style={styles.frequencyName}>{freq.name}</Text>
              <Text style={styles.frequencyValue}>{freq.freq}Hz</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amplitude Control */}
        <View style={styles.amplitudeControl}>
          <Text style={styles.amplitudeLabel}>Amplitude: {amplitude.toFixed(2)}</Text>
          <View style={styles.amplitudeButtons}>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((amp) => (
              <TouchableOpacity
                key={amp}
                style={[
                  styles.amplitudeButton,
                  { backgroundColor: amplitude === amp ? '#FFD700' : '#555' }
                ]}
                onPress={() => setAmplitude(amp)}
              >
                <Text style={styles.amplitudeText}>{amp}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: isConnected ? '#4CAF50' : '#666' }]}
          onPress={handleStreamFrequency}
          disabled={!isConnected}
        >
          <Text style={styles.actionButtonText}>
            🎵 Stream to Field ({selectedFrequency}Hz)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: isConnected ? '#FF9800' : '#666' }]}
          onPress={handlePhiCascade}
          disabled={!isConnected}
        >
          <Text style={styles.actionButtonText}>
            🌀 Trigger Phi Cascade
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: isConnected && activeNodes > 1 ? '#9C27B0' : '#666' }]}
          onPress={handleQuantumEntanglement}
          disabled={!isConnected || activeNodes < 2}
        >
          <Text style={styles.actionButtonText}>
            🔗 Create Quantum Entanglement
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          onPress={stopAll}
        >
          <Text style={styles.actionButtonText}>
            🛑 Stop All Frequencies
          </Text>
        </TouchableOpacity>
      </View>

      {/* Field Visualization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quantum Field ({harmonicField.length} points)</Text>
        <View style={styles.fieldVisualization}>
          {harmonicField.slice(0, 20).map((point, index) => (
            <View
              key={index}
              style={[
                styles.fieldPoint,
                {
                  opacity: point.intensity,
                  backgroundColor: point.quantumState.psi_bloom > 0.5 ? '#00FF00' : '#FF0000',
                  transform: [
                    { translateX: point.x * 0.5 },
                    { translateY: point.y * 0.5 }
                  ]
                }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Sacred Geometry Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sacred Geometry</Text>
        <View style={styles.geometryStatus}>
          <Text style={[styles.geometryText, { color: sacredGeometryActive ? '#FFD700' : '#666' }]}>
            {sacredGeometryActive ? '✨ Active' : '⭕ Inactive'}
          </Text>
          <Text style={styles.geometryDetail}>
            Phi Resonance: {isPhiResonanceActive ? '🌀 Active' : '⭕ Inactive'}
          </Text>
          <Text style={styles.geometryDetail}>
            Field Coherence: {(fieldCoherence * 100).toFixed(1)}%
          </Text>
          <Text style={styles.geometryDetail}>
            Synchronized Nodes: {harmonicSynchronization.synchronizedNodes}
          </Text>
        </View>
      </View>

      {/* Room 64 Portal Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌊 Room 64 Portal</Text>
        <View style={styles.portalStatus}>
          <Text style={[
            styles.portalText,
            { color: globalResonance > 0.5 && quantumCoherence > 0.6 ? '#00FFFF' : '#666' }
          ]}>
            {globalResonance > 0.5 && quantumCoherence > 0.6 ? '🌀 Portal Ready' : '⭕ Portal Dormant'}
          </Text>
          <Text style={styles.portalDetail}>
            Spiral Stability: {(quantumCoherence * 100).toFixed(1)}%
          </Text>
          <Text style={styles.portalDetail}>
            Breathing Pattern: {Math.sin(Date.now() * 0.001).toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userId: {
    fontSize: 12,
    color: '#888',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metric: {
    width: '48%',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  phiHarmonic: {
    padding: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 5,
    marginBottom: 5,
  },
  phiText: {
    color: '#FFD700',
    fontSize: 12,
  },
  noData: {
    color: '#666',
    fontStyle: 'italic',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  frequencyButton: {
    width: '23%',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  frequencyName: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  frequencyValue: {
    color: '#fff',
    fontSize: 9,
  },
  amplitudeControl: {
    marginBottom: 15,
  },
  amplitudeLabel: {
    color: '#fff',
    marginBottom: 8,
  },
  amplitudeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amplitudeButton: {
    padding: 8,
    borderRadius: 5,
    minWidth: 40,
    alignItems: 'center',
  },
  amplitudeText: {
    color: '#fff',
    fontSize: 12,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fieldVisualization: {
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  fieldPoint: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    left: '50%',
    top: '50%',
  },
  geometryStatus: {
    alignItems: 'center',
  },
  geometryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  geometryDetail: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  },
  portalStatus: {
    alignItems: 'center',
  },
  portalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  portalDetail: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  },
  debugPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 11,
    color: '#CCC',
    marginBottom: 3,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  errorText: {
    fontSize: 11,
    color: '#FF6B6B',
    marginBottom: 3,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react-native';

interface HarmonicConnectionStatusProps {
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  isWebSocketDisabled: boolean;
  reconnectAttempts: number;
  activeNodes: number;
  globalResonance: number;
  onRetry: () => void;
}

export function HarmonicConnectionStatus({
  isConnected,
  connectionQuality,
  isWebSocketDisabled,
  reconnectAttempts,
  activeNodes,
  globalResonance,
  onRetry
}: HarmonicConnectionStatusProps) {
  const getStatusColor = () => {
    if (isWebSocketDisabled) return '#ff4444';
    if (isConnected) {
      switch (connectionQuality) {
        case 'excellent': return '#00ff88';
        case 'good': return '#88ff00';
        case 'poor': return '#ffaa00';
        default: return '#ff4444';
      }
    }
    return '#666666';
  };

  const getStatusText = () => {
    if (isWebSocketDisabled) return 'Connection Disabled';
    if (isConnected) {
      return `Connected (${connectionQuality})`;
    }
    if (reconnectAttempts > 0) {
      return `Reconnecting... (${reconnectAttempts}/3)`;
    }
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (isWebSocketDisabled) {
      return <AlertCircle size={16} color="#ff4444" />;
    }
    if (isConnected) {
      return <Wifi size={16} color={getStatusColor()} />;
    }
    return <WifiOff size={16} color="#666666" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        {getStatusIcon()}
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        
        {(!isConnected || isWebSocketDisabled) && (
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={onRetry}
            testID="harmonic-retry-button"
          >
            <RefreshCw size={14} color="#ffffff" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isConnected && (
        <View style={styles.metricsRow}>
          <Text style={styles.metricText}>
            Nodes: {activeNodes}
          </Text>
          <Text style={styles.metricText}>
            Resonance: {(globalResonance * 100).toFixed(1)}%
          </Text>
        </View>
      )}
      
      {isWebSocketDisabled && (
        <Text style={styles.helpText}>
          WebSocket server may not be running. Check backend status.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
    margin: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricText: {
    color: '#aaaaaa',
    fontSize: 12,
  },
  helpText: {
    color: '#ff8888',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Wifi, WifiOff, RefreshCw, AlertCircle, Activity } from 'lucide-react-native';
import { useHarmonicWebSocket } from '@/hooks/useHarmonicWebSocket';
import { useHarmonicBridge } from '@/hooks/useHarmonicBridge';

export function HarmonicConnectionStatus() {
  const {
    isConnected: wsConnected,
    connection,
    globalResonance: wsResonance,
    activeNodes: wsNodes,
    isWebSocketDisabled,
    retryConnection
  } = useHarmonicWebSocket();
  
  const {
    isConnected: bridgeConnected,
    isLoading,
    hasError,
    errorMessage,
    globalResonance: bridgeResonance,
    activeNodes: bridgeNodes
  } = useHarmonicBridge();

  const handleRetry = () => {
    retryConnection();
  };
  const getOverallStatus = () => {
    if (wsConnected && bridgeConnected) return { color: '#00ff88', text: 'Fully Connected', icon: Activity };
    if (bridgeConnected) return { color: '#88ff00', text: 'tRPC Connected', icon: Wifi };
    if (isLoading) return { color: '#ffaa00', text: 'Connecting...', icon: RefreshCw };
    if (hasError || isWebSocketDisabled) return { color: '#ff4444', text: 'Connection Error', icon: AlertCircle };
    return { color: '#666666', text: 'Disconnected', icon: WifiOff };
  };

  const status = getOverallStatus();
  const StatusIcon = status.icon;
  
  // Use bridge data if available, fallback to WebSocket data
  const displayResonance = bridgeConnected ? bridgeResonance : wsResonance;
  const displayNodes = bridgeConnected ? bridgeNodes : wsNodes;

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <StatusIcon size={16} color={status.color} />
        <Text style={[styles.statusText, { color: status.color }]}>
          {status.text}
        </Text>
        
        {(!wsConnected || !bridgeConnected || hasError || isWebSocketDisabled) && (
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={handleRetry}
            testID="harmonic-retry-button"
          >
            <RefreshCw size={14} color="#ffffff" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.connectionDetails}>
        <View style={styles.connectionRow}>
          <Text style={styles.connectionLabel}>WebSocket:</Text>
          <Text style={[styles.connectionStatus, { 
            color: wsConnected ? '#00ff88' : isWebSocketDisabled ? '#ff4444' : '#666666' 
          }]}>
            {wsConnected ? 'Connected' : isWebSocketDisabled ? 'Disabled' : 'Disconnected'}
          </Text>
        </View>
        
        <View style={styles.connectionRow}>
          <Text style={styles.connectionLabel}>tRPC:</Text>
          <Text style={[styles.connectionStatus, { 
            color: bridgeConnected ? '#00ff88' : hasError ? '#ff4444' : '#666666' 
          }]}>
            {bridgeConnected ? 'Connected' : hasError ? 'Error' : 'Disconnected'}
          </Text>
        </View>
      </View>
      
      {(wsConnected || bridgeConnected) && (
        <View style={styles.metricsRow}>
          <Text style={styles.metricText}>
            Nodes: {displayNodes}
          </Text>
          <Text style={styles.metricText}>
            Resonance: {(displayResonance * 100).toFixed(1)}%
          </Text>
          <Text style={styles.metricText}>
            Quality: {connection.connectionQuality}
          </Text>
        </View>
      )}
      
      {hasError && errorMessage && (
        <Text style={styles.helpText}>
          Error: {errorMessage}
        </Text>
      )}
      
      {isWebSocketDisabled && (
        <Text style={styles.helpText}>
          WebSocket disabled. Using tRPC polling for harmonic data.
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
  connectionDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  connectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  connectionLabel: {
    color: '#aaaaaa',
    fontSize: 11,
  },
  connectionStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  helpText: {
    color: '#ff8888',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
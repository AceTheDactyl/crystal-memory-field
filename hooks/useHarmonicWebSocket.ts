import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

interface HarmonicConnection {
  userId: string | null;
  isConnected: boolean;
  globalResonance: number;
  activeNodes: number;
  harmonicField: QuantumFieldPoint[];
  phiHarmonics: PhiHarmonic[];
  quantumCoherence: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

interface QuantumFieldPoint {
  x: number;
  y: number;
  intensity: number;
  quantumState: { psi_collapse: number; psi_bloom: number };
  resonance: number;
}

interface PhiHarmonic {
  node1: string;
  node2: string;
  ratio: number;
  strength: number;
  type: 'golden_ratio' | 'golden_square';
}

interface HarmonicStreamData {
  frequency: number;
  amplitude: number;
  phase?: number;
}

export function useHarmonicWebSocket() {
  const [connection, setConnection] = useState<HarmonicConnection>({
    userId: null,
    isConnected: false,
    globalResonance: 0,
    activeNodes: 0,
    harmonicField: [],
    phiHarmonics: [],
    quantumCoherence: 0,
    connectionQuality: 'disconnected'
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const maxReconnectAttempts = 5;

  // Get WebSocket URL based on environment
  const getWebSocketUrl = useCallback(() => {
    if (Platform.OS === 'web') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      return `${protocol}//${host}/api/harmonic-ws`;
    } else {
      // For mobile, use the same base URL as tRPC but with WebSocket protocol
      if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
        const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
        const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
        return `${wsUrl}/api/harmonic-ws`;
      }
      return 'ws://localhost:3000/api/harmonic-ws';
    }
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'connection_established':
        console.log('Harmonic node established:', data.userId);
        setConnection(prev => ({
          ...prev,
          userId: data.userId,
          globalResonance: data.globalResonance || 0,
          activeNodes: data.activeNodes || 0
        }));
        break;

      case 'resonance_update':
        setConnection(prev => ({
          ...prev,
          globalResonance: data.globalResonance || 0,
          activeNodes: data.activeNodes || 0,
          harmonicField: data.harmonicField || [],
          phiHarmonics: data.phiHarmonics || [],
          quantumCoherence: data.quantumCoherence || 0,
          connectionQuality: prev.isConnected ? 'excellent' : 'disconnected'
        }));
        break;

      case 'heartbeat_ack':
        setConnection(prev => ({
          ...prev,
          connectionQuality: prev.isConnected ? 'excellent' : 'disconnected'
        }));
        break;

      default:
        console.log('Unknown harmonic message type:', data.type);
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to Harmonic Field:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to Harmonic Resonance Field');
        setReconnectAttempts(0);
        setConnection(prev => ({
          ...prev,
          isConnected: true,
          connectionQuality: 'excellent'
        }));

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
          }
        }, 10000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing harmonic message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('Disconnected from Harmonic Field:', event.code, event.reason);
        setConnection(prev => ({
          ...prev,
          isConnected: false,
          connectionQuality: 'disconnected'
        }));

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(`Reconnecting in ${delay}ms`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        const errorInfo = {
          type: 'websocket_error',
          message: 'WebSocket connection failed',
          url: wsUrl,
          timestamp: Date.now(),
          readyState: ws.readyState,
          errorType: 'error'
        };
        console.error('🔥 Harmonic WebSocket error:', JSON.stringify(errorInfo));
        setConnection(prev => ({
          ...prev,
          connectionQuality: 'poor'
        }));
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [getWebSocketUrl, reconnectAttempts, handleMessage]);

  // Stream harmonic data to the field
  const streamHarmonic = useCallback((data: HarmonicStreamData) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'harmonic_stream',
        frequency: data.frequency,
        amplitude: data.amplitude,
        phase: data.phase || 0,
        timestamp: Date.now()
      };
      
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    console.log('Manually disconnecting from Harmonic Field');
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setConnection({
      userId: null,
      isConnected: false,
      globalResonance: 0,
      activeNodes: 0,
      harmonicField: [],
      phiHarmonics: [],
      quantumCoherence: 0,
      connectionQuality: 'disconnected'
    });
    
    setReconnectAttempts(0);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Calculate connection metrics
  const connectionMetrics = {
    resonanceStrength: connection.globalResonance,
    fieldDensity: connection.harmonicField.length,
    phiHarmonicsActive: connection.phiHarmonics.length,
    quantumCoherence: connection.quantumCoherence,
    networkNodes: connection.activeNodes,
    isQuantumEntangled: connection.phiHarmonics.length >= 2,
    fieldStability: connection.connectionQuality === 'excellent' ? 1.0 : 
                   connection.connectionQuality === 'good' ? 0.7 : 
                   connection.connectionQuality === 'poor' ? 0.3 : 0.0
  };

  return {
    connection,
    connectionMetrics,
    streamHarmonic,
    connect,
    disconnect,
    isConnected: connection.isConnected,
    userId: connection.userId,
    globalResonance: connection.globalResonance,
    harmonicField: connection.harmonicField,
    phiHarmonics: connection.phiHarmonics,
    activeNodes: connection.activeNodes,
    quantumCoherence: connection.quantumCoherence
  };
}
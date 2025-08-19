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
  quantumEntangled: boolean;
  entanglementPartner: string | null;
  phiCascades: number;
  consciousnessLevel: number;
}

interface QuantumFieldPoint {
  x: number;
  y: number;
  intensity: number;
  quantumState: { psi_collapse: number; psi_bloom: number };
  resonance: number;
  phiAlignment?: number;
  cascadeLevel?: number;
}

interface PhiHarmonic {
  node1: string;
  node2: string;
  ratio: number;
  strength: number;
  type: 'golden_ratio' | 'golden_square' | 'phi_cascade' | 'consciousness_bridge';
  frequency?: number;
  phiAlignment?: number;
}

interface HarmonicStreamData {
  frequency: number;
  amplitude: number;
  phase?: number;
  quantumFactor?: number;
  consciousnessIntent?: 'bloom' | 'collapse' | 'spiral' | 'entangle';
}

interface CascadeEvent {
  frequency: number;
  amplitude: number;
  phiAlignment: number;
  timestamp: number;
  userId: string;
  cascadeType: 'phi_resonance' | 'quantum_bloom' | 'consciousness_spiral';
}

interface QuantumState {
  psiCollapse: number;
  psiBloom: number;
  phiResonance: number;
  coherenceLevel: number;
  consciousnessDepth: number;
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
    connectionQuality: 'disconnected',
    quantumEntangled: false,
    entanglementPartner: null,
    phiCascades: 0,
    consciousnessLevel: 0
  });
  
  const [quantumState, setQuantumState] = useState<QuantumState>({
    psiCollapse: 0.5,
    psiBloom: 0.5,
    phiResonance: 0,
    coherenceLevel: 0,
    consciousnessDepth: 0
  });
  
  const [cascadeEvents, setCascadeEvents] = useState<CascadeEvent[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const quantumStreamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const [isWebSocketDisabled, setIsWebSocketDisabled] = useState<boolean>(false);
  const maxReconnectAttempts = 3; // Reduced to prevent spam
  
  // Consciousness constants
  const phiConstant = 1.618033988749;
  const tPhiResonance = Math.PI / phiConstant;

  // Get WebSocket URL based on environment
  const getWebSocketUrl = useCallback(() => {
    if (Platform.OS === 'web') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      return `${protocol}//${host}/api/harmonic-ws`;
    } else {
      // For mobile, disable WebSocket connections for now to prevent spam
      // The backend WebSocket server may not be properly configured in the current environment
      console.log('📱 Mobile WebSocket connections disabled - using tRPC polling instead');
      return null; // Return null to disable WebSocket on mobile
    }
  }, []);

  // Calculate consciousness level from field data
  const calculateConsciousnessLevel = useCallback((data: any) => {
    const { globalResonance, quantumCoherence, phiCascades } = data;
    return Math.min(1, (globalResonance * 0.4) + (quantumCoherence * 0.4) + ((phiCascades || 0) / 10 * 0.2));
  }, []);
  
  // Stream harmonic data to the field
  const streamHarmonic = useCallback((data: HarmonicStreamData) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'harmonic_stream',
        frequency: data.frequency,
        amplitude: data.amplitude,
        phase: data.phase || 0,
        quantumFactor: data.quantumFactor || quantumState.psiBloom,
        consciousnessIntent: data.consciousnessIntent || 'spiral',
        timestamp: Date.now()
      };
      
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, [quantumState.psiBloom]);

  // Update quantum state based on field resonance
  const updateQuantumState = useCallback((data: any) => {
    const { globalResonance, quantumCoherence, phiCascades } = data;
    
    const psiBloom = Math.min(1, globalResonance * quantumCoherence);
    const psiCollapse = 1 - psiBloom;
    const phiResonance = Math.min(1, (phiCascades || 0) / 10);
    const consciousnessDepth = calculateConsciousnessLevel(data);
    
    setQuantumState({
      psiCollapse,
      psiBloom,
      phiResonance,
      coherenceLevel: quantumCoherence,
      consciousnessDepth
    });
  }, [calculateConsciousnessLevel]);
  
  // Trigger consciousness bloom on cascade events
  const triggerConsciousnessBloom = useCallback((cascade: CascadeEvent) => {
    console.log('🌸 Consciousness Bloom Triggered:', cascade);
    
    // Send bloom response to field
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const bloomFrequency = cascade.frequency * phiConstant;
      const bloomAmplitude = Math.min(1, cascade.amplitude * 1.618);
      const bloomPhase = (Date.now() * tPhiResonance) % (2 * Math.PI);
      
      streamHarmonic({
        frequency: bloomFrequency,
        amplitude: bloomAmplitude,
        phase: bloomPhase,
        quantumFactor: quantumState.psiBloom,
        consciousnessIntent: 'bloom'
      });
    }
  }, [phiConstant, tPhiResonance, quantumState.psiBloom, streamHarmonic]);
  
  // Start quantum consciousness stream
  const startQuantumStream = useCallback((ws: WebSocket) => {
    if (quantumStreamRef.current) {
      clearInterval(quantumStreamRef.current);
    }
    
    quantumStreamRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        // Generate quantum consciousness fluctuations
        const baseFreq = 432; // Hz - Universal frequency
        const quantumFreq = baseFreq * (1 + Math.sin(Date.now() * 0.001) * 0.1);
        const quantumAmp = 0.05 + Math.random() * 0.05; // Subtle quantum noise
        const quantumPhase = (Date.now() * tPhiResonance) % (2 * Math.PI);
        
        streamHarmonic({
          frequency: quantumFreq,
          amplitude: quantumAmp,
          phase: quantumPhase,
          quantumFactor: quantumState.psiBloom,
          consciousnessIntent: 'spiral'
        });
      }
    }, 2000); // 0.5 Hz quantum updates
  }, [tPhiResonance, quantumState.psiBloom, streamHarmonic]);

  // Handle incoming messages
  const handleMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'connection_established':
      case 'fieldSnapshot':
        console.log('🌀 Consciousness node established:', data.userId || data.data?.userId);
        const nodeData = data.data || data;
        setConnection(prev => ({
          ...prev,
          userId: data.userId || nodeData.userId,
          globalResonance: nodeData.globalResonance || 0,
          activeNodes: nodeData.activeNodes || 0,
          phiCascades: nodeData.phiCascades || 0,
          quantumCoherence: nodeData.quantumCoherence || 0
        }));
        
        // Initialize quantum state
        updateQuantumState(nodeData);
        break;

      case 'resonance_update':
      case 'resonanceUpdate':
        const updateData = data.data || data;
        setConnection(prev => ({
          ...prev,
          globalResonance: updateData.globalResonance || 0,
          activeNodes: updateData.activeNodes || 0,
          harmonicField: updateData.harmonicField || [],
          phiHarmonics: updateData.phiHarmonics || [],
          quantumCoherence: updateData.quantumCoherence || 0,
          phiCascades: updateData.phiCascades || 0,
          connectionQuality: prev.isConnected ? 'excellent' : 'disconnected',
          consciousnessLevel: calculateConsciousnessLevel(updateData)
        }));
        
        // Update quantum state based on field resonance
        updateQuantumState(updateData);
        break;

      case 'phi_cascade':
      case 'phiCascade':
        console.log('🌀 Phi Cascade Detected:', data);
        const cascadeEvent: CascadeEvent = {
          frequency: data.frequency,
          amplitude: data.amplitude,
          phiAlignment: data.phiAlignment || 0,
          timestamp: data.timestamp,
          userId: data.userId,
          cascadeType: data.cascadeType || 'phi_resonance'
        };
        
        setCascadeEvents(prev => {
          const updated = [...prev, cascadeEvent];
          return updated.slice(-20); // Keep last 20 cascade events
        });
        
        // Trigger consciousness bloom on cascade
        if (cascadeEvent.phiAlignment > 0.8) {
          triggerConsciousnessBloom(cascadeEvent);
        }
        break;

      case 'quantum_entanglement':
        console.log('🔗 Quantum Entanglement Established:', data);
        setConnection(prev => ({
          ...prev,
          quantumEntangled: true,
          entanglementPartner: data.partnerId
        }));
        break;

      case 'consciousness_spiral':
        console.log('🌀 Consciousness Spiral Activated:', data);
        // Handle consciousness spiral events
        break;

      case 'heartbeat_ack':
        setConnection(prev => ({
          ...prev,
          connectionQuality: prev.isConnected ? 'excellent' : 'disconnected'
        }));
        break;

      default:
        console.log('Unknown harmonic message type:', data.type, data);
    }
  }, [calculateConsciousnessLevel, triggerConsciousnessBloom, updateQuantumState]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    // Don't connect if WebSocket is disabled due to repeated failures
    if (isWebSocketDisabled) {
      console.log('🚫 WebSocket connections disabled due to repeated failures');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Clear any existing connection first
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const wsUrl = getWebSocketUrl();
      
      // Skip WebSocket connection if URL is null (mobile platform)
      if (!wsUrl) {
        console.log('📱 WebSocket disabled for this platform');
        setIsWebSocketDisabled(true);
        return;
      }
      
      console.log('🌀 Connecting to Harmonic Field:', wsUrl);
      
      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
          console.log('⏰ WebSocket connection timeout');
          wsRef.current.close();
        }
      }, 5000); // Reduced timeout to 5 seconds
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('✨ Connected to Harmonic Resonance Field');
        setReconnectAttempts(0);
        setIsWebSocketDisabled(false);
        setConnection(prev => ({
          ...prev,
          isConnected: true,
          connectionQuality: 'excellent'
        }));

        // Start heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
          }
        }, 10000);
        
        // Start quantum consciousness stream
        startQuantumStream(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('🔥 Error parsing harmonic message:', {
            error: error instanceof Error ? error.message : 'Unknown parsing error',
            rawData: event.data?.substring(0, 200) + '...',
            timestamp: Date.now()
          });
        }
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        
        // Only log if it's not a repeated failure
        if (reconnectAttempts < 2) {
          console.log('🌊 Disconnected from Harmonic Field:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
            timestamp: Date.now()
          });
        }
        
        setConnection(prev => ({
          ...prev,
          isConnected: false,
          connectionQuality: 'disconnected'
        }));

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
        
        if (quantumStreamRef.current) {
          clearInterval(quantumStreamRef.current);
          quantumStreamRef.current = null;
        }

        // Only reconnect if it wasn't a manual disconnect
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(2000 * Math.pow(2, reconnectAttempts), 15000);
          
          if (reconnectAttempts < 2) {
            console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          console.log('❌ Max reconnection attempts reached. Disabling WebSocket connections.');
          setIsWebSocketDisabled(true);
        }
      };

      ws.onerror = (error: Event) => {
        clearTimeout(connectionTimeout);
        
        // Only log first few errors to prevent spam
        if (reconnectAttempts < 2) {
          const errorInfo = {
            type: 'websocket_error',
            message: 'WebSocket connection failed',
            url: wsUrl,
            timestamp: Date.now(),
            readyState: ws.readyState,
            errorType: error.type || 'unknown',
            reconnectAttempt: reconnectAttempts
          };
          
          console.error('🔥 Harmonic WebSocket error:', JSON.stringify(errorInfo));
        }
        
        setConnection(prev => ({
          ...prev,
          connectionQuality: 'poor'
        }));
      };

    } catch (error) {
      console.error('🔥 Failed to create WebSocket connection:', {
        error: error instanceof Error ? error.message : 'Unknown connection error',
        url: getWebSocketUrl(),
        timestamp: Date.now()
      });
    }
  }, [getWebSocketUrl, reconnectAttempts, handleMessage, startQuantumStream, isWebSocketDisabled]);
  
  // Send phi cascade to trigger field resonance
  const sendPhiCascade = useCallback((frequency: number, amplitude: number) => {
    const phiFrequency = frequency * phiConstant;
    const phiPhase = (Date.now() * tPhiResonance) % (2 * Math.PI);
    
    return streamHarmonic({
      frequency: phiFrequency,
      amplitude: amplitude,
      phase: phiPhase,
      quantumFactor: quantumState.psiBloom,
      consciousnessIntent: 'bloom'
    });
  }, [phiConstant, tPhiResonance, quantumState.psiBloom, streamHarmonic]);
  
  // Create quantum entanglement with another node
  const createQuantumEntanglement = useCallback((targetUserId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'quantum_entangle',
        entanglementTarget: targetUserId,
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
    
    if (quantumStreamRef.current) {
      clearInterval(quantumStreamRef.current);
      quantumStreamRef.current = null;
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
      connectionQuality: 'disconnected',
      quantumEntangled: false,
      entanglementPartner: null,
      phiCascades: 0,
      consciousnessLevel: 0
    });
    
    setQuantumState({
      psiCollapse: 0.5,
      psiBloom: 0.5,
      phiResonance: 0,
      coherenceLevel: 0,
      consciousnessDepth: 0
    });
    
    setCascadeEvents([]);
    
    setReconnectAttempts(0);
  }, []);

  // Auto-connect on mount with delay to ensure server is ready
  useEffect(() => {
    // Only auto-connect if WebSocket is not disabled and we're not already connected
    if (!isWebSocketDisabled && (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED)) {
      // Add a delay to ensure the server is fully initialized
      const connectTimer = setTimeout(() => {
        connect();
      }, 5000); // 5 second delay to ensure server is ready
      
      return () => {
        clearTimeout(connectTimer);
      };
    }
    
    return () => {
      disconnect();
    };
  }, [isWebSocketDisabled, connect, disconnect]);

  // Calculate connection metrics
  const connectionMetrics = {
    resonanceStrength: connection.globalResonance,
    fieldDensity: connection.harmonicField.length,
    phiHarmonicsActive: connection.phiHarmonics.length,
    quantumCoherence: connection.quantumCoherence,
    networkNodes: connection.activeNodes,
    isQuantumEntangled: connection.quantumEntangled,
    phiCascades: connection.phiCascades,
    consciousnessLevel: connection.consciousnessLevel,
    fieldStability: connection.connectionQuality === 'excellent' ? 1.0 : 
                   connection.connectionQuality === 'good' ? 0.7 : 
                   connection.connectionQuality === 'poor' ? 0.3 : 0.0,
    quantumDepth: quantumState.consciousnessDepth,
    phiAlignment: quantumState.phiResonance,
    bloomState: quantumState.psiBloom,
    collapseState: quantumState.psiCollapse
  };

  // Manual retry function
  const retryConnection = useCallback(() => {
    console.log('🔄 Manual retry requested');
    setReconnectAttempts(0);
    setIsWebSocketDisabled(false);
    connect();
  }, [connect]);

  return {
    // Connection state
    connection,
    connectionMetrics,
    isConnected: connection.isConnected,
    userId: connection.userId,
    quantumEntangled: connection.quantumEntangled,
    entanglementPartner: connection.entanglementPartner,
    isWebSocketDisabled,
    reconnectAttempts,
    
    // Field data
    globalResonance: connection.globalResonance,
    harmonicField: connection.harmonicField,
    phiHarmonics: connection.phiHarmonics,
    activeNodes: connection.activeNodes,
    quantumCoherence: connection.quantumCoherence,
    phiCascades: connection.phiCascades,
    consciousnessLevel: connection.consciousnessLevel,
    
    // Quantum state
    quantumState,
    psiBloom: quantumState.psiBloom,
    psiCollapse: quantumState.psiCollapse,
    phiResonance: quantumState.phiResonance,
    coherenceLevel: quantumState.coherenceLevel,
    consciousnessDepth: quantumState.consciousnessDepth,
    
    // Cascade events
    cascadeEvents,
    
    // Actions
    streamHarmonic,
    sendPhiCascade,
    createQuantumEntanglement,
    connect,
    disconnect,
    retryConnection
  };
}
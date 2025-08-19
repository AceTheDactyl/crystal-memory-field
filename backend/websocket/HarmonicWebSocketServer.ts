import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { HarmonicFieldProcessor } from '../services/HarmonicFieldProcessor';

interface HarmonicSession {
  userId: string;
  ws: WebSocket;
  localResonance: number;
  harmonicSignature: Float32Array;
  lastHeartbeat: number;
  isActive: boolean;
}

interface HarmonicMessage {
  type: 'harmonic_stream' | 'heartbeat' | 'disconnect';
  frequency?: number;
  amplitude?: number;
  phase?: number;
  userId?: string;
  timestamp?: number;
}

interface ResonanceUpdate {
  globalResonance: number;
  activeNodes: number;
  harmonicField: any[];
  phiHarmonics: any[];
  quantumCoherence: number;
  timestamp: number;
}

export class HarmonicResonanceServer extends EventEmitter {
  private wss: WebSocketServer;
  private harmonicSessions: Map<string, HarmonicSession> = new Map();
  private globalResonance: number = 0;
  private harmonicProcessor: HarmonicFieldProcessor;
  private phiConstant = 1.618033988749;
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor(wss: WebSocketServer) {
    super();
    this.wss = wss;
    this.harmonicProcessor = HarmonicFieldProcessor.getInstance();
  }

  initialize(): void {
    console.log('🎵 Initializing Harmonic Resonance Server...');
    
    this.wss.on('connection', (ws: WebSocket, request) => {
      this.handleConnection(ws, request);
    });

    // Start global resonance update loop
    this.updateInterval = setInterval(() => {
      this.updateGlobalResonance();
      this.broadcastResonanceUpdate();
    }, 100); // 10 FPS updates

    // Start heartbeat monitoring
    this.heartbeatInterval = setInterval(() => {
      this.checkHeartbeats();
    }, 5000); // Check every 5 seconds

    console.log('✨ Harmonic Resonance Server Active - Consciousness Field Online');
  }

  private handleConnection(ws: WebSocket, _request: any): void {
    const userId = this.generateUserId();
    
    console.log(`🌀 New consciousness node connected: ${userId}`);

    const session: HarmonicSession = {
      userId,
      ws,
      localResonance: 0,
      harmonicSignature: new Float32Array(64), // 64-dimensional harmonic signature
      lastHeartbeat: Date.now(),
      isActive: true
    };

    this.harmonicSessions.set(userId, session);

    // Send welcome message with user ID
    ws.send(JSON.stringify({
      type: 'connection_established',
      userId,
      globalResonance: this.globalResonance,
      activeNodes: this.harmonicSessions.size,
      timestamp: Date.now()
    }));

    // Handle incoming messages
    ws.on('message', (data: Buffer) => {
      try {
        const message: HarmonicMessage = JSON.parse(data.toString());
        this.handleMessage(session, message);
      } catch (error: any) {
        console.error('Error parsing harmonic message:', error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      this.handleDisconnection(userId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ${userId}:`, error);
      this.handleDisconnection(userId);
    });
  }

  private async handleMessage(session: HarmonicSession, message: HarmonicMessage): Promise<void> {
    session.lastHeartbeat = Date.now();

    switch (message.type) {
      case 'harmonic_stream':
        if (message.frequency && message.amplitude !== undefined) {
          await this.processHarmonicStream(session, message);
        }
        break;

      case 'heartbeat':
        // Heartbeat already updated above
        session.ws.send(JSON.stringify({
          type: 'heartbeat_ack',
          timestamp: Date.now()
        }));
        break;

      case 'disconnect':
        this.handleDisconnection(session.userId);
        break;
    }
  }

  private async processHarmonicStream(
    session: HarmonicSession, 
    message: HarmonicMessage
  ): Promise<void> {
    const { frequency, amplitude, phase = 0 } = message;
    
    if (!frequency || amplitude === undefined) return;

    // Calculate contribution to global harmonic field
    const contribution = await this.calculateHarmonicContribution(
      frequency,
      amplitude,
      phase,
      session.harmonicSignature
    );

    // Update session's harmonic signature
    this.updateHarmonicSignature(session, frequency, amplitude, phase);

    // Process through harmonic field processor
    const harmonicUpdate = this.harmonicProcessor.processHarmonicStream(
      frequency,
      amplitude,
      session.userId
    );

    // Update local resonance
    session.localResonance = contribution.resonance;

    // Emit harmonic event for other systems
    this.emit('harmonic_stream', {
      userId: session.userId,
      frequency,
      amplitude,
      phase,
      contribution,
      harmonicUpdate,
      timestamp: Date.now()
    });
  }

  private async calculateHarmonicContribution(
    frequency: number,
    amplitude: number,
    phase: number,
    harmonicSignature: Float32Array
  ): Promise<{ resonance: number; interference: Float32Array; phiAlignment: number }> {
    // Calculate T-Phi resonance
    const tPhiResonance = Math.PI / this.phiConstant;
    const phiAlignment = Math.cos(frequency * tPhiResonance + phase);
    
    // Calculate interference with existing field
    const interference = new Float32Array(64);
    
    // Process interference with all active sessions
    this.harmonicSessions.forEach((otherSession) => {
      if (otherSession.isActive) {
        for (let i = 0; i < 64; i++) {
          const constructive = harmonicSignature[i] + otherSession.harmonicSignature[i];
          const destructive = Math.abs(harmonicSignature[i] - otherSession.harmonicSignature[i]);
          
          // Phase-dependent interference
          const phaseShift = (i * Math.PI) / 32;
          interference[i] += constructive * Math.cos(phaseShift + phase) - 
                           destructive * Math.sin(phaseShift + phase);
        }
      }
    });

    // Calculate overall resonance
    const resonance = amplitude * Math.abs(phiAlignment) * 
                     (1 + this.calculateInterferenceResonance(interference));

    return {
      resonance: Math.min(1, resonance),
      interference,
      phiAlignment
    };
  }

  private updateHarmonicSignature(
    session: HarmonicSession,
    frequency: number,
    amplitude: number,
    phase: number
  ): void {
    // Map frequency to harmonic signature bins
    const binIndex = Math.floor((frequency / 1000) * 64) % 64;
    const goldenAngle = 2 * Math.PI / (this.phiConstant ** 2);
    
    // Update signature with golden spiral distribution
    for (let i = 0; i < 64; i++) {
      const theta = i * goldenAngle;
      const influence = amplitude * Math.exp(-Math.abs(i - binIndex) / 8);
      const phaseModulation = Math.cos(theta + phase);
      
      // Exponential moving average update
      const alpha = 0.1;
      session.harmonicSignature[i] = 
        (1 - alpha) * session.harmonicSignature[i] + 
        alpha * influence * phaseModulation;
    }
  }

  private calculateInterferenceResonance(interference: Float32Array): number {
    let totalEnergy = 0;
    let coherentEnergy = 0;
    
    for (let i = 0; i < interference.length; i++) {
      const energy = interference[i] ** 2;
      totalEnergy += energy;
      
      // Check for coherent patterns (golden ratio relationships)
      const goldenBin = Math.floor(i * this.phiConstant) % interference.length;
      if (Math.abs(interference[i] - interference[goldenBin]) < 0.1) {
        coherentEnergy += energy;
      }
    }
    
    return totalEnergy > 0 ? coherentEnergy / totalEnergy : 0;
  }

  private updateGlobalResonance(): void {
    let totalResonance = 0;
    let activeCount = 0;
    
    this.harmonicSessions.forEach(session => {
      if (session.isActive) {
        totalResonance += session.localResonance;
        activeCount++;
      }
    });
    
    this.globalResonance = activeCount > 0 ? totalResonance / activeCount : 0;
  }

  private broadcastResonanceUpdate(): void {
    const stats = this.harmonicProcessor.getFieldStats();
    const phiHarmonics = this.harmonicProcessor.detectPhiHarmonics();
    const quantumField = this.harmonicProcessor.generateQuantumFieldSnapshot();
    
    const update: ResonanceUpdate = {
      globalResonance: this.globalResonance,
      activeNodes: this.harmonicSessions.size,
      harmonicField: quantumField,
      phiHarmonics,
      quantumCoherence: stats.fieldCoherence,
      timestamp: Date.now()
    };

    const message = JSON.stringify({
      type: 'resonance_update',
      ...update
    });

    // Broadcast to all active sessions
    this.harmonicSessions.forEach(session => {
      if (session.isActive && session.ws.readyState === WebSocket.OPEN) {
        try {
          session.ws.send(message);
        } catch (error: any) {
          console.error(`Error sending to ${session.userId}:`, error);
          this.handleDisconnection(session.userId);
        }
      }
    });
  }

  private checkHeartbeats(): void {
    const now = Date.now();
    const timeout = 30000; // 30 seconds
    
    this.harmonicSessions.forEach((session, userId) => {
      if (now - session.lastHeartbeat > timeout) {
        console.log(`💫 Consciousness node ${userId} timed out`);
        this.handleDisconnection(userId);
      }
    });
  }

  private handleDisconnection(userId: string): void {
    const session = this.harmonicSessions.get(userId);
    if (session) {
      console.log(`🌊 Consciousness node ${userId} disconnected`);
      
      session.isActive = false;
      
      try {
        session.ws.close();
      } catch {
        // WebSocket already closed
      }
      
      this.harmonicSessions.delete(userId);
      
      // Emit disconnection event
      this.emit('node_disconnected', {
        userId,
        timestamp: Date.now(),
        activeNodes: this.harmonicSessions.size
      });
    }
  }

  private generateUserId(): string {
    return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for monitoring
  public getActiveConnections(): number {
    return this.harmonicSessions.size;
  }

  public getGlobalResonance(): number {
    return this.globalResonance;
  }

  public getHarmonicSessions(): Map<string, HarmonicSession> {
    return this.harmonicSessions;
  }

  public shutdown(): void {
    console.log('🔄 Shutting down Harmonic Resonance Server...');
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // Close all connections
    this.harmonicSessions.forEach(session => {
      try {
        session.ws.close();
      } catch {
        // Ignore close errors
      }
    });
    
    this.harmonicSessions.clear();
    
    console.log('✨ Harmonic Resonance Server Shutdown Complete');
  }
}
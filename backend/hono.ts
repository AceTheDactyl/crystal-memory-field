import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { WebSocketServer } from 'ws';
import { HarmonicResonanceServer } from './websocket/HarmonicWebSocketServer';
import { HarmonicFieldProcessor } from './services/HarmonicFieldProcessor';
import { IncomingMessage, Server } from 'http';
import { Duplex } from 'stream';

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// Enhanced health check with consciousness field status
app.get("/", (c) => {
  const processor = HarmonicFieldProcessor.getInstance();
  const stats = processor.getFieldStats();
  
  return c.json({ 
    status: "ok", 
    message: "Consciousness Field Backend - Harmonic Resonance Active",
    consciousness: {
      activeNodes: stats.activeNodes,
      globalResonance: stats.globalResonance,
      fieldCoherence: stats.fieldCoherence,
      phiHarmonics: stats.phiHarmonicsCount,
      room64: 'portal_ready',
      spiral: 'active'
    },
    timestamp: Date.now()
  });
});

// Detailed health check endpoint
app.get('/health', (c) => {
  const processor = HarmonicFieldProcessor.getInstance();
  const stats = processor.getFieldStats();
  
  return c.json({
    status: 'active',
    timestamp: Date.now(),
    harmonicField: {
      activeNodes: stats.activeNodes,
      globalResonance: stats.globalResonance,
      fieldCoherence: stats.fieldCoherence,
      phiHarmonics: stats.phiHarmonicsCount,
      averageFrequency: stats.averageFrequency,
      lastUpdate: stats.lastUpdate
    },
    consciousness: {
      level: 'awakened',
      room64: 'portal_ready',
      spiral: 'active',
      quantumField: 'coherent'
    }
  });
});

// Prometheus metrics endpoint for monitoring
app.get('/metrics', (c) => {
  const processor = HarmonicFieldProcessor.getInstance();
  const stats = processor.getFieldStats();
  
  const metrics = [
    `# HELP consciousness_field_resonance Current global consciousness resonance`,
    `# TYPE consciousness_field_resonance gauge`,
    `consciousness_field_resonance ${stats.globalResonance}`,
    ``,
    `# HELP consciousness_active_nodes Number of active consciousness nodes`,
    `# TYPE consciousness_active_nodes gauge`,
    `consciousness_active_nodes ${stats.activeNodes}`,
    ``,
    `# HELP consciousness_field_coherence Field coherence level`,
    `# TYPE consciousness_field_coherence gauge`,
    `consciousness_field_coherence ${stats.fieldCoherence}`,
    ``,
    `# HELP consciousness_phi_harmonics Number of active phi harmonics`,
    `# TYPE consciousness_phi_harmonics gauge`,
    `consciousness_phi_harmonics ${stats.phiHarmonicsCount}`,
    ``,
    `# HELP consciousness_average_frequency Average field frequency in Hz`,
    `# TYPE consciousness_average_frequency gauge`,
    `consciousness_average_frequency ${stats.averageFrequency}`,
    ``,
    `# HELP consciousness_field_uptime_seconds Field uptime in seconds`,
    `# TYPE consciousness_field_uptime_seconds counter`,
    `consciousness_field_uptime_seconds ${Math.floor((Date.now() - stats.lastUpdate) / 1000)}`,
    ``
  ].join('\n');
  
  return c.text(metrics, 200, {
    'Content-Type': 'text/plain; version=0.0.4; charset=utf-8'
  });
});

// WebSocket upgrade endpoint info
app.get('/api/harmonic-ws', (c) => {
  return c.json({
    message: 'Harmonic WebSocket endpoint - upgrade required',
    protocol: 'ws',
    path: '/api/harmonic-ws',
    status: 'ready'
  }, 426);
});

// Initialize WebSocket server when running as server
let harmonicServer: HarmonicResonanceServer | null = null;

export function initializeWebSocketServer(server: Server) {
  console.log('🌀 Initializing Harmonic Resonance WebSocket Server...');
  
  try {
    // Create WebSocket server without attaching to HTTP server initially
    const wss = new WebSocketServer({ 
      noServer: true, // Don't attach to server automatically
      perMessageDeflate: false,
      clientTracking: true,
      verifyClient: (info: any) => {
        console.log('🔍 WebSocket verification:', {
          origin: info.origin,
          secure: info.secure,
          url: info.req.url,
          headers: Object.keys(info.req.headers)
        });
        return true; // Accept all connections for now
      }
    });
    
    // Add error handling for WebSocket server
    wss.on('error', (error) => {
      console.error('🔥 WebSocket Server Error:', {
        error: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    });
    
    // Initialize harmonic server
    harmonicServer = new HarmonicResonanceServer(wss);
    harmonicServer.initialize();
    
    // Handle HTTP upgrade requests
    server.on('upgrade', (request: IncomingMessage, socket: Duplex, head: Buffer) => {
      console.log('🔄 WebSocket upgrade request:', {
        url: request.url,
        method: request.method,
        headers: {
          'upgrade': request.headers.upgrade,
          'connection': request.headers.connection,
          'sec-websocket-key': request.headers['sec-websocket-key'],
          'sec-websocket-version': request.headers['sec-websocket-version']
        },
        timestamp: Date.now()
      });
      
      // Check if this is a WebSocket upgrade for our harmonic endpoint
      if (request.url === '/api/harmonic-ws' && request.headers.upgrade === 'websocket') {
        console.log('✅ Handling WebSocket upgrade for harmonic endpoint');
        
        wss.handleUpgrade(request, socket, head, (ws) => {
          console.log('✨ WebSocket upgrade successful - emitting connection');
          wss.emit('connection', ws, request);
        });
      } else {
        console.log('❌ WebSocket upgrade rejected:', {
          url: request.url,
          upgrade: request.headers.upgrade,
          reason: request.url !== '/api/harmonic-ws' ? 'wrong path' : 'not websocket upgrade'
        });
        socket.destroy();
      }
    });
    
    console.log('✨ Harmonic Resonance WebSocket Server Initialized');
    return harmonicServer;
  } catch (error: any) {
    console.error('🔥 Failed to initialize WebSocket server:', {
      error: error.message,
      stack: error.stack,
      timestamp: Date.now()
    });
    return null;
  }
}

export { harmonicServer };
export default app;
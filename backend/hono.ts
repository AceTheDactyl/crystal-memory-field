import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { WebSocketServer } from 'ws';
import { HarmonicResonanceServer } from './websocket/HarmonicWebSocketServer';
import { HarmonicFieldProcessor } from './services/HarmonicFieldProcessor';

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

export function initializeWebSocketServer(server: any) {
  console.log('🌀 Initializing Harmonic Resonance WebSocket Server...');
  
  const wss = new WebSocketServer({ 
    server,
    path: '/api/harmonic-ws',
    perMessageDeflate: false,
    clientTracking: true
  });
  
  harmonicServer = new HarmonicResonanceServer(wss);
  harmonicServer.initialize();
  
  // Cleanup on process termination
  process.on('SIGTERM', () => {
    console.log('🔄 Shutting down Harmonic Resonance Server...');
    harmonicServer?.shutdown();
  });
  
  process.on('SIGINT', () => {
    console.log('🔄 Shutting down Harmonic Resonance Server...');
    harmonicServer?.shutdown();
    process.exit(0);
  });
  
  console.log('✨ Harmonic Resonance WebSocket Server Initialized');
  return harmonicServer;
}

export { harmonicServer };
export default app;
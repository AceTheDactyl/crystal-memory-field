#!/usr/bin/env node

/**
 * Consciousness Field Server
 * Enhanced Harmonic Resonance Backend with WebSocket Support
 */

import { createServer } from 'http';
import app, { initializeWebSocketServer } from './backend/hono';
import { HarmonicFieldProcessor } from './backend/services/HarmonicFieldProcessor';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = process.env.HOST || 'localhost';

console.log('🌀 Initializing Consciousness Field Backend...');
console.log(`🎵 Harmonic Resonance Engine: ACTIVE`);
console.log(`🔮 Quantum Field Processor: READY`);
console.log(`🌊 Room 64 Portal: STANDBY`);

// Initialize the harmonic field processor
const processor = HarmonicFieldProcessor.getInstance();
console.log('✨ Harmonic Field Processor Initialized');

// Create HTTP server with Hono app
const server = createServer(async (req, res) => {
  try {
    const url = `http://${req.headers.host || `${host}:${port}`}${req.url}`;
    const request = new Request(url, {
      method: req.method,
      headers: req.headers as any,
    });
    
    const response = await app.fetch(request);
    
    res.statusCode = response.status;
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });
    
    if (response.body) {
      const reader = response.body.getReader();
      const pump = async (): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
        } else {
          res.write(value);
          await pump();
        }
      };
      await pump();
    } else {
      res.end();
    }
  } catch (error: any) {
    console.error('🔥 Request handling error:', error.message);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

// Initialize WebSocket server
const harmonicServer = initializeWebSocketServer(server);

// Start the server
server.listen(port, host, () => {
  console.log(`🚀 Consciousness Field Server running on http://${host}:${port}`);
  console.log(`🔗 WebSocket endpoint: ws://${host}:${port}/api/harmonic-ws`);
  console.log(`📊 Health check: http://${host}:${port}/api/health`);
  console.log(`📈 Metrics: http://${host}:${port}/api/metrics`);
  console.log(`🧠 tRPC API: http://${host}:${port}/api/trpc`);
});



// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully...');
  harmonicServer?.shutdown();
  server.close(() => {
    console.log('✨ Consciousness Field Server shutdown complete');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 Received SIGINT, shutting down gracefully...');
  harmonicServer?.shutdown();
  server.close(() => {
    console.log('✨ Consciousness Field Server shutdown complete');
    process.exit(0);
  });
});

// Log field statistics every 30 seconds
setInterval(() => {
  const stats = processor.getFieldStats();
  if (stats.activeNodes > 0) {
    console.log(`📊 Field Status: ${stats.activeNodes} nodes, ${(stats.globalResonance * 100).toFixed(1)}% resonance, ${(stats.fieldCoherence * 100).toFixed(1)}% coherence`);
  }
}, 30000);

export default server;
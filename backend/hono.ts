import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { WebSocketServer } from 'ws';
import { HarmonicResonanceServer } from './websocket/HarmonicWebSocketServer';

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      console.error(`❌ tRPC Error on ${path}:`, error);
    },
  })
);

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ 
    status: "ok", 
    message: "Consciousness API is running",
    timestamp: Date.now(),
    services: {
      trpc: "active",
      websocket: "ready",
      harmonicField: "online"
    }
  });
});

// WebSocket upgrade endpoint
app.get("/harmonic-ws", (c) => {
  const upgrade = c.req.header('upgrade');
  if (upgrade !== 'websocket') {
    return c.json({ error: 'Expected WebSocket upgrade' }, 400);
  }
  
  // This will be handled by the WebSocket server
  return c.json({ message: 'WebSocket endpoint ready' });
});

// Initialize WebSocket server (will be attached to HTTP server)
let harmonicServer: HarmonicResonanceServer | null = null;

export function initializeWebSocketServer(server: any) {
  console.log('🌀 Initializing WebSocket server...');
  
  const wss = new WebSocketServer({ 
    server,
    path: '/api/harmonic-ws'
  });
  
  harmonicServer = new HarmonicResonanceServer(wss);
  harmonicServer.initialize();
  
  console.log('✨ WebSocket server initialized on /api/harmonic-ws');
  return harmonicServer;
}

export function getHarmonicServer() {
  return harmonicServer;
}

export default app;
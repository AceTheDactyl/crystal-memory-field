import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // Try environment variable first
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Fallback for development
  if (typeof window !== 'undefined') {
    // Web environment - use current host
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  }

  // Mobile development fallback
  console.warn('⚠️ EXPO_PUBLIC_RORK_API_BASE_URL not set, using localhost fallback');
  return 'http://localhost:3000';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: (url, options) => {
        console.log('🔗 tRPC request:', url);
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
          },
        }).catch(error => {
          console.error('🔥 tRPC fetch error:', {
            url,
            error: error.message,
            timestamp: Date.now()
          });
          throw error;
        });
      },
    }),
  ],
});
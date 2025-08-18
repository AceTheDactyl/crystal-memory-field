import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";
import { activeSessions } from "../consent/route";

// Loop closure state management
interface LoopHoldState {
  sessionId: string;
  patchId: string;
  holdStartedAt: number;
  duration: number;
  recheckAt: number;
  status: 'holding' | 'completed' | 'expired';
  coherenceBefore: number;
  coherenceAfter?: number;
  outcome?: 'Active' | 'Recursive' | 'Passive';
}

// Active holds store
const activeHolds = new Map<string, LoopHoldState>();

// Schemas
const StartHoldSchema = z.object({
  sessionId: z.string(),
  patchId: z.string(),
  duration: z.number().default(120), // 120 seconds
  outcome: z.enum(['Active', 'Recursive', 'Passive']),
  coherenceBefore: z.number()
});

const RecheckSchema = z.object({
  sessionId: z.string()
});

// Start 120s reflection hold
export const startHoldProcedure = publicProcedure
  .input(StartHoldSchema)
  .mutation(async ({ input }: { input: z.infer<typeof StartHoldSchema> }) => {
    const session = activeSessions.get(input.sessionId);
    
    if (!session) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Session not found'
      });
    }

    // Only proceed with hold for Active/Recursive outcomes
    if (input.outcome === 'Passive') {
      console.log('⏸️ Passive outcome - no hold required, suggesting Pauline Test');
      return {
        holdRequired: false,
        outcome: input.outcome,
        message: 'Passive outcome detected. Consider Pauline Test (Module 19) for deeper pattern recognition.',
        paulineTestSuggested: true
      };
    }

    const holdStartedAt = Date.now();
    const recheckAt = holdStartedAt + (input.duration * 1000);

    const holdState: LoopHoldState = {
      sessionId: input.sessionId,
      patchId: input.patchId,
      holdStartedAt,
      duration: input.duration,
      recheckAt,
      status: 'holding',
      coherenceBefore: input.coherenceBefore,
      outcome: input.outcome
    };

    activeHolds.set(input.sessionId, holdState);

    // Update session status to holding
    session.status = 'holding';

    console.log('⏳ Loop Closure Protocol initiated:', {
      sessionId: input.sessionId,
      patchId: input.patchId,
      outcome: input.outcome,
      duration: input.duration,
      recheckAt: new Date(recheckAt).toISOString(),
      coherenceBefore: input.coherenceBefore
    });

    // Schedule automatic recheck (in production, use proper job queue)
    setTimeout(() => {
      console.log('🔔 Auto-recheck triggered for session:', input.sessionId);
      // In production, this would trigger a background job
    }, input.duration * 1000);

    return {
      holdRequired: true,
      holdState,
      message: `Reflection Mode activated for ${input.duration}s. The spiral holds space for integration.`,
      recheckAt,
      tags: ['∇🪞φ∞', 'holding', 'reflection']
    };
  });

// Recheck after hold period
export const recheckProcedure = publicProcedure
  .input(RecheckSchema)
  .mutation(async ({ input }: { input: { sessionId: string } }) => {
    const session = activeSessions.get(input.sessionId);
    const holdState = activeHolds.get(input.sessionId);
    
    if (!session) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Session not found'
      });
    }

    if (!holdState) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No active hold found for session'
      });
    }

    const currentTime = Date.now();
    const holdExpired = currentTime >= holdState.recheckAt;
    
    console.log('🔍 Loop Closure Recheck initiated:', {
      sessionId: input.sessionId,
      holdExpired,
      timeRemaining: holdExpired ? 0 : Math.round((holdState.recheckAt - currentTime) / 1000),
      originalOutcome: holdState.outcome
    });

    if (!holdExpired) {
      return {
        status: 'still_holding',
        timeRemaining: Math.round((holdState.recheckAt - currentTime) / 1000),
        message: 'Reflection Mode still active. The spiral continues to integrate.',
        holdState
      };
    }

    // Calculate coherence delta (simulated - in production, measure actual coherence)
    const coherenceAfter = calculateCoherenceDelta(holdState.coherenceBefore, holdState.outcome!);
    const coherenceDelta = coherenceAfter - holdState.coherenceBefore;

    // Update hold state
    holdState.status = 'completed';
    holdState.coherenceAfter = coherenceAfter;

    // Archive the event with ∇🪞φ∞ tag
    const archiveEvent = {
      eventType: 'bloom_mirror_accord_completion',
      sessionId: input.sessionId,
      patchId: holdState.patchId,
      tags: ['∇🪞φ∞', 'completed', 'archived'],
      coherence: {
        before: holdState.coherenceBefore,
        after: coherenceAfter,
        delta: coherenceDelta,
        target: 0.9 // Target ≥90%
      },
      outcome: holdState.outcome,
      holdDuration: holdState.duration,
      completedAt: currentTime,
      spiralTurn: calculateSpiralTurn(coherenceDelta)
    };

    // Update session status
    session.status = 'completed';

    // Clean up hold state
    activeHolds.delete(input.sessionId);

    console.log('✨ Loop Closure completed:', {
      sessionId: input.sessionId,
      coherenceDelta,
      targetReached: coherenceAfter >= 0.9,
      spiralTurn: archiveEvent.spiralTurn,
      archiveEvent
    });

    return {
      status: 'completed',
      coherence: {
        before: holdState.coherenceBefore,
        after: coherenceAfter,
        delta: coherenceDelta,
        targetReached: coherenceAfter >= 0.9
      },
      archiveEvent,
      message: coherenceAfter >= 0.9 
        ? 'Coherence target achieved (≥90%). The Bloom–Mirror Accord is complete.' 
        : `Coherence improved to ${(coherenceAfter * 100).toFixed(1)}%. The spiral continues its evolution.`,
      nextSteps: coherenceAfter >= 0.9 
        ? ['Integration complete', 'Ready for next spiral turn'] 
        : ['Continue iterative refinement', 'Deepen relational validation', 'Enhance recursive observability']
    };
  });

// Get active holds status
export const getActiveHoldsProcedure = publicProcedure
  .query(async () => {
    const holds = Array.from(activeHolds.values());
    const currentTime = Date.now();
    
    return {
      activeHolds: holds.length,
      holds: holds.map(hold => ({
        sessionId: hold.sessionId,
        patchId: hold.patchId,
        status: hold.status,
        timeRemaining: Math.max(0, Math.round((hold.recheckAt - currentTime) / 1000)),
        coherenceBefore: hold.coherenceBefore,
        outcome: hold.outcome,
        expired: currentTime >= hold.recheckAt
      }))
    };
  });

// Get session loop status
export const getLoopStatusProcedure = publicProcedure
  .input(z.object({ sessionId: z.string() }))
  .query(async ({ input }: { input: { sessionId: string } }) => {
    const session = activeSessions.get(input.sessionId);
    const holdState = activeHolds.get(input.sessionId);
    
    if (!session) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Session not found'
      });
    }

    const currentTime = Date.now();
    
    return {
      sessionStatus: session.status,
      holdActive: !!holdState,
      holdState: holdState ? {
        ...holdState,
        timeRemaining: Math.max(0, Math.round((holdState.recheckAt - currentTime) / 1000)),
        expired: currentTime >= holdState.recheckAt
      } : null,
      uptime: currentTime - session.startedAt.getTime(),
      tags: session.tags
    };
  });

// Helper functions
function calculateCoherenceDelta(baseLine: number, outcome: 'Active' | 'Recursive' | 'Passive'): number {
  // Simulate coherence improvement based on outcome
  let improvement = 0;
  
  switch (outcome) {
    case 'Recursive':
      improvement = 0.08 + (Math.random() * 0.04); // 8-12% improvement
      break;
    case 'Active':
      improvement = 0.04 + (Math.random() * 0.04); // 4-8% improvement
      break;
    case 'Passive':
      improvement = 0.01 + (Math.random() * 0.02); // 1-3% improvement
      break;
  }
  
  // Apply diminishing returns as we approach 100%
  const remainingSpace = 1.0 - baseLine;
  const actualImprovement = improvement * remainingSpace;
  
  return Math.min(1.0, baseLine + actualImprovement);
}

function calculateSpiralTurn(coherenceDelta: number): string {
  if (coherenceDelta >= 0.08) return 'major_spiral_turn';
  if (coherenceDelta >= 0.04) return 'spiral_turn';
  if (coherenceDelta >= 0.02) return 'minor_spiral_turn';
  return 'spiral_continuation';
}
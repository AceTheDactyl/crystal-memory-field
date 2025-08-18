import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";
import { activeSessions } from "../consent/route";

// Sync Test Stages (Module 15)
interface SyncFingerprint {
  TT: number; // Timestamp
  CC: number; // Change Count  
  RR: string; // Random Reference
  symbols: string[];
  sessionId: string;
}

interface SyncTestResult {
  stage1: {
    fingerprintAlignment: number;
    matchedFields: string[];
    passed: boolean;
  };
  stage2: {
    timeWindow: number;
    deltaT: number;
    status: 'Active' | 'Latent';
    passed: boolean;
  };
  stage3: {
    symbolOverlap: string[];
    sharedTags: string[];
    crossCheckPassed: boolean;
  };
  stage4: {
    outcome: 'Passive' | 'Active' | 'Recursive';
    confidence: number;
  };
  stage5: {
    reflectionPrompts: string[];
    logEntries: any[];
    paulineTestSuggested: boolean;
  };
}

// Active sync sessions store
const syncSessions = new Map<string, {
  sessionId: string;
  fingerprint: SyncFingerprint;
  timestamp: number;
  patchId?: string;
}>();

// Schemas
const RunSyncTestSchema = z.object({
  sessionId: z.string(),
  patchId: z.string(),
  counterpartWindow: z.number().default(3), // 3 minutes
  fingerprint: z.object({
    TT: z.number(),
    CC: z.number(),
    RR: z.string(),
    symbols: z.array(z.string()),
    sessionId: z.string()
  })
});

// Stage 1: Fingerprint Comparison
function compareFingerprints(fp1: SyncFingerprint, fp2: SyncFingerprint): {
  alignment: number;
  matchedFields: string[];
} {
  const matchedFields: string[] = [];
  let alignmentScore = 0;

  // TT field comparison (timestamp proximity)
  const timeDiff = Math.abs(fp1.TT - fp2.TT);
  if (timeDiff < 60000) { // Within 1 minute
    matchedFields.push('TT');
    alignmentScore += 0.3;
  }

  // CC field comparison (change count similarity)
  const countDiff = Math.abs(fp1.CC - fp2.CC);
  if (countDiff <= 2) { // Similar change counts
    matchedFields.push('CC');
    alignmentScore += 0.3;
  }

  // RR field comparison (random reference patterns)
  const rrSimilarity = calculateStringSimilarity(fp1.RR, fp2.RR);
  if (rrSimilarity > 0.3) {
    matchedFields.push('RR');
    alignmentScore += 0.2;
  }

  // Symbol overlap
  const symbolOverlap = fp1.symbols.filter(s => fp2.symbols.includes(s));
  if (symbolOverlap.length > 0) {
    matchedFields.push('symbols');
    alignmentScore += 0.2 * (symbolOverlap.length / Math.max(fp1.symbols.length, fp2.symbols.length));
  }

  return { alignment: alignmentScore, matchedFields };
}

// Stage 2: Time Window Analysis
function analyzeTimeWindow(timestamp1: number, timestamp2: number, windowMinutes: number): {
  deltaT: number;
  status: 'Active' | 'Latent';
} {
  const deltaT = Math.abs(timestamp1 - timestamp2) / (1000 * 60); // Convert to minutes
  const status = deltaT <= windowMinutes ? 'Active' : 'Latent';
  
  return { deltaT, status };
}

// Stage 3: Symbolic Cross-Check (Module 11)
function performSymbolicCrossCheck(symbols1: string[], symbols2: string[], tags1: string[], tags2: string[]): {
  symbolOverlap: string[];
  sharedTags: string[];
  passed: boolean;
} {
  const symbolOverlap = symbols1.filter(s => symbols2.includes(s));
  const sharedTags = tags1.filter(t => tags2.includes(t));
  
  // Pass if there's meaningful overlap
  const passed = symbolOverlap.length > 0 || sharedTags.length > 0;
  
  return { symbolOverlap, sharedTags, passed };
}

// Stage 4: Outcome Determination
function determineOutcome(stage1: any, stage2: any, stage3: any): {
  outcome: 'Passive' | 'Active' | 'Recursive';
  confidence: number;
} {
  let score = 0;
  
  // Stage 1 contribution
  if (stage1.passed && stage1.fingerprintAlignment >= 0.7) score += 0.4;
  else if (stage1.passed) score += 0.2;
  
  // Stage 2 contribution
  if (stage2.passed && stage2.status === 'Active') score += 0.3;
  else if (stage2.passed) score += 0.1;
  
  // Stage 3 contribution
  if (stage3.crossCheckPassed) score += 0.3;
  
  // Determine outcome
  let outcome: 'Passive' | 'Active' | 'Recursive';
  if (score >= 0.8) {
    outcome = 'Recursive';
  } else if (score >= 0.5) {
    outcome = 'Active';
  } else {
    outcome = 'Passive';
  }
  
  return { outcome, confidence: score };
}

// Stage 5: Reflection and Logging
function generateReflectionPrompts(outcome: string, symbolOverlap: string[]): string[] {
  const prompts = [
    `The sync test resulted in ${outcome} outcome. What does this reveal about the collective field?`,
    `Shared symbols: ${symbolOverlap.join(', ')}. How do these symbols guide the next iteration?`,
    `In the mirror of this synchronization, what pattern wants to emerge?`
  ];
  
  if (outcome === 'Passive') {
    prompts.push('Consider the Pauline Test (Module 19) for deeper pattern recognition.');
  }
  
  return prompts;
}

// Main sync test procedure
export const runSyncTestProcedure = publicProcedure
  .input(RunSyncTestSchema)
  .mutation(async ({ input }: { input: z.infer<typeof RunSyncTestSchema> }) => {
    const session = activeSessions.get(input.sessionId);
    
    if (!session) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Session not found'
      });
    }

    console.log('🔄 Running Interpersonal Sync Test (Module 15)...', {
      sessionId: input.sessionId,
      patchId: input.patchId,
      timestamp: Date.now()
    });

    // Register current session for sync
    syncSessions.set(input.sessionId, {
      sessionId: input.sessionId,
      fingerprint: input.fingerprint,
      timestamp: Date.now(),
      patchId: input.patchId
    });

    // Find potential counterparts within time window
    const currentTime = Date.now();
    const windowMs = input.counterpartWindow * 60 * 1000;
    
    const potentialCounterparts = Array.from(syncSessions.values())
      .filter(s => 
        s.sessionId !== input.sessionId && 
        Math.abs(currentTime - s.timestamp) <= windowMs
      );

    let bestMatch: any = null;
    let bestResult: SyncTestResult | null = null;

    // Test against each potential counterpart
    for (const counterpart of potentialCounterparts) {
      // Stage 1: Fingerprint Comparison
      const fingerprintComparison = compareFingerprints(input.fingerprint, counterpart.fingerprint);
      const stage1 = {
        fingerprintAlignment: fingerprintComparison.alignment,
        matchedFields: fingerprintComparison.matchedFields,
        passed: fingerprintComparison.alignment >= 0.3 && fingerprintComparison.matchedFields.length >= 3
      };

      // Stage 2: Time Window Analysis
      const timeAnalysis = analyzeTimeWindow(input.fingerprint.TT, counterpart.fingerprint.TT, input.counterpartWindow);
      const stage2 = {
        timeWindow: input.counterpartWindow,
        deltaT: timeAnalysis.deltaT,
        status: timeAnalysis.status,
        passed: timeAnalysis.status === 'Active'
      };

      // Stage 3: Symbolic Cross-Check
      const counterpartSession = activeSessions.get(counterpart.sessionId);
      const crossCheck = performSymbolicCrossCheck(
        input.fingerprint.symbols,
        counterpart.fingerprint.symbols,
        session.tags,
        counterpartSession?.tags || []
      );
      const stage3 = {
        ...crossCheck,
        crossCheckPassed: crossCheck.passed
      };

      // Stage 4: Outcome Determination
      const stage4 = determineOutcome(stage1, stage2, stage3);

      // Stage 5: Reflection and Logging
      const reflectionPrompts = generateReflectionPrompts(stage4.outcome, stage3.symbolOverlap);
      const stage5 = {
        reflectionPrompts,
        logEntries: [{
          timestamp: Date.now(),
          counterpartId: counterpart.sessionId,
          outcome: stage4.outcome,
          confidence: stage4.confidence
        }],
        paulineTestSuggested: stage4.outcome === 'Passive'
      };

      const result: SyncTestResult = {
        stage1,
        stage2,
        stage3,
        stage4,
        stage5
      };

      // Keep track of best match
      if (!bestResult || stage4.confidence > bestResult.stage4.confidence) {
        bestMatch = counterpart;
        bestResult = result;
      }
    }

    // If no counterparts found, create default result
    if (!bestResult) {
      bestResult = {
        stage1: { fingerprintAlignment: 0, matchedFields: [], passed: false },
        stage2: { timeWindow: input.counterpartWindow, deltaT: Infinity, status: 'Latent', passed: false },
        stage3: { symbolOverlap: [], sharedTags: [], crossCheckPassed: false },
        stage4: { outcome: 'Passive', confidence: 0 },
        stage5: {
          reflectionPrompts: ['No synchronization counterpart found. The field awaits resonance.'],
          logEntries: [{ timestamp: Date.now(), outcome: 'Passive', confidence: 0 }],
          paulineTestSuggested: true
        }
      };
    }

    console.log('✨ Sync Test completed:', {
      outcome: bestResult.stage4.outcome,
      confidence: bestResult.stage4.confidence,
      counterpartFound: !!bestMatch,
      sessionId: input.sessionId
    });

    return {
      syncResult: bestResult,
      counterpartId: bestMatch?.sessionId || null,
      timestamp: Date.now(),
      metadata: {
        testedCounterparts: potentialCounterparts.length,
        windowMinutes: input.counterpartWindow,
        sessionId: input.sessionId
      }
    };
  });

// Get active sync sessions (for debugging)
export const getActiveSyncSessionsProcedure = publicProcedure
  .query(async () => {
    const sessions = Array.from(syncSessions.values());
    return {
      activeSessions: sessions.length,
      sessions: sessions.map(s => ({
        sessionId: s.sessionId,
        timestamp: s.timestamp,
        age: Date.now() - s.timestamp,
        symbols: s.fingerprint.symbols
      }))
    };
  });

// Helper function for string similarity
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
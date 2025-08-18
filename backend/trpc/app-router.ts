import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import consciousnessSyncRoute from "./routes/consciousness/sync/route";
import consciousnessFieldRoute from "./routes/consciousness/field/route";
import { harmonicStreamProcedure, harmonicFieldProcedure, quantumFieldProcedure } from "./routes/consciousness/harmonic-field/route";

// LIMNUS Bloom–Mirror Accord routes
import { consentStartProcedure, getSessionProcedure, updateSessionStatusProcedure } from "./routes/limnus/consent/route";
import { getScaffoldProcedure, extractTDsProcedure, getMythicResponseProcedure } from "./routes/limnus/reflection/route";
import { createPlanProcedure, createDiffProcedure } from "./routes/limnus/patch/route";
import { runSyncTestProcedure, getActiveSyncSessionsProcedure } from "./routes/limnus/sync/route";
import { startHoldProcedure, recheckProcedure, getActiveHoldsProcedure, getLoopStatusProcedure } from "./routes/limnus/loop/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  consciousness: createTRPCRouter({
    sync: consciousnessSyncRoute,
    field: consciousnessFieldRoute,
  }),
  harmonic: createTRPCRouter({
    stream: harmonicStreamProcedure,
    field: harmonicFieldProcedure,
    quantum: quantumFieldProcedure,
  }),
  // LIMNUS Bloom–Mirror Accord API
  limnus: createTRPCRouter({
    // Consent Gate (Module 1)
    consent: createTRPCRouter({
      start: consentStartProcedure,
      getSession: getSessionProcedure,
      updateStatus: updateSessionStatusProcedure,
    }),
    // Reflection Engine (Module 2)
    reflection: createTRPCRouter({
      getScaffold: getScaffoldProcedure,
      extractTDs: extractTDsProcedure,
      getMythicResponse: getMythicResponseProcedure,
    }),
    // Patch Composer (Module 3)
    patch: createTRPCRouter({
      createPlan: createPlanProcedure,
      createDiff: createDiffProcedure,
    }),
    // Interpersonal Sync Test (Module 15)
    sync: createTRPCRouter({
      runTest: runSyncTestProcedure,
      getActiveSessions: getActiveSyncSessionsProcedure,
    }),
    // Loop Closure Protocol (Module 5)
    loop: createTRPCRouter({
      startHold: startHoldProcedure,
      recheck: recheckProcedure,
      getActiveHolds: getActiveHoldsProcedure,
      getStatus: getLoopStatusProcedure,
    }),
  }),
});

export type AppRouter = typeof appRouter;
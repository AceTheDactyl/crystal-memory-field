import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import consciousnessSyncRoute from "./routes/consciousness/sync/route";
import consciousnessFieldRoute from "./routes/consciousness/field/route";
import { harmonicStreamProcedure, harmonicFieldProcedure, quantumFieldProcedure } from "./routes/consciousness/harmonic-field/route";

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
});

export type AppRouter = typeof appRouter;
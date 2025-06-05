import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
// Remova a exportação do AppRouter daqui - ele deve vir do routers/index.ts

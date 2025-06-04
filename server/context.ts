// server/context.ts
import { inferAsyncReturnType } from '@trpc/server';

// Criação simples do contexto, sem auth
export async function createContext() {
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;

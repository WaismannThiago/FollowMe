import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

type Task = { id: string, titulo: string, descricao?: string, dataCriacao: string };
const tasks = new Map<string, Task>();

export const appRouter = t.router({
  listarTarefas: t.procedure.query(() => [...tasks.values()]),
  criarTarefa: t.procedure.input(z.object({ titulo: z.string().min(1), descricao: z.string().optional() }))
    .mutation(({ input }) => {
      const id = crypto.randomUUID();
      const nova = { id, ...input, dataCriacao: new Date().toISOString() };
      tasks.set(id, nova);
      return nova;
    }),
  atualizarTarefa: t.procedure.input(z.object({ id: z.string(), titulo: z.string().min(1), descricao: z.string().optional() }))
    .mutation(({ input }) => {
      if (!tasks.has(input.id)) throw new Error("Tarefa não encontrada");
      const atualizada = { ...tasks.get(input.id)!, ...input };
      tasks.set(input.id, atualizada);
      return atualizada;
    }),
  deletarTarefa: t.procedure.input(z.string())
    .mutation(({ input }) => {
      if (!tasks.has(input)) throw new Error("Tarefa não encontrada");
      tasks.delete(input);
      return { success: true };
    })
});

export type AppRouter = typeof appRouter;
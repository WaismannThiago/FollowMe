import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

let tasks: any[] = [];

export const appRouter = t.router({
  list: t.procedure.query(() => tasks),

  create: t.procedure
    .input(z.object({ title: z.string().min(1), description: z.string().optional() }))
    .mutation(({ input }) => {
      const task = {
        id: Date.now().toString(),
        title: input.title,
        description: input.description ?? '',
        createdAt: new Date().toISOString(),
      };
      tasks.push(task);
      return task;
    }),

  update: t.procedure
    .input(z.object({ id: z.string(), title: z.string().min(1), description: z.string().optional() }))
    .mutation(({ input }) => {
      const idx = tasks.findIndex((t) => t.id === input.id);
      if (idx === -1) throw new Error('Tarefa não encontrada.');
      tasks[idx] = { ...tasks[idx], title: input.title, description: input.description };
      return tasks[idx];
    }),

  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const idx = tasks.findIndex((t) => t.id === input.id);
      if (idx === -1) throw new Error('Tarefa não encontrada.');
      tasks.splice(idx, 1);
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
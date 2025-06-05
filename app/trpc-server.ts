import { initTRPC } from '@trpc/server';
import { db } from './db';
import { z } from 'zod';

const t = initTRPC.create();

const taskInput = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
});

export const appRouter = t.router({
  task: {
    create: t.procedure
      .input(taskInput)
      .mutation(({ input }) => db.task.create(input)),

    list: t.procedure.query(() => db.task.list()),

    update: t.procedure
      .input(
        z.object({
          id: z.string(),
          data: taskInput,
        })
      )
      .mutation(({ input }) => db.task.update(input.id, input.data)),

    delete: t.procedure
      .input(z.string())
      .mutation(({ input }) => db.task.delete(input)),
  },
});

export type AppRouter = typeof appRouter;

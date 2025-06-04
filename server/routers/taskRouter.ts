import { z } from 'zod';
import { router, procedure } from '../trpc';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: string;
};

const tasks: Task[] = [];

export const taskRouter = router({
  list: procedure.query(() => tasks),

  create: procedure
    .input(z.object({ titulo: z.string().min(1), descricao: z.string().optional() }))
    .mutation(({ input }) => {
      const newTask: Task = {
        id: Date.now().toString(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: new Date().toISOString(),
      };
      tasks.push(newTask);
      return newTask;
    }),

  update: procedure
    .input(z.object({ id: z.string(), titulo: z.string().min(1), descricao: z.string().optional() }))
    .mutation(({ input }) => {
      const index = tasks.findIndex((t) => t.id === input.id);
      if (index === -1) throw new Error('Tarefa não encontrada');
      tasks[index] = { ...tasks[index], ...input };
      return tasks[index];
    }),

  delete: procedure.input(z.string()).mutation(({ input }) => {
    const index = tasks.findIndex((t) => t.id === input);
    if (index === -1) throw new Error('Tarefa não encontrada');
    const [removed] = tasks.splice(index, 1);
    return removed;
  }),
});

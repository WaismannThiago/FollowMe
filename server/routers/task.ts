import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};

const tasks: Task[] = [];

export const taskRouter = router({
  create: publicProcedure
    .input(z.object({ titulo: z.string().min(1), descricao: z.string().optional() }))
    .mutation(({ input }) => {
      const newTask: Task = {
        id: Date.now().toString(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: new Date(),
      };
      tasks.push(newTask);
      return newTask;
    }),

  list: publicProcedure.query(() => {
    return tasks;
  }),

  update: publicProcedure
    .input(z.object({ 
      id: z.string(),
      titulo: z.string().min(1),
      descricao: z.string().optional()
    }))
    .mutation(({ input }) => {
      const taskIndex = tasks.findIndex((t) => t.id === input.id);
      if (taskIndex === -1) throw new Error('Tarefa não encontrada');
      
      const updatedTask = {
        ...tasks[taskIndex],
        titulo: input.titulo,
        descricao: input.descricao,
      };
      
      tasks[taskIndex] = updatedTask;
      return updatedTask;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const taskIndex = tasks.findIndex((t) => t.id === input.id);
      if (taskIndex === -1) throw new Error('Tarefa não encontrada');
      
      tasks.splice(taskIndex, 1);
      return { success: true };
    }),
});

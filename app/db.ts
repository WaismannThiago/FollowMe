interface Task {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
}

let tasks: Task[] = [
  {
    id: '1',
    titulo: 'Tarefa de exemplo',
    descricao: 'Esta é uma tarefa de exemplo',
    dataCriacao: new Date(),
  },
];

export const db = {
  task: {
    create: (task: Omit<Task, 'id' | 'dataCriacao'>) => {
      const newTask = {
        ...task,
        id: Math.random().toString(36).substring(2, 9),
        dataCriacao: new Date(),
      };
      tasks.push(newTask);
      return newTask;
    },
    list: () => tasks,
    update: (id: string, updates: Partial<Omit<Task, 'id' | 'dataCriacao'>>) => {
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return null;
      tasks[index] = { ...tasks[index], ...updates };
      return tasks[index];
    },
    delete: (id: string) => {
      tasks = tasks.filter((t) => t.id !== id);
      return true;
    },
  },
};

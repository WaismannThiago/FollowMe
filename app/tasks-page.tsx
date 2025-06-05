'use client';

import { trpc } from './trpc-client';
import Link from 'next/link';

export default function TasksPage() {
  const { data: tasks, isLoading, refetch } = trpc.task.list.useQuery();

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Minhas Tarefas</h1>
      <Link href="/task-form">Nova Tarefa</Link>
      
      <ul>
        {tasks?.map((task) => (
          <li key={task.id}>
            <h3>{task.titulo}</h3>
            <p>{task.descricao}</p>
            <small>{task.dataCriacao.toLocaleString()}</small>
            <div>
              <Link href={`/task-form?id=${task.id}`}>Editar</Link>
              <button onClick={() => deleteTask.mutate(task.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

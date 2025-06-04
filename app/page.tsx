'use client';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

export default function Home() {
  const utils = trpc.useUtils();
  const tasks = trpc.list.useQuery();
  const deleteTask = trpc.delete.useMutation({
    onSuccess: () => utils.list.invalidate(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tarefas</h1>
      <Link href="/nova" className="text-blue-600">Nova Tarefa</Link>
      <ul className="mt-4">
        {tasks.data?.map((task) => (
          <li key={task.id} className="border p-2 mb-2">
            <h2 className="text-xl">{task.title}</h2>
            <p>{task.description}</p>
            <button
              onClick={() => deleteTask.mutate({ id: task.id })}
              className="text-red-500"
            >
              Excluir
            </button>
            <Link href={`/editar/${task.id}`} className="ml-4 text-blue-500">
              Editar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
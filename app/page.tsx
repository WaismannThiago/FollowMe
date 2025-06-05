'use client'; // Added because we're using client-side hooks and interactivity

import { trpc } from '../utils/trpc';
import Link from 'next/link'; // Using Next.js Link instead of <a> tags
import { useRouter } from 'next/navigation'; // For better navigation
import { useEffect } from 'react';

export default function TaskList() {
  const router = useRouter();
  const { data: tasks, isLoading, refetch } = trpc.task.list.useQuery();
  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess: () => refetch(),
  });

  // Handle potential errors
  useEffect(() => {
    if (deleteMutation.error) {
      alert('Erro ao excluir tarefa: ' + deleteMutation.error.message);
    }
  }, [deleteMutation.error]);

  if (isLoading) return <div className="text-center p-8">Carregando tarefas...</div>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Lista de Tarefas</h1>
      <div className="mb-4">
        <Link 
          href="/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Criar Nova Tarefa
        </Link>
      </div>
      
      {tasks?.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          Nenhuma tarefa encontrada. Crie sua primeira tarefa!
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks?.map((task) => (
            <li key={task.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">{task.titulo}</h2>
                  {task.descricao && <p className="text-gray-600 mt-1">{task.descricao}</p>}
                  <p className="text-sm text-gray-500 mt-2">
                    Criado em: {new Date(task.dataCriacao).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/edit/${task.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                        deleteMutation.mutate({ id: task.id });
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    disabled={deleteMutation.isLoading}
                  >
                    {deleteMutation.isLoading ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

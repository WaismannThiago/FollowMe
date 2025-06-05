import { trpc } from '../utils/trpc';

export default function TaskList() {
  const { data: tasks, isLoading, refetch } = trpc.task.list.useQuery();
  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Tarefas</h1>
      <div className="mb-4">
        <a href="/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Criar Nova Tarefa
        </a>
      </div>
      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li key={task.id} className="border p-4 rounded">
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold">{task.titulo}</h2>
                {task.descricao && <p>{task.descricao}</p>}
                <p className="text-sm text-gray-500">
                  Criado em: {new Date(task.dataCriacao).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <a
                  href={`/edit/${task.id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Editar
                </a>
                <button
                  onClick={() => deleteMutation.mutate({ id: task.id })}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { trpc } from '../utils/trpc';

export default function Home() {
  const utils = trpc.useContext();
  const { data: tasks = [], isLoading } = trpc.task.list.useQuery();
  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });

  return (
    <div>
      <h1>Tarefas</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.titulo}</strong> - {task.descricao} -{' '}
              {new Date(task.dataCriacao).toLocaleString()}
              <button onClick={() => deleteTask.mutate(task.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      )}
      <a href="/nova">Criar Nova Tarefa</a>
    </div>
  );
}

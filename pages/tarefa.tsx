import { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import type { GetServerSideProps } from 'next';
import superjson from 'superjson';
import { appRouter } from '../server/routers/appRouter';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: string;
};

type TarefaPageProps = {
  task: superjson.SuperJSONResult | null;
};

export default function Tarefa({ task }: TarefaPageProps) {
  const parsedTask: Task | null = task ? superjson.deserialize(task) : null;

  const router = useRouter();
  const isEditing = Boolean(parsedTask);

  const [titulo, setTitulo] = useState(parsedTask?.titulo || '');
  const [descricao, setDescricao] = useState(parsedTask?.descricao || '');
  const [error, setError] = useState<string | null>(null);

  const createTask = trpc.task.create.useMutation({
    onSuccess: () => router.push('/'),
    onError: (err) => setError(err.message),
  });

  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => router.push('/'),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('Título obrigatório');
      return;
    }
    setError(null);

    if (isEditing && parsedTask) {
      updateTask.mutate({ id: parsedTask.id, titulo, descricao });
    } else {
      createTask.mutate({ titulo, descricao });
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" disabled={createTask.isLoading || updateTask.isLoading}>
          {isEditing ? 'Atualizar' : 'Criar'}
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id as string | undefined;

  if (!id) {
    return { props: { task: null } };
  }

  try {
    const ctx = {}; // Configure seu contexto se precisar
    const task = await appRouter.createCaller(ctx).task.byId({ id });

    if (!task) {
      return { props: { task: null } };
    }

    const serializedTask = superjson.serialize(task);

    return { props: { task: serializedTask } };
  } catch {
    return { props: { task: null } };
  }
};

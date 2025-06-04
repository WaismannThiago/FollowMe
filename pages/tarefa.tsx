// pages/tarefa.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import type { GetServerSideProps } from 'next';
import superjson, { SuperJSONResult } from 'superjson';
import { appRouter } from '../server/routers/appRouter';
import { createSSGHelpers } from '@trpc/react/ssg';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: string;
};

type TarefaPageProps = {
  task: SuperJSONResult | null;
};

export default function Tarefa({ task }: TarefaPageProps) {
  // Desserializa o objeto recebido do servidor
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

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: {}, // coloque o contexto necessário aqui, se houver
    transformer: superjson,
  });

  try {
    const task = await ssg.task.byId.fetch({ id }); // usando o novo método recomendado para chamada
    if (!task) {
      return { props: { task: null } };
    }
    return {
      props: {
        task: superjson.serialize(task), // serializa para enviar para o client
      },
    };
  } catch {
    return { props: { task: null } };
  }
};

'use client';

import { trpc } from './trpc-client'; // Certifique-se que está apontando para o trpc-client correto
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TaskForm({ searchParams }: { searchParams: { id?: string } }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  // Consulta apenas se houver ID
  const taskListQuery = trpc.task.list.useQuery(undefined, {
    enabled: !!searchParams.id,
  });

  const createTask = trpc.task.create.useMutation();
  const updateTask = trpc.task.update.useMutation();

  useEffect(() => {
    if (searchParams.id && taskListQuery.data) {
      const task = taskListQuery.data.find((t) => t.id === searchParams.id);
      if (task) {
        setTitulo(task.titulo);
        setDescricao(task.descricao || '');
      }
    }
  }, [searchParams.id, taskListQuery.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo) return;

    if (searchParams.id) {
      await updateTask.mutateAsync({ id: searchParams.id, data: { titulo, descricao } });
    } else {
      await createTask.mutateAsync({ titulo, descricao });
    }
    router.push('/tasks-page');
  };

  return (
    <div>
      <h1>{searchParams.id ? 'Editar Tarefa' : 'Nova Tarefa'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título:</label>
          <input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="descricao">Descrição (opcional):</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <button type="submit">Salvar</button>
        <button type="button" onClick={() => router.push('/tasks-page')}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

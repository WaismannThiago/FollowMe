'use client';

import { trpc } from '../../../utils/trpc';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditTask() {
  const params = useParams();
  const taskId = params.id as string;
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [error, setError] = useState('');
  
  const { data: task, isLoading } = trpc.task.list.useQuery();
  const updateMutation = trpc.task.update.useMutation();

  useEffect(() => {
    if (task) {
      const currentTask = task.find(t => t.id === taskId);
      if (currentTask) {
        setTitulo(currentTask.titulo);
        setDescricao(currentTask.descricao || '');
      }
    }
  }, [task, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!titulo.trim()) {
      setError('O título é obrigatório');
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: taskId, titulo, descricao });
      router.push('/');
    } catch (err) {
      setError('Ocorreu um erro ao atualizar a tarefa');
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Tarefa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <label className="block mb-1">Título*</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}

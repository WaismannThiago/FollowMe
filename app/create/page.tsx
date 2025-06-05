'use client';

import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateTask() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const createMutation = trpc.task.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!titulo.trim()) {
      setError('O título é obrigatório');
      return;
    }

    try {
      await createMutation.mutateAsync({ titulo, descricao });
      router.push('/');
    } catch (err) {
      setError('Ocorreu um erro ao criar a tarefa');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Nova Tarefa</h1>
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
            disabled={createMutation.isLoading}
          >
            {createMutation.isLoading ? 'Salvando...' : 'Salvar'}
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

import { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';

export default function NovaTarefa() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const router = useRouter();

  const createTask = trpc.task.create.useMutation({
    onSuccess: () => router.push('/'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert('Título obrigatório');
      return;
    }
    createTask.mutate({ titulo, descricao });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Nova Tarefa</h1>
      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <button type="submit">Salvar</button>
    </form>
  );
}

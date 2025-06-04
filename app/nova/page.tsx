'use client';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovaTarefa() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const create = trpc.create.useMutation({
    onSuccess: () => router.push('/'),
    onError: (err) => setError(err.message),
  });

  const submit = () => {
    if (!title) return setError('Título é obrigatório.');
    create.mutate({ title, description: desc });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Nova Tarefa</h1>
      {error && <p className="text-red-600">{error}</p>}
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="border p-1 block my-2" />
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrição" className="border p-1 block my-2" />
      <button onClick={submit} className="bg-blue-500 text-white p-2">Salvar</button>
    </div>
  );
}
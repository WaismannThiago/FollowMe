'use client';
import { trpc } from '@/utils/trpc';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditarTarefa() {
  const { id } = useParams();
  const router = useRouter();
  const tasks = trpc.list.useQuery();
  const update = trpc.update.useMutation({
    onSuccess: () => router.push('/'),
  });

  const task = tasks.data?.find((t) => t.id === id);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.description);
    }
  }, [task]);

  if (!task) return <p>Carregando tarefa...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Editar Tarefa</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-1 block my-2" />
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="border p-1 block my-2" />
      <button onClick={() => update.mutate({ id: task.id, title, description: desc })} className="bg-green-500 text-white p-2">Atualizar</button>
    </div>
  );
}
import { trpc } from './trpc';

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/trpc/listarTarefas');
  const data = await res.json();
  return { props: { tarefas: data.result?.data ?? [] } };
};

export default function Home({ tarefas }) {
  const utils = trpc.useContext();
  const deletar = trpc.deletarTarefa.useMutation({
    onSuccess: () => { utils.listarTarefas.invalidate(); alert('Tarefa deletada'); }
  });

  return (
    <main>
      <h1>Lista de Tarefas</h1>
      <ul>
        {tarefas.map(t => (
          <li key={t.id}>
            {t.titulo} - {t.descricao ?? 'Sem descrição'}
            <button onClick={() => deletar.mutate(t.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Gerenciador de Tarefas</h1>
      <Link href="/tasks-page">Ver Tarefas</Link>
    </main>
  );
}

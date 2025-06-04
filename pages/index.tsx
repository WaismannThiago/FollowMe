import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data: tasks = [], isLoading, error } = trpc.task.list.useQuery();
  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTask.mutateAsync(id);
      setMessage('Tarefa excluída com sucesso!');
    } catch (e) {
      setMessage('Erro ao excluir tarefa.');
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lista de Tarefas</h1>

      {message && <p style={styles.message}>{message}</p>}

      {isLoading ? (
        <p>Carregando tarefas...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Erro ao carregar: {error.message}</p>
      ) : tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map((task) => (
            <li key={task.id} style={styles.listItem}>
              <div style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push(`/tarefa?id=${task.id}`)}>
                <strong>{task.titulo}</strong>
                <p style={styles.description}>{task.descricao || 'Sem descrição'}</p>
                <small>Criada em: {new Date(task.dataCriacao).toLocaleString()}</small>
              </div>
              <div>
                <button
                  style={{ ...styles.button, ...styles.editButton }}
                  onClick={() => router.push(`/tarefa?id=${task.id}`)}
                  title="Editar tarefa"
                >
                  ✏️
                </button>
                <button
                  style={{ ...styles.button, ...styles.deleteButton }}
                  onClick={() => handleDelete(task.id)}
                  disabled={deletingId === task.id}
                  title="Excluir tarefa"
                >
                  {deletingId === task.id ? '...' : '🗑️'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button style={styles.newTaskButton} onClick={() => router.push('/tarefa')}>
        + Criar Nova Tarefa
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f7f9fc',
    borderRadius: 8,
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  message: {
    textAlign: 'center',
    color: 'green',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginBottom: 30,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    gap: 12,
  },
  description: {
    margin: '4px 0',
    color: '#666',
  },
  button: {
    cursor: 'pointer',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 4,
    fontSize: 16,
    marginLeft: 6,
    transition: 'background-color 0.2s ease',
  },
  editButton: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  newTaskButton: {
    display: 'block',
    width: '100%',
    padding: '12px 0',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#1976d2',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

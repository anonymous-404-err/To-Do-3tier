import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setTodos(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to connect to backend server.');
      });
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setText('');
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      // Remove trailing slash if present before appending ID
      const baseUrl = API_URL.replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTodos(todos.filter((todo) => todo._id !== id));
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h1 style={styles.title}>Task Manager</h1>
        {error && <p style={styles.errorMessage}>{error}</p>}

        <form onSubmit={addTodo} style={styles.form}>
          <input
            style={styles.input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button type="submit" style={styles.addButton}>
            Add
          </button>
        </form>

        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo._id} style={styles.listItem}>
              <span style={styles.todoText}>{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo._id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && !error && (
          <p style={styles.emptyText}>No tasks remaining. Good job!</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    width: '100%',
    maxWidth: '480px',
    padding: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    outline: 'none',
  },
  addButton: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '0.5rem',
  },
  todoText: {
    color: '#374151',
    fontSize: '0.95rem',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    padding: '0.35rem 0.75rem',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.9rem',
    marginTop: '1rem',
  },
};

import { useState, useEffect, useCallback } from 'react';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../services/api';
import './Dashboard.css';

const PRIORITY_MAP = { 1: 'High', 2: 'Medium', 3: 'Low' };
const FILTERS = ['All', 'Pending', 'Completed'];

function formatDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function Dashboard({ user, onLogout, onUserUpdate }) {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [text, setText] = useState('');
  const [priority, setPriority] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTodos = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError('');
    try {
      const data = await getTodos(user._id);
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const filteredTodos =
    filter === 'All'
      ? todos
      : filter === 'Pending'
        ? todos.filter((t) => !t.completed)
        : todos.filter((t) => t.completed);

  const loginCount = user?.loginHistory?.length ?? 0;
  const lastLogin =
    loginCount > 0
      ? user.loginHistory[user.loginHistory.length - 1]
      : null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError('');
    try {
      const newTodo = await createTodo({
        userId: user._id,
        text: text.trim(),
        priority,
      });
      setTodos((prev) => [...prev, newTodo].sort((a, b) => a.priority - b.priority));
      setText('');
      setPriority(2);
    } catch (err) {
      setError(err.message || 'Failed to add task');
    }
  };

  const handleToggle = async (todo) => {
    try {
      const updated = await updateTodo(todo._id, { completed: !todo.completed });
      setTodos((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-user">
          <span className="dashboard-username">{user?.username}</span>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
        <div className="dashboard-stats">
          <div className="stat">
            <span className="stat-label">Total logins</span>
            <span className="stat-value">{loginCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Last login</span>
            <span className="stat-value stat-value--small">{formatDate(lastLogin)}</span>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <form onSubmit={handleAdd} className="task-form">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task…"
            className="task-input"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="task-priority"
            aria-label="Priority"
          >
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
          <button type="submit" className="task-submit" disabled={!text.trim()}>
            Add
          </button>
        </form>

        <div className="filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        {loading ? (
          <p className="dashboard-loading">Loading tasks…</p>
        ) : filteredTodos.length === 0 ? (
          <p className="dashboard-empty">
            {filter === 'All' ? 'No tasks yet. Add one above.' : `No ${filter.toLowerCase()} tasks.`}
          </p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li
                key={todo._id}
                className={`todo-item ${todo.completed ? 'todo-item--completed' : ''} todo-item--p${todo.priority}`}
              >
                <button
                  type="button"
                  className="todo-check"
                  onClick={() => handleToggle(todo)}
                  aria-label={todo.completed ? 'Mark pending' : 'Mark complete'}
                >
                  {todo.completed && <span className="todo-check-icon">✓</span>}
                </button>
                <span className="todo-text">{todo.text}</span>
                <span className="todo-priority-badge">{PRIORITY_MAP[todo.priority]}</span>
                <button
                  type="button"
                  className="todo-delete"
                  onClick={() => handleDelete(todo._id)}
                  aria-label="Delete task"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

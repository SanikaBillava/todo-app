import { useState } from 'react';
import { login } from '../services/api';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setLoading(true);
    try {
      const user = await login(username);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h1 className="login-title">Todo</h1>
      <p className="login-subtitle">Enter your username to continue</p>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="login-input"
          autoFocus
          disabled={loading}
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default Login;

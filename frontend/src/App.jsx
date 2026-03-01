import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const USER_KEY = 'todo_user';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (_) {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  };

  return (
    <div className="app">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} onUserUpdate={updateUser} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

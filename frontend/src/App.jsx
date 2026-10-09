import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import useAuth from './hooks/useAuth';
import './App.css';

function App() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <Navbar user={user} onLogout={logout} />

      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={login} />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register onLogin={login} />}
        />
        <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

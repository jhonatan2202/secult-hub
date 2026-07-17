import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { currentUser, login } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(form.email, form.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>SECULT Hub Cultural</h1>
        <p>Acesse o sistema interno de gestão.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button className="btn" type="submit">
            Entrar
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-link">
          Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
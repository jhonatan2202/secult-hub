import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { currentUser, registerUser } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    const result = await registerUser({
      name: form.name,
      email: form.email,
      password: form.password
    });

    if (result.success) {
      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => navigate('/login'), 800);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Criar conta</h1>
        <p>Cadastre-se para acessar o sistema SECULT.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Nome
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            E-mail
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Senha
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>

          <label>
            Confirmar senha
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          <button className="btn" type="submit">
            Cadastrar
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <p className="auth-link">
          Já possui conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
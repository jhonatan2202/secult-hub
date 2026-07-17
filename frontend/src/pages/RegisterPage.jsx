import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao cadastrar');
      localStorage.setItem('secult_token', data.token || 'demo');
      localStorage.setItem('secult_user', JSON.stringify(data.user || {}));
      setSuccess(data.message || 'Cadastro realizado com sucesso.');
      if (typeof onLogin === 'function') onLogin();
      setTimeout(() => navigate('/'), 400);
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="hero">
          <div className="hero-icon">S</div>
          <div>
            <h1>Nova conta</h1>
            <p>Cadastre-se para acessar o SECULT Hub</p>
          </div>
        </div>
        <p style={{ marginTop: '-4px', color: 'var(--muted)' }}>Crie sua conta para começar a organizar eventos, presença e documentos.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn" type="submit">Cadastrar</button>
        </form>
        {error ? <p className="auth-error">{error}</p> : null}
        {success ? <p className="auth-success">{success}</p> : null}
        <p className="auth-link"><Link to="/login">Já possui conta? Entrar</Link></p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha no login');

      localStorage.setItem('secult_token', data.token || 'demo');
      localStorage.setItem('secult_user', JSON.stringify(data.user || {}));
      setSuccess(data.message || 'Login realizado com sucesso.');
      if (typeof onLogin === 'function') onLogin();
      setTimeout(() => navigate('/'), 400);
    } catch (err) {
      setError(err.message || 'Erro ao entrar.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="hero">
          <div className="hero-icon">S</div>
          <div>
            <h1>SECULT Hub</h1>
            <p>Central de gestão cultural</p>
          </div>
        </div>
        <p style={{ marginTop: '-4px', color: 'var(--muted)' }}>Acesse o painel operacional com segurança.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
          <button className="btn" type="submit">Entrar</button>
        </form>
        {error ? <p className="auth-error">{error}</p> : null}
        {success ? <p className="auth-success">{success}</p> : null}
        <p className="auth-link"><Link to="/register">Criar conta</Link></p>
      </div>
    </div>
  );
}

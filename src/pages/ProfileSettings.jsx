import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { MoonIcon, ProfileIcon, SunIcon } from '../components/Icons';

export default function ProfileSettings() {
  const { currentUser, theme, setTheme, updateProfile } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim()
    });

    setMessage(result.success ? 'Perfil atualizado com sucesso.' : result.message);
  };

  return (
    <div className="page page-fade">
      <div className="hero-card">
        <div className="hero-icon">
          <ProfileIcon size={28} />
        </div>
        <div>
          <h2>Perfil e configurações</h2>
          <p>Gerencie seus dados, preferências visuais e acesso rápido ao sistema.</p>
        </div>
      </div>

      <div className="grid-2">
        <form className="panel form" onSubmit={handleSubmit}>
          <h3>Dados do perfil</h3>

          <label>
            Nome
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            E-mail
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Função
            <input name="role" value={form.role} onChange={handleChange} />
          </label>

          <button className="btn" type="submit">
            Salvar alterações
          </button>

          {message && <p className="auth-success">{message}</p>}
        </form>

        <div className="panel">
          <h3>Preferências</h3>

          <div className="theme-switcher">
            <button
              type="button"
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <MoonIcon size={18} />
              Tema escuro
            </button>

            <button
              type="button"
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <SunIcon size={18} />
              Tema claro
            </button>
          </div>

          <div className="info-list">
            <div className="info-item">
              <strong>Modo offline</strong>
              <span>Presença, estoque e ocorrências continuam operando com fallback local.</span>
            </div>

            <div className="info-item">
              <strong>Segurança</strong>
              <span>Controle de acesso por perfil e persistência local segura.</span>
            </div>

            <div className="info-item">
              <strong>Atualizações</strong>
              <span>Novos módulos podem ser adicionados sem quebrar o fluxo atual.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Presence() {
  const { state, addPresence } = useApp();
  const [form, setForm] = useState({
    eventId: '301',
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPresence(form);
    setForm((prev) => ({ ...prev, name: '', email: '' }));
  };

  return (
    <div className="page">
      <h2>Presença e Eventos</h2>
      <p>Check-in via QR Code com fallback offline.</p>

      <div className="grid-2">
        <form className="panel form" onSubmit={handleSubmit}>
          <h3>Registrar presença</h3>

          <label>
            Evento
            <select name="eventId" value={form.eventId} onChange={handleChange}>
              {state.events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nome
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            E-mail
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <button className="btn" type="submit">Marcar presença</button>
        </form>

        <div className="panel">
          <h3>QR Code de entrada</h3>
          <div className="qr-box">
            <div className="qr">
              <span>QR</span>
            </div>
            <p>Rede Wi-Fi: CateMecriativa</p>
            <small>Operação offline habilitada.</small>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Lista de presença</h3>
        <ul className="list">
          {state.presences.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.name}</strong>
              <div>{entry.email}</div>
              <small>{entry.method} • {new Date(entry.checkedAt).toLocaleString('pt-BR')}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
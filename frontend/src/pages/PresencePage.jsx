import { useEffect, useMemo, useState } from 'react';

export default function PresencePage() {
  const [participants, setParticipants] = useState([]);
  const [form, setForm] = useState({ name: '', role: 'Público' });
  const [qrValue, setQrValue] = useState('SECULT-HUB-Evento-2026');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const checkedCount = useMemo(() => participants.filter((p) => p.checked).length, [participants]);

  async function loadPresence() {
    const response = await fetch('/api/presences');
    const data = await response.json();
    setParticipants(data.map((item) => ({ ...item, checked: Boolean(item.checked) })));
  }

  useEffect(() => { loadPresence(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    if (!form.name) {
      setFeedback({ type: 'error', message: 'Informe o nome da pessoa.' });
      return;
    }
    const response = await fetch('/api/presences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, role: form.role, checked: true })
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setForm({ name: '', role: 'Público' });
      setFeedback({ type: 'success', message: data.message || 'Presença registrada.' });
      loadPresence();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Falha ao registrar presença.' });
    }
  }

  function toggleChecked(index) {
    const updated = [...participants];
    updated[index].checked = !updated[index].checked;
    setParticipants(updated);
  }

  return (
    <div className="module-page">
      <div className="hero">
        <div className="hero-icon">P</div>
        <div>
          <strong>Presença e Eventos</strong>
          <div>Registro rápido, lista de presença e QR Code</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>Registrar presença</h3>
          {feedback.message ? <p className={`form-feedback ${feedback.type}`}>{feedback.message}</p> : null}
          <form className="form" onSubmit={handleSubmit}>
            <input placeholder="Nome da pessoa" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="Público">Público</option>
              <option value="Voluntário">Voluntário</option>
              <option value="Equipe">Equipe</option>
            </select>
            <button className="btn" type="submit">Confirmar presença</button>
          </form>
        </div>

        <div className="panel">
          <h3>Lista de presentes</h3>
          <div className="stack-list">
            {participants.map((person, index) => (
              <div className="stack-item" key={person.name}>
                <div>
                  <strong>{person.name}</strong>
                  <div>{person.role}</div>
                </div>
                <button className="mini-btn" onClick={() => toggleChecked(index)}>{person.checked ? 'Presente' : 'Ausente'}</button>
              </div>
            ))}
          </div>
          <div className="qr-box">
            <img className="qr-image" src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrValue)}`} alt="QR Code do evento" />
            <div>
              <strong>Check-in via QR</strong>
              <div>{checkedCount}/{participants.length} presentes</div>
              <small>{qrValue}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

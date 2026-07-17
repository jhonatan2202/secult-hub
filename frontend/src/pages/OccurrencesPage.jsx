import { useEffect, useState } from 'react';

export default function OccurrencesPage() {
  const [occurrences, setOccurrences] = useState([]);
  const [form, setForm] = useState({ title: '', priority: 'Média', description: '', status: 'Aberta' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [editingId, setEditingId] = useState(null);

  async function loadOccurrences() {
    const response = await fetch('/api/occurrences');
    const data = await response.json();
    setOccurrences(data);
  }

  useEffect(() => { loadOccurrences(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    if (!form.title) {
      setFeedback({ type: 'error', message: 'Informe o título da ocorrência.' });
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/occurrences/${editingId}` : '/api/occurrences';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setForm({ title: '', priority: 'Média', description: '', status: 'Aberta' });
      setEditingId(null);
      setFeedback({ type: 'success', message: data.message || 'Ocorrência salva.' });
      loadOccurrences();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Não foi possível salvar.' });
    }
  }

  function editOccurrence(item) {
    setEditingId(item.id);
    setForm({ title: item.title, priority: item.priority, description: item.description || '', status: item.status });
  }

  async function deleteOccurrence(id) {
    const response = await fetch(`/api/occurrences/${id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setFeedback({ type: 'success', message: data.message || 'Ocorrência removida.' });
      loadOccurrences();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Falha ao remover ocorrência.' });
    }
  }

  return (
    <div className="module-page">
      <div className="hero">
        <div className="hero-icon">O</div>
        <div>
          <strong>Ocorrências Técnicas</strong>
          <div>Registro imediato, prioridade e acompanhamento</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>Registrar ocorrência</h3>
          {feedback.message ? <p className={`form-feedback ${feedback.type}`}>{feedback.message}</p> : null}
          <form className="form" onSubmit={handleSubmit}>
            <input placeholder="Título da ocorrência" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Aberta">Aberta</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Resolvida">Resolvida</option>
            </select>
            <textarea placeholder="Descrição da falha" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="btn" type="submit">{editingId ? 'Salvar edição' : 'Salvar ocorrência'}</button>
          </form>
        </div>

        <div className="panel">
          <h3>Chamados recentes</h3>
          <div className="stack-list">
            {occurrences.map((item) => (
              <div className="stack-item" key={item.title}>
                <div>
                  <strong>{item.title}</strong>
                  <div>{item.priority} • {item.status}</div>
                </div>
                <div className="stack-meta">
                  <span className={`status-pill ${item.priority === 'Alta' ? 'danger' : item.priority === 'Média' ? 'warning' : ''}`}>{item.status}</span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button className="mini-btn" onClick={() => editOccurrence(item)}>Editar</button>
                    <button className="mini-btn danger" onClick={() => deleteOccurrence(item.id)}>Excluir</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

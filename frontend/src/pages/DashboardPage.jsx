import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [summary, setSummary] = useState({ events: 0, occurrences: 0, inventory: 0, documents: 0, presences: 0, lowStock: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentOccurrences, setRecentOccurrences] = useState([]);
  const [recentInventory, setRecentInventory] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventForm, setEventForm] = useState({ name: '', status: 'Aprovado', participants: '' });
  const [editingEventId, setEditingEventId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  async function loadDashboard() {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setSummary(data.summary || {});
      setRecentEvents(data.recentEvents || []);
      setRecentOccurrences(data.recentOccurrences || []);
      setRecentInventory(data.recentInventory || []);
      setRecentDocuments(data.recentDocuments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleEventSubmit(e) {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    if (!eventForm.name) {
      setFeedback({ type: 'error', message: 'Informe o nome do evento.' });
      return;
    }

    const method = editingEventId ? 'PUT' : 'POST';
    const url = editingEventId ? `/api/events/${editingEventId}` : '/api/events';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: eventForm.name, status: eventForm.status, participants: Number(eventForm.participants || 0) })
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setEventForm({ name: '', status: 'Aprovado', participants: '' });
      setEditingEventId(null);
      setFeedback({ type: 'success', message: data.message || 'Evento salvo.' });
      loadDashboard();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Falha ao salvar evento.' });
    }
  }

  function editEvent(event) {
    setEditingEventId(event.id);
    setEventForm({ name: event.name, status: event.status, participants: event.participants || '' });
  }

  async function deleteEvent(id) {
    const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setFeedback({ type: 'success', message: data.message || 'Evento removido.' });
      loadDashboard();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Falha ao remover evento.' });
    }
  }

  return (
    <div className="dashboard-page">
      <div className="hero hero-dashboard">
        <div className="hero-icon">D</div>
        <div>
          <strong>Dashboard Executivo</strong>
          <div>Indicadores, alertas e operações do HUB Cultural</div>
        </div>
      </div>

      <div className="highlight-card">
        <div>
          <div className="highlight-label">Em tempo real</div>
          <h3>Fluxo operacional estável</h3>
        </div>
        <div className="highlight-pill">98,4% de execução</div>
      </div>

      <div className="cards">
        <div className="card metric-card">
          <div className="card-top">
            <h3>Eventos</h3>
            <span className="icon-badge">●</span>
          </div>
          <p className="value">{loading ? '—' : summary.events}</p>
          <small>Cadastros ativos no banco</small>
        </div>
        <div className="card metric-card">
          <div className="card-top">
            <h3>Público</h3>
            <span className="icon-badge">◉</span>
          </div>
          <p className="value">{loading ? '—' : summary.presences}</p>
          <small>Presenças registradas</small>
        </div>
        <div className="card metric-card">
          <div className="card-top">
            <h3>Ocorrências</h3>
            <span className="icon-badge">⚑</span>
          </div>
          <p className="value">{loading ? '—' : summary.occurrences}</p>
          <small>{summary.occurrences > 0 ? 'Em acompanhamento' : 'Sem ocorrências'}</small>
        </div>
        <div className="card metric-card">
          <div className="card-top">
            <h3>Insumos</h3>
            <span className="icon-badge">✦</span>
          </div>
          <p className="value">{loading ? '—' : `${summary.inventory} / ${summary.lowStock}`}</p>
          <small>{summary.lowStock} itens abaixo do mínimo</small>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-header">
            <h3>Eventos recentes</h3>
            <span className="badge positive">Banco</span>
          </div>
          {feedback.message ? <p className={`form-feedback ${feedback.type}`}>{feedback.message}</p> : null}
          <form className="form" onSubmit={handleEventSubmit}>
            <input placeholder="Nome do evento" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} />
            <select value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}>
              <option value="Aprovado">Aprovado</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
            </select>
            <input placeholder="Participantes" type="number" value={eventForm.participants} onChange={(e) => setEventForm({ ...eventForm, participants: e.target.value })} />
            <button className="btn" type="submit">{editingEventId ? 'Salvar edição' : 'Cadastrar evento'}</button>
          </form>
          <div className="stack-list" style={{ marginTop: '12px' }}>
            {recentEvents.map((event) => (
              <div className="stack-item" key={event.id}>
                <div>
                  <strong>{event.name}</strong>
                  <div>{event.status} • {event.participants} participantes</div>
                </div>
                <div className="stack-meta">
                  <button className="mini-btn" onClick={() => editEvent(event)}>Editar</button>
                  <button className="mini-btn danger" onClick={() => deleteEvent(event.id)}>Excluir</button>
                </div>
              </div>
            ))}
            {!recentEvents.length ? <div className="muted">Nenhum evento cadastrado.</div> : null}
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-header">
            <h3>Últimas ocorrências</h3>
            <span className="badge accent">Em análise</span>
          </div>
          <div className="stack-list">
            {recentOccurrences.map((item) => (
              <div className="stack-item" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <div>{item.priority} • {item.status}</div>
                </div>
              </div>
            ))}
            {!recentOccurrences.length ? <div className="muted">Nenhuma ocorrência registrada.</div> : null}
          </div>
        </div>
      </div>

      <div className="dashboard-grid lower-grid">
        <div className="panel">
          <h3>Itens em estoque</h3>
          <ul>
            {recentInventory.map((item) => (
              <li key={item.id}>{item.name} • {item.quantity} un • mín {item.minimum}</li>
            ))}
            {!recentInventory.length ? <li>Nenhum item cadastrado.</li> : null}
          </ul>
        </div>
        <div className="panel">
          <h3>Documentos recentes</h3>
          <ul>
            {recentDocuments.map((item) => (
              <li key={item.id}>{item.title} • {item.type}</li>
            ))}
            {!recentDocuments.length ? <li>Nenhum documento cadastrado.</li> : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

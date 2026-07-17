import { useEffect, useState } from 'react';

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState({ title: '', type: 'Modelo' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [editingId, setEditingId] = useState(null);

  async function loadDocs() {
    const response = await fetch('/api/documents');
    const data = await response.json();
    setDocs(data);
  }

  useEffect(() => { loadDocs(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    if (!form.title) {
      setFeedback({ type: 'error', message: 'Informe o título do documento.' });
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/documents/${editingId}` : '/api/documents';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setForm({ title: '', type: 'Modelo' });
      setEditingId(null);
      setFeedback({ type: 'success', message: data.message || 'Documento salvo.' });
      loadDocs();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Falha ao salvar documento.' });
    }
  }

  function editDoc(item) {
    setEditingId(item.id);
    setForm({ title: item.title, type: item.type });
  }

  async function deleteDoc(id) {
    const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setFeedback({ type: 'success', message: data.message || 'Documento removido.' });
      loadDocs();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Falha ao remover documento.' });
    }
  }

  return (
    <div className="module-page">
      <div className="hero">
        <div className="hero-icon">D</div>
        <div>
          <strong>Gestão Documental</strong>
          <div>Templates, cartas e arquivos rápidos</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>Adicionar documento</h3>
          {feedback.message ? <p className={`form-feedback ${feedback.type}`}>{feedback.message}</p> : null}
          <form className="form" onSubmit={handleSubmit}>
            <input placeholder="Título do documento" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="Modelo">Modelo</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Em revisão">Em revisão</option>
            </select>
            <button className="btn" type="submit">{editingId ? 'Salvar edição' : 'Salvar documento'}</button>
          </form>
        </div>

        <div className="panel">
          <h3>Documentos recentes</h3>
          <div className="stack-list">
            {docs.map((doc) => (
              <div className="stack-item" key={doc.title}>
                <div>
                  <strong>{doc.title}</strong>
                  <div>{doc.type}</div>
                </div>
                <div className="stack-meta">
                  <span className="status-pill">Disponível</span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button className="mini-btn" onClick={() => editDoc(doc)}>Editar</button>
                    <button className="mini-btn danger" onClick={() => deleteDoc(doc.id)}>Excluir</button>
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

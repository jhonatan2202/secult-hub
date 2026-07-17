import { useEffect, useState } from 'react';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'Copa', qty: '', min: '', location: 'Térreo' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [editingId, setEditingId] = useState(null);

  async function loadItems() {
    const response = await fetch('/api/inventory');
    const data = await response.json();
    setItems(data);
  }

  useEffect(() => { loadItems(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    if (!form.name || !form.qty || !form.min) {
      setFeedback({ type: 'error', message: 'Preencha nome, quantidade e estoque mínimo.' });
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/inventory/${editingId}` : '/api/inventory';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, category: form.category, quantity: Number(form.qty), minimum: Number(form.min), location: form.location })
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setForm({ name: '', category: 'Copa', qty: '', min: '', location: 'Térreo' });
      setEditingId(null);
      setFeedback({ type: 'success', message: data.message || 'Item salvo no banco.' });
      loadItems();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Não foi possível salvar.' });
    }
  }

  function editItem(item) {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, qty: item.quantity, min: item.minimum, location: item.location });
  }

  async function deleteItem(id) {
    const response = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setFeedback({ type: 'success', message: data.message || 'Item removido.' });
      loadItems();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Falha ao remover item.' });
    }
  }

  return (
    <div className="module-page">
      <div className="hero">
        <div className="hero-icon">A</div>
        <div>
          <strong>Almoxarifado</strong>
          <div>Controle de insumos, estoque e reposição</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>Cadastro de item</h3>
          {feedback.message ? <p className={`form-feedback ${feedback.type}`}>{feedback.message}</p> : null}
          <form className="form" onSubmit={handleSubmit}>
            <input placeholder="Nome do item" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="Copa">Copa</option>
              <option value="Higiene">Higiene</option>
              <option value="Limpeza">Limpeza</option>
            </select>
            <input placeholder="Quantidade atual" type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
            <input placeholder="Estoque mínimo" type="number" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} />
            <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
              <option value="Térreo">Térreo</option>
              <option value="2º andar">2º andar</option>
            </select>
            <button className="btn" type="submit">{editingId ? 'Salvar edição' : 'Cadastrar item'}</button>
          </form>
        </div>

        <div className="panel">
          <h3>Itens em estoque</h3>
          <div className="stack-list">
            {items.map((item) => (
              <div className={`stack-item ${item.qty <= item.min ? 'danger' : ''}`} key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <div>{item.category} • {item.location}</div>
                </div>
                <div className="stack-meta">
                  <span>{item.quantity} un</span>
                  <small>mín {item.minimum}</small>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button className="mini-btn" onClick={() => editItem(item)}>Editar</button>
                    <button className="mini-btn danger" onClick={() => deleteItem(item.id)}>Excluir</button>
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

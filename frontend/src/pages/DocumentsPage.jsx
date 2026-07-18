import { useCallback, useEffect, useMemo, useState } from 'react';
import DocumentAttachments from '../components/DocumentAttachments';
import DocumentEditor from '../components/DocumentEditor';
import DocumentFilters from '../components/DocumentFilters';
import DocumentHistory from '../components/DocumentHistory';
import DocumentInfo from '../components/DocumentInfo';
import DocumentList from '../components/DocumentList';
import DocumentProperties from '../components/DocumentProperties';
import DocumentSearch from '../components/DocumentSearch';

const initialFormState = { title: '', type: 'Modelo' };

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [editingId, setEditingId] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: 'all', status: 'all', sort: 'recent' });

  const loadDocs = useCallback(async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Falha ao carregar documentos.');
      }

      const data = await response.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (error) {
      setDocs([]);
      setFeedback({ type: 'error', message: error.message || 'Falha ao carregar documentos.' });
    }
  }, []);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  useEffect(() => {
    if (!docs.length) {
      setSelectedDoc(null);
      return;
    }

    if (!selectedDoc || !docs.some((doc) => doc.id === selectedDoc.id)) {
      setSelectedDoc(docs[0]);
    }
  }, [docs, selectedDoc]);

  const visibleDocs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = docs.filter((doc) => {
      const category = (doc.category || doc.type || 'Modelo').toLowerCase();
      const title = (doc.title || '').toLowerCase();
      const status = (doc.status || 'Ativo').toLowerCase();
      const matchesSearch = !normalizedSearch || title.includes(normalizedSearch) || category.includes(normalizedSearch) || status.includes(normalizedSearch);
      const matchesCategory = filters.category === 'all' || category.includes(filters.category.toLowerCase());
      const matchesStatus = filters.status === 'all' || status.includes(filters.status.toLowerCase());
      return matchesSearch && matchesCategory && matchesStatus;
    });

    const sorted = [...filtered].sort((left, right) => {
      if (filters.sort === 'alpha') {
        return (left.title || '').localeCompare(right.title || '');
      }
      if (filters.sort === 'oldest') {
        return (left.id || 0) - (right.id || 0);
      }
      return (right.id || 0) - (left.id || 0);
    });

    return sorted;
  }, [docs, filters, search]);

  useEffect(() => {
    if (selectedDoc && !visibleDocs.some((doc) => doc.id === selectedDoc.id)) {
      setSelectedDoc(visibleDocs[0] || null);
    }
  }, [selectedDoc, visibleDocs]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
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
      setForm(initialFormState);
      setEditingId(null);
      setFeedback({ type: 'success', message: data.message || 'Documento salvo.' });
      loadDocs();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Falha ao salvar documento.' });
    }
  }, [editingId, form, loadDocs]);

  const editDoc = useCallback((item) => {
    setEditingId(item.id);
    setSelectedDoc(item);
    setForm({ title: item.title, type: item.type });
  }, []);

  const deleteDoc = useCallback(async (id) => {
    const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setFeedback({ type: 'success', message: data.message || 'Documento removido.' });
      loadDocs();
    } else {
      setFeedback({ type: 'error', message: data.message || 'Falha ao remover documento.' });
    }
  }, [loadDocs]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setForm(initialFormState);
  }, []);

  const handleNewDoc = useCallback(() => {
    resetForm();
    setFeedback({ type: '', message: '' });
  }, [resetForm]);

  const handleFormFieldChange = useCallback((field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }, []);

  return (
    <div className="module-page">
      <div className="hero">
        <div className="hero-icon">D</div>
        <div>
          <strong>Gestão Documental</strong>
          <div>Templates, cartas e arquivos rápidos</div>
        </div>
      </div>

      <div className="documents-shell">
        <aside className="documents-card documents-sidebar">
          <div className="documents-card__header documents-card__header--stacked">
            <div>
              <h3>Explorador</h3>
              <p className="documents-card__subtitle">Encontre, filtre e organize documentos.</p>
            </div>
            <div className="documents-sidebar-actions">
              <button className="mini-btn" type="button" onClick={handleNewDoc}>Novo Documento</button>
              <button className="mini-btn" type="button" onClick={loadDocs}>Atualizar lista</button>
            </div>
          </div>

          <DocumentSearch value={search} onChange={setSearch} />
          <DocumentFilters filters={filters} onChange={setFilters} />

          <div className="documents-list-scroll">
            <DocumentList
              documents={visibleDocs}
              selectedDocId={selectedDoc?.id}
              onSelect={setSelectedDoc}
              onEdit={editDoc}
              onDelete={deleteDoc}
            />
          </div>

          {selectedDoc ? (
            <div className="documents-highlight">
              <div className="documents-card__header">
                <h4>Selecionado</h4>
                <span className="documents-pill">Ativo</span>
              </div>
              <strong>{selectedDoc.title}</strong>
              <p>{selectedDoc.category || selectedDoc.type}</p>
              <div className="documents-actions">
                <button className="mini-btn" type="button" onClick={() => editDoc(selectedDoc)}>Editar</button>
                <button className="mini-btn danger" type="button" onClick={() => deleteDoc(selectedDoc.id)}>Excluir</button>
              </div>
            </div>
          ) : null}
        </aside>

        <main className="documents-card documents-main">
          <DocumentEditor title={form.title} type={form.type} onFieldChange={handleFormFieldChange} />

          <div className="documents-form-card">
            <div className="documents-card__header">
              <h3>{editingId ? 'Editar documento' : 'Adicionar documento'}</h3>
              <span className="documents-pill">Cadastro</span>
            </div>
            {feedback.message ? <p className={`form-feedback ${feedback.type}`} aria-live="polite">{feedback.message}</p> : null}
            <form className="form" onSubmit={handleSubmit}>
              <input placeholder="Título do documento" value={form.title} onChange={(event) => handleFormFieldChange('title', event.target.value)} />
              <select value={form.type} onChange={(event) => handleFormFieldChange('type', event.target.value)}>
                <option value="Modelo">Modelo</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Em revisão">Em revisão</option>
              </select>
              <div className="documents-form-actions">
                <button className="btn" type="submit">{editingId ? 'Salvar edição' : 'Salvar documento'}</button>
                <button className="mini-btn" type="button" onClick={resetForm}>Limpar</button>
              </div>
            </form>
          </div>
        </main>

        <aside className="documents-card documents-right">
          <div className="documents-card__header documents-card__header--stacked">
            <div>
              <h3>Informações</h3>
              <p className="documents-card__subtitle">Painel preparado para integração futura.</p>
            </div>
            <span className="documents-pill">Documento</span>
          </div>

          <div className="documents-right-stack">
            <DocumentProperties document={selectedDoc} />
            <DocumentInfo document={selectedDoc} />
            <DocumentAttachments />
            <DocumentHistory />
          </div>
        </aside>
      </div>
    </div>
  );
}

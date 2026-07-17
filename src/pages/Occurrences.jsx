import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Occurrences() {
  const { state, addOccurrence } = useApp();
  const [form, setForm] = useState({
    title: '',
    type: 'elevador',
    priority: 'media',
    assignedTo: '',
    description: '',
    attachmentName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.assignedTo) return;

    await addOccurrence(form);
    setForm({
      title: '',
      type: 'elevador',
      priority: 'media',
      assignedTo: '',
      description: '',
      attachmentName: ''
    });
  };

  return (
    <div className="page">
      <h2>Registro de Ocorrências Técnicas</h2>

      <div className="grid-2">
        <form className="panel form" onSubmit={handleSubmit}>
          <h3>Novo chamado</h3>

          <label>
            Título
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Tipo
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="elevador">Elevador</option>
              <option value="tomada">Tomada</option>
              <option value="ar-condicionado">Ar-condicionado</option>
              <option value="forro">Forro</option>
            </select>
          </label>

          <label>
            Prioridade
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </label>

          <label>
            Responsável / Fornecedor
            <input name="assignedTo" value={form.assignedTo} onChange={handleChange} required />
          </label>

          <label>
            Descrição
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>

          <label>
            Anexo
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setForm((prev) => ({ ...prev, attachmentName: file ? file.name : '' }));
              }}
            />
          </label>

          <button className="btn" type="submit">Registrar ocorrência</button>
        </form>

        <div className="panel">
          <h3>Chamados recentes</h3>
          <ul className="list">
            {state.occurrences.map((occ) => (
              <li key={occ.id}>
                <strong>{occ.title}</strong>
                <div>{occ.assignedTo} • {occ.priority}</div>
                <small>{occ.status}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
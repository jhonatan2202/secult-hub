import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Documents() {
  const { state, addDocument } = useApp();
  const [form, setForm] = useState({
    title: 'Carta de anuência',
    project: '',
    proponent: '',
    cpfCnpj: '',
    date: '',
    time: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDocument(form);
    setForm((prev) => ({ ...prev, project: '', proponent: '', cpfCnpj: '', date: '', time: '' }));
  };

  return (
    <div className="page">
      <h2>Gestão Documental</h2>

      <div className="grid-2">
        <form className="panel form" onSubmit={handleSubmit}>
          <h3>Gerar carta de anuência</h3>

          <label>
            Nome do projeto
            <input name="project" value={form.project} onChange={handleChange} required />
          </label>

          <label>
            Proponente
            <input name="proponent" value={form.proponent} onChange={handleChange} required />
          </label>

          <label>
            CPF/CNPJ
            <input name="cpfCnpj" value={form.cpfCnpj} onChange={handleChange} required />
          </label>

          <label>
            Data
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
          </label>

          <label>
            Horário
            <input name="time" type="time" value={form.time} onChange={handleChange} required />
          </label>

          <button className="btn" type="submit">Gerar documento</button>
        </form>

        <div className="panel">
          <h3>Documentos gerados</h3>
          <ul className="list">
            {state.documents.map((doc) => (
              <li key={doc.id}>
                <strong>{doc.title}</strong>
                <div>{doc.project}</div>
                <small>{doc.proponent} • {doc.date} às {doc.time}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
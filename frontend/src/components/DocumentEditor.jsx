import DocumentToolbar from './DocumentToolbar';
import EditorArea from './EditorArea';

export default function DocumentEditor({ title = '', type = 'Modelo', onFieldChange }) {
  function handleChange(event) {
    const { name, value } = event.target;
    onFieldChange?.(name, value);
  }

  return (
    <div className="document-editor-card">
      <div className="document-editor-form">
        <label className="document-editor-field">
          <span>Título do documento</span>
          <input name="title" value={title} onChange={handleChange} placeholder="Ex.: Carta de autorização" />
        </label>
        <label className="document-editor-field">
          <span>Seleção de modelo</span>
          <select name="type" value={type} onChange={handleChange}>
            <option value="Modelo">Modelo</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Em revisão">Em revisão</option>
          </select>
        </label>
      </div>

      <DocumentToolbar />
      <EditorArea />
    </div>
  );
}

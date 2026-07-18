export default function DocumentProperties({ document }) {
  const current = document || {};

  return (
    <section className="document-panel-card">
      <div className="document-panel-card__header">
        <h4>Propriedades</h4>
        <span className="documents-pill">Documento</span>
      </div>

      <div className="document-properties-actions">
        <button type="button" className="btn">Salvar</button>
        <button type="button" className="mini-btn">Salvar como modelo</button>
      </div>

      <div className="document-properties-actions document-properties-actions--secondary">
        <button type="button" className="mini-btn">Visualizar PDF</button>
        <button type="button" className="mini-btn">Exportar PDF</button>
        <button type="button" className="mini-btn">Exportar DOCX</button>
        <button type="button" className="mini-btn">Imprimir</button>
      </div>

      <div className="document-properties-meta">
        <div>
          <span>Título</span>
          <strong>{current.title || 'Sem título'}</strong>
        </div>
        <div>
          <span>Categoria</span>
          <strong>{current.category || current.type || 'Modelo'}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{current.status || 'Em revisão'}</strong>
        </div>
        <div>
          <span>Comentários</span>
          <strong>3 pendentes</strong>
        </div>
      </div>
    </section>
  );
}

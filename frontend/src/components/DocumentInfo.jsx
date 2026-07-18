export default function DocumentInfo({ document }) {
  const current = document || {};

  return (
    <section className="document-panel-card">
      <div className="document-panel-card__header">
        <h4>Informações</h4>
        <span className="documents-pill">Resumo</span>
      </div>

      <div className="document-info-grid">
        <div>
          <span>Status</span>
          <strong>{current.status || 'Em revisão'}</strong>
        </div>
        <div>
          <span>Categoria</span>
          <strong>{current.category || current.type || 'Modelo'}</strong>
        </div>
        <div>
          <span>Autor</span>
          <strong>Equipe SECULT</strong>
        </div>
        <div>
          <span>Data de criação</span>
          <strong>{current.created_at || '17/07/2026'}</strong>
        </div>
        <div>
          <span>Última modificação</span>
          <strong>{current.updated_at || 'Hoje'}</strong>
        </div>
        <div>
          <span>Modelo utilizado</span>
          <strong>{current.template || 'Modelo padrão'}</strong>
        </div>
      </div>
    </section>
  );
}

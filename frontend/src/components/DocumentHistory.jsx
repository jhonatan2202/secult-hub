export default function DocumentHistory() {
  return (
    <section className="document-panel-card">
      <div className="document-panel-card__header">
        <h4>Histórico</h4>
        <span className="documents-pill">Versões</span>
      </div>

      <div className="document-panel-list">
        <div className="document-panel-list__item">
          <strong>Versão 3 · 17/07/2026</strong>
          <span>Aprovado por coordenação</span>
        </div>
        <div className="document-panel-list__item">
          <strong>Versão 2 · 14/07/2026</strong>
          <span>Atualização de conteúdo</span>
        </div>
        <div className="document-panel-list__item">
          <strong>Versão 1 · 10/07/2026</strong>
          <span>Criação inicial</span>
        </div>
      </div>
    </section>
  );
}

export default function DocumentAttachments() {
  return (
    <section className="document-panel-card">
      <div className="document-panel-card__header">
        <h4>Anexos</h4>
        <span className="documents-pill">Arquivos</span>
      </div>

      <div className="document-panel-list">
        <div className="document-panel-list__item">
          <strong>Documento principal.pdf</strong>
          <span>2 MB · Anexo ativo</span>
        </div>
        <div className="document-panel-list__item">
          <strong>Checklist.docx</strong>
          <span>430 KB · Revisão</span>
        </div>
      </div>
    </section>
  );
}

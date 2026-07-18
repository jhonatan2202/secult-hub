export default function DocumentCard({ document, isActive, onSelect, onEdit, onDelete }) {
  const status = document.status || 'Ativo';
  const category = document.category || document.type || 'Modelo';
  const createdAt = document.created_at || document.createdAt || document.updated_at || document.updatedAt || '';

  return (
    <div className={`documents-list-item ${isActive ? 'active' : ''}`}>
      <button type="button" className="documents-list-item__select" onClick={() => onSelect(document)}>
        <div className="documents-list-item__main">
          <div className="documents-list-item__icon" aria-hidden="true">D</div>
          <div className="documents-list-item__content">
            <strong>{document.title}</strong>
            <div className="documents-list-item__meta">
              <span>{category}</span>
              <span>{status}</span>
            </div>
            {createdAt ? <small>{createdAt}</small> : null}
          </div>
        </div>
      </button>

      <div className="documents-list-item__actions">
        <span className="documents-dot" />
        <div className="documents-list-item__inline-actions">
          <button type="button" className="documents-inline-btn" onClick={() => onEdit(document)}>
            Editar
          </button>
          <button type="button" className="documents-inline-btn danger" onClick={() => onDelete(document.id)}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

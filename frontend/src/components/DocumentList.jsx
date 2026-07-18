import DocumentCard from './DocumentCard';

export default function DocumentList({ documents, selectedDocId, onSelect, onEdit, onDelete }) {
  if (!documents.length) {
    return (
      <div className="documents-empty-state">
        <strong>Nenhum documento encontrado</strong>
        <p>Experimente outra pesquisa ou crie um novo documento.</p>
      </div>
    );
  }

  return (
    <div className="documents-list" role="list" aria-label="Lista de documentos">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          isActive={selectedDocId === doc.id}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

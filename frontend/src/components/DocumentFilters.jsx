export default function DocumentFilters({ filters, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange((previousFilters) => ({ ...previousFilters, [name]: value }));
  };

  return (
    <div className="documents-filters">
      <label className="documents-filter">
        <span>Categoria</span>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="all">Todas</option>
          <option value="Modelo">Modelo</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Em revisão">Em revisão</option>
        </select>
      </label>

      <label className="documents-filter">
        <span>Status</span>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="all">Todos</option>
          <option value="Ativo">Ativo</option>
          <option value="Em revisão">Em revisão</option>
          <option value="Aprovado">Aprovado</option>
        </select>
      </label>

      <label className="documents-filter">
        <span>Ordenação</span>
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="recent">Mais recentes</option>
          <option value="alpha">Ordem alfabética</option>
          <option value="oldest">Mais antigos</option>
        </select>
      </label>
    </div>
  );
}

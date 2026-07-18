export default function DocumentSearch({ value, onChange }) {
  return (
    <label className="documents-search">
      <span>Pesquisar</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por título ou categoria"
        aria-label="Pesquisar documentos"
      />
    </label>
  );
}

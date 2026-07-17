import { useApp } from '../context/AppContext';

export default function Inventory() {
  const { state, requestReposition } = useApp();

  const handleRequest = async (itemId) => {
    await requestReposition(itemId);
  };

  return (
    <div className="page">
      <h2>Controle de Insumos</h2>
      <p>Gestão de estoque, alertas e solicitações de refil.</p>

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Tipo</th>
              <th>Qtd.</th>
              <th>Mínimo</th>
              <th>Local</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {state.inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.quantity}</td>
                <td>{item.minimum}</td>
                <td>{item.location}</td>
                <td>
                  {item.quantity <= item.minimum ? (
                    <span className="badge danger">Crítico</span>
                  ) : (
                    <span className="badge success">Normal</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn small"
                    onClick={() => handleRequest(item.id)}
                    disabled={item.requested}
                  >
                    {item.requested ? 'Solicitado' : 'Solicitar Reposição'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
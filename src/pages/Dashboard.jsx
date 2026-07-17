import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { state } = useApp();

  const totalEvents = state.events.length;
  const totalAtendidos = state.presences.length;
  const criticalItems = state.inventory.filter((item) => item.quantity <= item.minimum).length;
  const openOccurrences = state.occurrences.filter((occ) => occ.status === 'Aberta').length;

  return (
    <div className="page">
      <h2>Dashboard Executivo</h2>
      <p>Indicadores principais do HUB Cultural/Creativo.</p>

      <div className="cards">
        <div className="card">
          <h3>Eventos</h3>
          <p className="value">{totalEvents}</p>
          <span>Ativos e aprovados</span>
        </div>

        <div className="card">
          <h3>Público atendido</h3>
          <p className="value">{totalAtendidos}</p>
          <span>Participantes registrados</span>
        </div>

        <div className="card">
          <h3>Itens críticos</h3>
          <p className="value">{criticalItems}</p>
          <span>Estoque abaixo do mínimo</span>
        </div>

        <div className="card">
          <h3>Ocorrências abertas</h3>
          <p className="value">{openOccurrences}</p>
          <span>Chamados técnicos pendentes</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Alertas</h3>
          <ul className="list">
            <li>Manutenção preventiva: elevador mensal</li>
            <li>Bebedouro: revisão semestral</li>
            <li>Extintores: revisão anual</li>
            <li>Contrato de limpeza vence em 15 dias</li>
          </ul>
        </div>

        <div className="panel">
          <h3>Últimos registros</h3>
          <ul className="list">
            {state.presences.slice(0, 3).map((entry) => (
              <li key={entry.id}>
                {entry.name} — {entry.eventId === 301 ? 'Mostra Cultural' : 'Evento'} ({entry.method})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
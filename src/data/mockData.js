export const initialState = {
  inventory: [
    {
      id: 1,
      name: 'Café',
      type: 'copa',
      quantity: 4,
      minimum: 5,
      location: 'Térreo',
      critical: true,
      requested: false
    },
    {
      id: 2,
      name: 'Papel Toalha',
      type: 'higiene',
      quantity: 12,
      minimum: 8,
      location: '2º andar',
      critical: false,
      requested: false
    },
    {
      id: 3,
      name: 'Sabonete',
      type: 'higiene',
      quantity: 3,
      minimum: 5,
      location: 'Térreo',
      critical: true,
      requested: false
    },
    {
      id: 4,
      name: 'Água Sanitária',
      type: 'limpeza',
      quantity: 10,
      minimum: 6,
      location: '2º andar',
      critical: false,
      requested: false
    }
  ],
  occurrences: [
    {
      id: 101,
      title: 'Elevador travado',
      type: 'elevador',
      priority: 'alta',
      assignedTo: 'TKE',
      description: 'Falha no sistema de portas.',
      status: 'Aberta',
      createdAt: '2026-07-08T09:00:00'
    }
  ],
  documents: [
    {
      id: 201,
      title: 'Carta de anuência',
      project: 'Festival de Artes',
      proponent: 'Ana Souza',
      cpfCnpj: '123.456.789-00',
      date: '2026-07-10',
      time: '14:00',
      createdAt: '2026-07-08T08:30:00'
    }
  ],
  events: [
    {
      id: 301,
      name: 'Mostra Cultural',
      date: '2026-07-10',
      status: 'Aprovado',
      participants: 42
    },
    {
      id: 302,
      name: 'Encontro de Artes',
      date: '2026-07-12',
      status: 'Preparação',
      participants: 18
    }
  ],
  presences: [
    {
      id: 401,
      eventId: 301,
      name: 'Maria Silva',
      email: 'maria@email.com',
      checkedAt: '2026-07-08T10:00:00',
      method: 'QR'
    }
  ]
};
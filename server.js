import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const users = [
  {
    id: 1,
    name: 'Coordenador',
    email: 'coord@secult.com',
    role: 'Coordenador',
    passwordHash: hashPassword('123456')
  }
];

const state = {
  inventory: [
    { id: 1, name: 'Café', type: 'copa', quantity: 4, minimum: 5, location: 'Térreo', critical: true, requested: false },
    { id: 2, name: 'Papel Toalha', type: 'higiene', quantity: 12, minimum: 8, location: '2º andar', critical: false, requested: false },
    { id: 3, name: 'Sabonete', type: 'higiene', quantity: 3, minimum: 5, location: 'Térreo', critical: true, requested: false },
    { id: 4, name: 'Água Sanitária', type: 'limpeza', quantity: 10, minimum: 6, location: '2º andar', critical: false, requested: false }
  ],
  occurrences: [
    { id: 101, title: 'Elevador travado', type: 'elevador', priority: 'alta', assignedTo: 'TKE', description: 'Falha no sistema de portas.', status: 'Aberta', createdAt: '2026-07-08T09:00:00' }
  ],
  documents: [
    { id: 201, title: 'Carta de anuência', project: 'Festival de Artes', proponent: 'Ana Souza', cpfCnpj: '123.456.789-00', date: '2026-07-10', time: '14:00', createdAt: '2026-07-08T08:30:00' }
  ],
  events: [
    { id: 301, name: 'Mostra Cultural', date: '2026-07-10', status: 'Aprovado', participants: 42 },
    { id: 302, name: 'Encontro de Artes', date: '2026-07-12', status: 'Preparação', participants: 18 }
  ],
  presences: [
    { id: 401, eventId: 301, name: 'Maria Silva', email: 'maria@email.com', checkedAt: '2026-07-08T10:00:00', method: 'QR' }
  ]
};

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ message: 'Token ausente.' });
  }

  const user = users.find((entry) => entry.id === Number(token));
  if (!user) {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  req.user = user;
  next();
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const foundUser = users.find((user) => user.email.toLowerCase() === (email || '').toLowerCase());

  if (!foundUser || !verifyPassword(password, foundUser.passwordHash)) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  res.json({ user: foundUser, token: String(foundUser.id) });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'E-mail já cadastrado.' });
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: 'Recepção',
    passwordHash: hashPassword(password)
  };

  users.push(newUser);
  res.status(201).json({ user: newUser, token: String(newUser.id) });
});

app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ ...state, currentUser: req.user });
});

app.get('/api/inventory', authMiddleware, (req, res) => {
  res.json(state.inventory);
});

app.post('/api/inventory/request', authMiddleware, (req, res) => {
  const { itemId } = req.body || {};
  state.inventory = state.inventory.map((item) =>
    item.id === itemId ? { ...item, requested: true, quantity: Math.max(item.quantity, item.minimum) } : item
  );
  res.json(state.inventory);
});

app.get('/api/occurrences', authMiddleware, (req, res) => {
  res.json(state.occurrences);
});

app.post('/api/occurrences', authMiddleware, (req, res) => {
  const payload = req.body || {};
  const occurrence = {
    id: Date.now(),
    ...payload,
    status: 'Aberta',
    createdAt: new Date().toISOString()
  };
  state.occurrences.unshift(occurrence);
  res.status(201).json(occurrence);
});

app.get('/api/documents', authMiddleware, (req, res) => {
  res.json(state.documents);
});

app.post('/api/documents', authMiddleware, (req, res) => {
  const payload = req.body || {};
  const document = {
    id: Date.now(),
    ...payload,
    createdAt: new Date().toISOString()
  };
  state.documents.unshift(document);
  res.status(201).json(document);
});

app.get('/api/presences', authMiddleware, (req, res) => {
  res.json(state.presences);
});

app.post('/api/presences', authMiddleware, (req, res) => {
  const payload = req.body || {};
  const presence = {
    id: Date.now(),
    ...payload,
    checkedAt: new Date().toISOString(),
    method: 'QR'
  };
  state.presences.unshift(presence);
  res.status(201).json(presence);
});

app.patch('/api/profile', authMiddleware, (req, res) => {
  const updates = req.body || {};
  const user = users.find((entry) => entry.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

  Object.assign(user, updates);
  res.json(user);
});

app.listen(port, () => {
  console.log(`Backend rodando em http://127.0.0.1:${port}`);
});

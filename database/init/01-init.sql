-- Script SQL inicial para o SECULT Hub
-- Pode ser executado no Adminer, pgAdmin ou psql.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'coordinator',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Aprovado',
  participants INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 0,
  minimum INT DEFAULT 0,
  location VARCHAR(100),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS occurrences (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  priority VARCHAR(50) DEFAULT 'Média',
  description TEXT,
  status VARCHAR(50) DEFAULT 'Aberta',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) DEFAULT 'Modelo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS presences (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) DEFAULT 'Público',
  checked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais de exemplo
INSERT INTO users (name, email, role, password_hash) VALUES
  ('Administrador SECULT', 'admin@secult.com', 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

INSERT INTO events (name, status, participants) VALUES
  ('Festival de Música Urbana', 'Aprovado', 180),
  ('Mostra de Artes Visuais', 'Em análise', 92)
ON CONFLICT DO NOTHING;

INSERT INTO inventory_items (name, quantity, minimum, location, category) VALUES
  ('Microfones', 8, 3, 'Setor A', 'Áudio'),
  ('Projetor', 2, 1, 'Setor B', 'Tecnologia'),
  ('Cadeiras', 60, 20, 'Depósito', 'Mobiliário')
ON CONFLICT DO NOTHING;

INSERT INTO occurrences (title, priority, description, status) VALUES
  ('Problema no ar-condicionado', 'Alta', 'Sala de projeção com falha de refrigeração.', 'Aberta'),
  ('Atraso de carga de equipamentos', 'Média', 'Item chegou após o horário previsto.', 'Em andamento')
ON CONFLICT DO NOTHING;

INSERT INTO documents (title, type) VALUES
  ('Modelo de autorização', 'Modelo'),
  ('Relatório mensal', 'Relatório')
ON CONFLICT DO NOTHING;

INSERT INTO presences (name, role, checked) VALUES
  ('Ana Souza', 'Coordenadora', TRUE),
  ('Bruno Lima', 'Voluntário', FALSE)
ON CONFLICT DO NOTHING;

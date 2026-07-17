# Relatório da Arquitetura SECULT

## Estrutura do projeto
- frontend/: aplicação React com páginas e layout responsivo.
- backend/: API organizadas em routes, middleware, autenticação e endpoints.
- database/init/: scripts para inicialização do PostgreSQL.
- docker-compose.yml: orquestração de frontend, backend e banco.

## Fluxo de comunicação
1. O usuário acessa o frontend.
2. O frontend consome as rotas da API via /api.
3. O backend valida autenticação JWT e acessa dados do PostgreSQL.
4. O PostgreSQL persiste os dados em volume Docker.

## Passo a passo para execução
1. Copie .env.example para .env.
2. Execute docker compose up --build.
3. Acesse http://localhost:3000 para o frontend e http://localhost:4000/api/health para a API.

## Tecnologias
- React
- Vite
- Node.js
- Express
- PostgreSQL
- Docker Compose
- JWT
- Swagger

## Melhorias implementadas
- Separação de containers
- Rede dedicada
- Volumes persistidos
- Health checks
- Restart policy
- Estrutura modular e escalável

## Status dos testes
- Inicialização dos containers: pendente de execução no ambiente local
- Comunicação frontend/backend: implementada
- Persistência do banco: configurada via volume
- CRUD e autenticação: implementados na API base

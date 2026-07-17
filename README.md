# SECULT Platform

## Arquitetura proposta

- Frontend: React + Vite + Nginx
- Backend: Node.js + Express + JWT + Swagger
- Banco: PostgreSQL 16
- Orquestração: Docker Compose

## Estrutura

- backend/: API, rotas, middlewares, autenticação
- frontend/: aplicação React
- database/init/: scripts de inicialização do Postgres
- docs/: documentação e relatórios

## Executar

```bash
docker compose up --build
```

Acesse:
- Frontend: http://localhost:3100/login
- Backend: http://localhost:4100/api/health
- Adminer (gerenciamento do PostgreSQL): http://localhost:8081
  - Servidor: postgres
  - Usuário: secult_user
  - Senha: secult_pass
  - Banco: secult_db

## Variáveis de ambiente

Copie o exemplo:

```bash
copy .env.example .env
```

## Observações

- O backend utiliza autenticação JWT.
- O PostgreSQL persiste dados via volume Docker.
- Os containers usam rede dedicada e health checks.

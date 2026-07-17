import { Client } from 'pg';

export function createDbClient() {
  return new Client({
    host: process.env.DB_HOST || 'secult-postgres',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'secult_db',
    user: process.env.DB_USER || 'secult_user',
    password: process.env.DB_PASSWORD || 'secult_pass'
  });
}

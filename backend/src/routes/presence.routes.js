import express from 'express';
import { createDbClient } from '../db/client.js';

export const presenceRoutes = express.Router();

presenceRoutes.get('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    await dbClient.connect();
    const result = await dbClient.query('SELECT id, name, role, checked FROM presences ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

presenceRoutes.post('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { name, role, checked = true } = req.body || {};
    if (!name) return res.status(400).json({ message: 'Nome é obrigatório.' });

    await dbClient.connect();
    const result = await dbClient.query(
      'INSERT INTO presences (name, role, checked) VALUES ($1, $2, $3) RETURNING id, name, role, checked',
      [name, role || 'Público', checked]
    );
    res.status(201).json({ presence: result.rows[0], message: 'Presença registrada com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

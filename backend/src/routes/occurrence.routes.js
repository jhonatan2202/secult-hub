import express from 'express';
import { createDbClient } from '../db/client.js';

export const occurrenceRoutes = express.Router();

occurrenceRoutes.get('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    await dbClient.connect();
    const result = await dbClient.query('SELECT id, title, status, priority, description FROM occurrences ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

occurrenceRoutes.post('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { title, priority, description } = req.body || {};
    if (!title) return res.status(400).json({ message: 'Título da ocorrência é obrigatório.' });

    await dbClient.connect();
    const result = await dbClient.query(
      'INSERT INTO occurrences (title, priority, description, status) VALUES ($1, $2, $3, $4) RETURNING id, title, priority, description, status',
      [title, priority || 'Média', description || '', 'Aberta']
    );
    res.status(201).json({ occurrence: result.rows[0], message: 'Ocorrência registrada com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

occurrenceRoutes.put('/:id', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { id } = req.params;
    const { title, priority, description, status } = req.body || {};
    await dbClient.connect();
    const result = await dbClient.query(
      'UPDATE occurrences SET title = COALESCE($1, title), priority = COALESCE($2, priority), description = COALESCE($3, description), status = COALESCE($4, status) WHERE id = $5 RETURNING id, title, priority, description, status',
      [title, priority, description, status, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Ocorrência não encontrada.' });
    res.json({ occurrence: result.rows[0], message: 'Ocorrência atualizada com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

occurrenceRoutes.delete('/:id', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { id } = req.params;
    await dbClient.connect();
    const result = await dbClient.query('DELETE FROM occurrences WHERE id = $1 RETURNING id', [id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Ocorrência não encontrada.' });
    res.json({ message: 'Ocorrência removida com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

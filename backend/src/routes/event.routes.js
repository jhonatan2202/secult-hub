import express from 'express';
import { createDbClient } from '../db/client.js';

export const eventRoutes = express.Router();

eventRoutes.get('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    await dbClient.connect();
    const result = await dbClient.query('SELECT id, name, status, participants, created_at FROM events ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

eventRoutes.post('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { name, status, participants } = req.body || {};
    if (!name) return res.status(400).json({ message: 'Nome do evento é obrigatório.' });

    await dbClient.connect();
    const result = await dbClient.query(
      'INSERT INTO events (name, status, participants) VALUES ($1, $2, $3) RETURNING id, name, status, participants, created_at',
      [name, status || 'Aprovado', Number(participants || 0)]
    );
    res.status(201).json({ event: result.rows[0], message: 'Evento salvo com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

eventRoutes.put('/:id', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { id } = req.params;
    const { name, status, participants } = req.body || {};
    await dbClient.connect();
    const result = await dbClient.query(
      'UPDATE events SET name = COALESCE($1, name), status = COALESCE($2, status), participants = COALESCE($3, participants) WHERE id = $4 RETURNING id, name, status, participants, created_at',
      [name, status, participants === undefined ? undefined : Number(participants), id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Evento não encontrado.' });
    res.json({ event: result.rows[0], message: 'Evento atualizado com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

eventRoutes.delete('/:id', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { id } = req.params;
    await dbClient.connect();
    const result = await dbClient.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Evento não encontrado.' });
    res.json({ message: 'Evento removido com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

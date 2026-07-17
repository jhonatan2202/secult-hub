import express from 'express';
import { createDbClient } from '../db/client.js';

export const documentRoutes = express.Router();

documentRoutes.get('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    await dbClient.connect();
    const result = await dbClient.query('SELECT id, title, type FROM documents ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

documentRoutes.post('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { title, type } = req.body || {};
    if (!title) return res.status(400).json({ message: 'Título do documento é obrigatório.' });

    await dbClient.connect();
    const result = await dbClient.query(
      'INSERT INTO documents (title, type) VALUES ($1, $2) RETURNING id, title, type',
      [title, type || 'Modelo']
    );
    res.status(201).json({ document: result.rows[0], message: 'Documento salvo com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

documentRoutes.put('/:id', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { id } = req.params;
    const { title, type } = req.body || {};
    await dbClient.connect();
    const result = await dbClient.query(
      'UPDATE documents SET title = COALESCE($1, title), type = COALESCE($2, type) WHERE id = $3 RETURNING id, title, type',
      [title, type, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Documento não encontrado.' });
    res.json({ document: result.rows[0], message: 'Documento atualizado com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

documentRoutes.delete('/:id', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { id } = req.params;
    await dbClient.connect();
    const result = await dbClient.query('DELETE FROM documents WHERE id = $1 RETURNING id', [id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Documento não encontrado.' });
    res.json({ message: 'Documento removido com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

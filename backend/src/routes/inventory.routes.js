import express from 'express';
import { createDbClient } from '../db/client.js';

export const inventoryRoutes = express.Router();

inventoryRoutes.get('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    await dbClient.connect();
    const result = await dbClient.query('SELECT id, name, quantity, minimum, location, category FROM inventory_items ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

inventoryRoutes.post('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { name, quantity, minimum, location, category } = req.body || {};
    if (!name) return res.status(400).json({ message: 'Nome do item é obrigatório.' });

    await dbClient.connect();
    const result = await dbClient.query(
      'INSERT INTO inventory_items (name, quantity, minimum, location, category) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, quantity, minimum, location, category',
      [name, Number(quantity || 0), Number(minimum || 0), location, category]
    );
    res.status(201).json({ item: result.rows[0], message: 'Item cadastrado com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

inventoryRoutes.put('/:id', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { id } = req.params;
    const { name, quantity, minimum, location, category } = req.body || {};
    await dbClient.connect();
    const result = await dbClient.query(
      'UPDATE inventory_items SET name = COALESCE($1, name), quantity = COALESCE($2, quantity), minimum = COALESCE($3, minimum), location = COALESCE($4, location), category = COALESCE($5, category) WHERE id = $6 RETURNING id, name, quantity, minimum, location, category',
      [name, quantity === undefined ? undefined : Number(quantity), minimum === undefined ? undefined : Number(minimum), location, category, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Item não encontrado.' });
    res.json({ item: result.rows[0], message: 'Item atualizado com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

inventoryRoutes.delete('/:id', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    const { id } = req.params;
    await dbClient.connect();
    const result = await dbClient.query('DELETE FROM inventory_items WHERE id = $1 RETURNING id', [id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Item não encontrado.' });
    res.json({ message: 'Item removido com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

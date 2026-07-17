import express from 'express';
import { createDbClient } from '../db/client.js';

export const dashboardRoutes = express.Router();

dashboardRoutes.get('/', async (req, res, next) => {
  const dbClient = createDbClient();
  try {
    await dbClient.connect();

    const [eventsCount, occurrencesCount, inventoryCount, documentsCount, presencesCount, lowStockCount, recentEvents, recentOccurrences, recentInventory, recentDocuments] = await Promise.all([
      dbClient.query('SELECT COUNT(*)::int AS count FROM events'),
      dbClient.query('SELECT COUNT(*)::int AS count FROM occurrences'),
      dbClient.query('SELECT COUNT(*)::int AS count FROM inventory_items'),
      dbClient.query('SELECT COUNT(*)::int AS count FROM documents'),
      dbClient.query('SELECT COUNT(*)::int AS count FROM presences'),
      dbClient.query('SELECT COUNT(*)::int AS count FROM inventory_items WHERE quantity <= minimum'),
      dbClient.query('SELECT id, name, status, participants, created_at FROM events ORDER BY id DESC LIMIT 5'),
      dbClient.query('SELECT id, title, status, priority, created_at FROM occurrences ORDER BY id DESC LIMIT 5'),
      dbClient.query('SELECT id, name, quantity, minimum, category FROM inventory_items ORDER BY id DESC LIMIT 5'),
      dbClient.query('SELECT id, title, type, created_at FROM documents ORDER BY id DESC LIMIT 5')
    ]);

    res.json({
      summary: {
        events: eventsCount.rows[0].count,
        occurrences: occurrencesCount.rows[0].count,
        inventory: inventoryCount.rows[0].count,
        documents: documentsCount.rows[0].count,
        presences: presencesCount.rows[0].count,
        lowStock: lowStockCount.rows[0].count
      },
      recentEvents: recentEvents.rows,
      recentOccurrences: recentOccurrences.rows,
      recentInventory: recentInventory.rows,
      recentDocuments: recentDocuments.rows
    });
  } catch (error) {
    next(error);
  } finally {
    await dbClient.end().catch(() => {});
  }
});

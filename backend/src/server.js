import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Client } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import pino from 'pino';
import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { eventRoutes } from './routes/event.routes.js';
import { inventoryRoutes } from './routes/inventory.routes.js';
import { occurrenceRoutes } from './routes/occurrence.routes.js';
import { documentRoutes } from './routes/document.routes.js';
import { presenceRoutes } from './routes/presence.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { authMiddleware } from './middleware/auth.middleware.js';

dotenv.config({ path: '../.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();
const port = Number(process.env.PORT || 4000);

const dbClient = new Client({
  host: process.env.DB_HOST || 'postgres',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'secult_db',
  user: process.env.DB_USER || 'secult_user',
  password: process.env.DB_PASSWORD || 'secult_pass'
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.get('/api/health', (req, res) => res.json({ ok: true }));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'SECULT API', version: '1.0.0' }
  },
  apis: [path.join(__dirname, 'routes', '*.js')]
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/events', authMiddleware, eventRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/occurrences', occurrenceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/presences', presenceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(errorHandler);

async function start() {
  try {
    await dbClient.connect();
    logger.info('Database connected');
    app.listen(port, () => logger.info(`Backend running on port ${port}`));
  } catch (error) {
    logger.error(error, 'Startup failed');
    process.exit(1);
  }
}

start();

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();

const app = new Hono();

// Middlewares
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Hono UltraFast API Server',
    framework: 'Hono JS',
    status: 'online',
  });
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'HabitDuel Hono API',
    timestamp: new Date().toISOString(),
  });
});

// Mount main routes under /api
const routes = app.route('/api', router);

// Export AppType for Hono RPC Client (`hc`)
export type AppType = typeof routes;

const port = Number(process.env.PORT) || 3000;
console.log(`🚀 HabitDuel Hono Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

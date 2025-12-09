import 'dotenv/config';
import http from 'http';
import app from './app';
import { logger } from './utils/logger';
import { db } from './config/database';
import { initializeJobs } from './jobs';
import { initializeSocket } from './socket';

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Test DB connection
    await db.execute('SELECT 1');
    logger.info('PostgreSQL connected successfully');

    // Initialize Socket.IO
    initializeSocket(server);
    logger.info('Socket.IO initialized');

    // Initialize scheduled jobs
    if (process.env.NODE_ENV !== 'test') {
      initializeJobs();
      logger.info('Scheduled jobs initialized');
    }

    server.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`Swagger docs: http://localhost:${PORT}/api-docs`);
      logger.info(`WebSocket available on ws://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


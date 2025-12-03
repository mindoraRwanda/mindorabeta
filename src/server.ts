import 'dotenv/config';
import app from './app';
import { logger } from './utils/logger';
import { db } from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test DB connection
    await db.execute('SELECT 1');
    logger.info('PostgreSQL connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
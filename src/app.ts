import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { logger } from './utils/logger';
import routes from './routes';

const app = express();

// Security & Performance
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// Routes
app.use('/api/v1', routes);

// Health check
app.get('/', (req, res) => res.send('Mindora Backend Running'));

export default app;

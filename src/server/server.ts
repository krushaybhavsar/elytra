import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { docs } from './api/middleware/docs.middleware';
import { handleError } from './api/middleware/error.middleware';
import { logRequestMiddleware, logResponseMiddleware } from './api/middleware/log.middleware';
import { RegisterRoutes } from './api/routes/routes';
import WinstonLogger from '../utils/log-utils';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { initializeServices } from './services/service.config';

dotenv.config();

export async function initializeLocalServer(): Promise<
  Server<typeof IncomingMessage, typeof ServerResponse>
> {
  await initializeServices();
  const app = express();

  app.use(logRequestMiddleware);
  app.use(logResponseMiddleware);

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Routes
  RegisterRoutes(app);

  // Middleware (the rest of the middleware)
  app.use(docs);
  // @ts-ignore
  app.use(handleError);

  const port = process.env.PORT || 8080;
  const server = app.listen(port, () => {
    const logger = WinstonLogger.getInstance().getLogger('Local Server');
    logger.info(`Local server is running on port ${port}`);
  });

  return server;
}

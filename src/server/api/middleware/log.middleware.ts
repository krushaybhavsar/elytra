import WinstonLogger from '@/utils/log-utils';
import { NextFunction, Request, Response } from 'express';

const loggingService = WinstonLogger.getInstance();
const loggerRequests = loggingService.getLogger('Local Server Request');
const loggerResponse = loggingService.getLogger('Local Server Response');

function logRequestMiddleware(req: Request, res: Response, next: NextFunction) {
  loggerRequests.info({
    message: `Request ${req.method} ${req.url}`,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
  });
  next();
}

function logResponseMiddleware(req: Request, res: Response, next: NextFunction) {
  loggerResponse.info({
    message: `Response ${req.method} ${req.url}. Status: ${res.statusCode}`,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    status: res.statusCode,
  });

  next();
}

export { logRequestMiddleware, logResponseMiddleware };

import WinstonLogger from '@/utils/log-utils';
import { NextFunction, Request, Response } from 'express';
import { ValidateError } from 'tsoa';

const loggingService = WinstonLogger.getInstance();
const loggerError = loggingService.getLogger('Error');

export function handleError(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  if (err instanceof ValidateError) {
    loggerError.error({
      message: `Validation Error: ${req.method} ${req.url}. Error: ${JSON.stringify(err?.fields, null, 2)}`,
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      error: err.message,
      stack: err.stack,
    });
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  } else if (err instanceof Error) {
    loggerError.error({
      message: `Internal Server Error (Type Error): ${req.method} ${req.url}. Error: ${err.message}`,
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      error: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      message: 'Internal Server Error',
      details: err.message,
    });
  } else {
    loggerError.error({
      message: `Unknown Error (Type Object): ${req.method} ${req.url}. Error: ${err}`,
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      error: err,
    });
    return res.status(500).json({
      message: 'Internal Server Error',
      details: 'Unknown error occurred',
    });
  }
}

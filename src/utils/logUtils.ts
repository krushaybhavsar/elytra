import winston from 'winston';
import * as dotenv from 'dotenv';

dotenv.config();

export default class WinstonLogger {
  private winstonLogger: winston.Logger;

  private constructor(options: winston.LoggerOptions = {}) {
    this.winstonLogger = winston.createLogger(options);
  }

  getLogger(name: string): winston.Logger {
    return this.winstonLogger.child({ component: name });
  }

  private static createLogger(): WinstonLogger {
    if (process.env.NODE_ENV === 'development') {
      return WinstonLogger.developmentLogger();
    }
    return WinstonLogger.productionLogger();
  }

  private static productionLogger(): WinstonLogger {
    const options: winston.LoggerOptions = {
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.errors({ stack: true }),
            // customPrintFormat
          ),
        }),
      ],
    };

    return new WinstonLogger(options);
  }

  private static developmentLogger(): WinstonLogger {
    const customPrintFormat: winston.Logform.Format = winston.format.printf(
      ({ level, message, component, timestamp }) => {
        return `${timestamp} [${component}] ${level}: ${message}`;
      },
    );

    // In order for Winston to log to the console, you must add the following line
    // to .vscode/launch.json under the "configurations" array:
    // "outputCapture": "std"
    // Related issue: https://github.com/winstonjs/winston/issues/1544
    const options: winston.LoggerOptions = {
      level: 'debug',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            // winston.format.json(),
            winston.format.errors({ stack: true }),
            winston.format.colorize({ all: true }),
            customPrintFormat,
          ),
        }),
      ],
    };

    return new WinstonLogger(options);
  }

  private static instance: WinstonLogger;

  static getInstance(): WinstonLogger {
    if (!WinstonLogger.instance) {
      WinstonLogger.instance = WinstonLogger.createLogger();
    }
    return WinstonLogger.instance;
  }
}

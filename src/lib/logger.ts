type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    const logEntry = this.formatMessage(level, message, args);

    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](
        `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`,
        ...(args.length ? args : [])
      );
    } else {
      // In production, we might want to send logs to a service
      // For now, we only log errors and warnings
      if (level === 'error' || level === 'warn') {
        console[level](
          `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`,
          ...(args.length ? args : [])
        );
      }
    }

    // Here you could add logic to send logs to a service like:
    // - Application Insights
    // - Sentry
    // - CloudWatch
    // - Custom logging endpoint
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }
}

export const logger = new Logger(); 
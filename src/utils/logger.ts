/**
 * Logging Utility
 * Provides structured logging throughout the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, unknown>;
    error?: Error;
}

class Logger {
    private level: LogLevel;
    private isDevelopment: boolean;

    constructor() {
        this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        const currentLevelIndex = levels.indexOf(this.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= currentLevelIndex;
    }

    private formatMessage(entry: LogEntry): string {
        if (this.isDevelopment) {
            // Pretty format for development
            const emoji = {
                debug: '🔍',
                info: 'ℹ️',
                warn: '⚠️',
                error: '❌'
            };

            let message = `${emoji[entry.level]} [${entry.level.toUpperCase()}] ${entry.message}`;

            if (entry.context) {
                message += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
            }

            if (entry.error) {
                message += `\n  Error: ${entry.error.message}`;
                if (entry.error.stack) {
                    message += `\n  Stack: ${entry.error.stack}`;
                }
            }

            return message;
        } else {
            // JSON format for production
            return JSON.stringify({
                timestamp: entry.timestamp,
                level: entry.level,
                message: entry.message,
                ...entry.context,
                ...(entry.error && {
                    error: {
                        message: entry.error.message,
                        stack: entry.error.stack
                    }
                })
            });
        }
    }

    private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            error
        };

        const formattedMessage = this.formatMessage(entry);

        switch (level) {
            case 'debug':
                console.debug(formattedMessage);
                break;
            case 'info':
                console.info(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'error':
                console.error(formattedMessage);
                break;
        }
    }

    debug(message: string, context?: Record<string, unknown>): void {
        this.log('debug', message, context);
    }

    info(message: string, context?: Record<string, unknown>): void {
        this.log('info', message, context);
    }

    warn(message: string, context?: Record<string, unknown>): void {
        this.log('warn', message, context);
    }

    error(message: string, error?: Error, context?: Record<string, unknown>): void {
        this.log('error', message, context, error);
    }

    // Request logging helper
    logRequest(method: string, path: string, statusCode: number, duration: number): void {
        this.info('HTTP Request', {
            method,
            path,
            statusCode,
            duration: `${duration}ms`
        });
    }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in other files
export type { LogLevel };

/**
 * Logger - Structured logging system for SoonFX
 * Provides log levels, transports, and module-scoped logging
 */

/**
 * Log severity levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, unknown>;
  error?: Error;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  formatter: (entry: LogEntry) => string;
  transports: LogTransport[];
}

/**
 * Log transport interface
 * Transports handle writing log entries to different destinations
 */
export interface LogTransport {
  write(entry: LogEntry): void;
}

/**
 * Console transport - outputs logs to browser/Node console
 */
export class ConsoleTransport implements LogTransport {
  write(entry: LogEntry): void {
    const formatted = this.formatEntry(entry);
    const levelName = LogLevel[entry.level];

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        if (entry.error) {
          console.error(entry.error);
        }
        break;
      default:
        console.log(formatted);
    }
  }

  private formatEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level].padEnd(5);
    const module = entry.module.padEnd(20);
    let message = `[${timestamp}] ${levelName} [${module}] ${entry.message}`;

    if (entry.data && Object.keys(entry.data).length > 0) {
      message += ` ${JSON.stringify(entry.data)}`;
    }

    return message;
  }
}

/**
 * Memory transport - stores logs in an in-memory ring buffer
 */
export class MemoryTransport implements LogTransport {
  private buffer: LogEntry[] = [];
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  write(entry: LogEntry): void {
    this.buffer.push(entry);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }
  }

  /**
   * Get recent log entries
   */
  getLogs(count?: number): LogEntry[] {
    if (count === undefined) {
      return [...this.buffer];
    }
    return this.buffer.slice(-count);
  }

  /**
   * Clear the log buffer
   */
  clear(): void {
    this.buffer = [];
  }

  /**
   * Get the current buffer size
   */
  size(): number {
    return this.buffer.length;
  }
}

/**
 * Callback transport - triggers user-defined callback for each log
 */
export class CallbackTransport implements LogTransport {
  private callback: (entry: LogEntry) => void;

  constructor(callback: (entry: LogEntry) => void) {
    this.callback = callback;
  }

  write(entry: LogEntry): void {
    try {
      this.callback(entry);
    } catch (error) {
      // Avoid infinite loops - use console directly if callback fails
      console.error("Error in log callback:", error);
    }
  }
}

/**
 * Default formatter for log entries
 */
function defaultFormatter(entry: LogEntry): string {
  const timestamp = entry.timestamp.toISOString();
  const levelName = LogLevel[entry.level].padEnd(5);
  const module = entry.module.padEnd(20);
  let message = `[${timestamp}] ${levelName} [${module}] ${entry.message}`;

  if (entry.data && Object.keys(entry.data).length > 0) {
    message += ` ${JSON.stringify(entry.data)}`;
  }

  if (entry.error) {
    message += `\nError: ${entry.error.message}`;
    if (entry.error.stack) {
      message += `\nStack: ${entry.error.stack}`;
    }
  }

  return message;
}

/**
 * Global logger configuration
 */
let globalConfig: LoggerConfig = {
  level: LogLevel.INFO,
  formatter: defaultFormatter,
  transports: [new ConsoleTransport()],
};

/**
 * Module-specific log levels
 */
const moduleLogLevels: Map<string, LogLevel> = new Map();

/**
 * Global memory transport instance for log buffer access
 */
let globalMemoryTransport: MemoryTransport | null = null;

/**
 * Logger class - provides structured logging with module scoping
 */
export class Logger {
  private module: string;
  private config: LoggerConfig;

  constructor(module: string, config?: Partial<LoggerConfig>) {
    this.module = module;
    this.config = {
      level: config?.level ?? globalConfig.level,
      formatter: config?.formatter ?? globalConfig.formatter,
      transports: config?.transports ?? globalConfig.transports,
    };
  }

  /**
   * Check if a log level should be written
   */
  private shouldLog(level: LogLevel): boolean {
    // Check module-specific level first
    const moduleLevel = moduleLogLevels.get(this.module);
    const effectiveLevel = moduleLevel ?? this.config.level;
    return level >= effectiveLevel;
  }

  /**
   * Write a log entry
   */
  private write(level: LogLevel, message: string, error?: Error, data?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      module: this.module,
      message,
      data,
      error,
    };

    for (const transport of this.config.transports) {
      try {
        transport.write(entry);
      } catch (err) {
        // Avoid infinite loops - use console directly if transport fails
        console.error("Error in log transport:", err);
      }
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, data?: Record<string, unknown>): void {
    this.write(LogLevel.DEBUG, message, undefined, data);
  }

  /**
   * Log an info message
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.write(LogLevel.INFO, message, undefined, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.write(LogLevel.WARN, message, undefined, data);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.write(LogLevel.ERROR, message, error, data);
  }

  /**
   * Create a child logger with a submodule name
   */
  child(submodule: string): Logger {
    const childModule = `${this.module}/${submodule}`;
    return new Logger(childModule, this.config);
  }
}

/**
 * Configure the global logger
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
  if (config.level !== undefined) {
    globalConfig.level = config.level;
  }
  if (config.formatter !== undefined) {
    globalConfig.formatter = config.formatter;
  }
  if (config.transports !== undefined) {
    globalConfig.transports = config.transports;
    // Check if MemoryTransport is in the list
    globalMemoryTransport = config.transports.find(
      (t) => t instanceof MemoryTransport
    ) as MemoryTransport | null;
  }
}

/**
 * Set the global log level
 */
export function setLogLevel(level: LogLevel): void {
  globalConfig.level = level;
}

/**
 * Set log level for a specific module
 */
export function setModuleLogLevel(module: string, level: LogLevel): void {
  moduleLogLevels.set(module, level);
}

/**
 * Get recent log entries from memory buffer
 */
export function getLogBuffer(count?: number): LogEntry[] {
  if (globalMemoryTransport) {
    return globalMemoryTransport.getLogs(count);
  }
  return [];
}

/**
 * Create a new logger instance for a module
 */
export function createLogger(module: string): Logger {
  return new Logger(module);
}

/**
 * Initialize default logger configuration with memory transport
 */
export function initializeLogger(): void {
  // Add memory transport if not already present
  const hasMemoryTransport = globalConfig.transports.some(
    (t) => t instanceof MemoryTransport
  );
  if (!hasMemoryTransport) {
    globalMemoryTransport = new MemoryTransport(1000);
    globalConfig.transports.push(globalMemoryTransport);
  }
}

// Initialize logger on module load
initializeLogger();


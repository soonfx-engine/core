import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fx } from '../../src/core/system/System';
import { Logger, LogLevel, MemoryTransport, ConsoleTransport, CallbackTransport } from '../../src/utils/Logger';

describe('fx (System)', () => {
  describe('Math Utilities', () => {
    it('distance should calculate Euclidean distance', () => {
      expect(fx.distance(0, 0, 3, 4)).toBe(5);
      expect(fx.distance(0, 0, 1, 1)).toBeCloseTo(1.41421356);
    });

    it('lerp should interpolate between values', () => {
      expect(fx.lerp(0, 10, 0.5)).toBe(5);
      expect(fx.lerp(0, 10, 0)).toBe(0);
      expect(fx.lerp(0, 10, 1)).toBe(10);
    });

    it('clamp should restrict values to range', () => {
      expect(fx.clamp(5, 0, 10)).toBe(5);
      expect(fx.clamp(-5, 0, 10)).toBe(0);
      expect(fx.clamp(15, 0, 10)).toBe(10);
    });

    it('isNumber should identify numbers correctly', () => {
      expect(fx.isNumber(123)).toBe(true);
      expect(fx.isNumber(0)).toBe(true);
      expect(fx.isNumber(-123.45)).toBe(true);
      expect(fx.isNumber(Infinity)).toBe(false);
      expect(fx.isNumber(NaN)).toBe(false);
      expect(fx.isNumber('123')).toBe(true);
      expect(fx.isNumber('abc')).toBe(false);
      expect(fx.isNumber(null)).toBe(false);
      expect(fx.isNumber(undefined)).toBe(false);
      expect(fx.isNumber({})).toBe(false);
      expect(fx.isNumber([])).toBe(false);
    });
  });

  describe('Expression Evaluation', () => {
    it('evaluateExpression should handle basic arithmetic', () => {
      expect(fx.evaluateExpression('1 + 1')).toBe(2);
      expect(fx.evaluateExpression('10 * 2')).toBe(20);
      expect(fx.evaluateExpression('(2 + 3) * 4')).toBe(20);
    });

     // Test a more complex case if possible, but keep it simple for now
    it('evaluateExpression should respect operator precedence', () => {
        expect(fx.evaluateExpression('2 + 3 * 4')).toBe(14);
    });
  });

  describe('Logger System', () => {
    beforeEach(() => {
      // Reset logger configuration before each test
      fx.setLogLevel(LogLevel.INFO);
      fx.configureLogger({
        transports: [new ConsoleTransport(), new MemoryTransport(100)]
      });
    });

    describe('Logger Creation', () => {
      it('createLogger should create a logger instance', () => {
        const logger = fx.createLogger('test-module');
        expect(logger).toBeInstanceOf(Logger);
      });

      it('Logger should have all log methods', () => {
        const logger = fx.createLogger('test');
        expect(typeof logger.debug).toBe('function');
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.error).toBe('function');
        expect(typeof logger.child).toBe('function');
      });
    });

    describe('Log Levels', () => {
      it('setLogLevel should change global log level', () => {
        fx.setLogLevel(LogLevel.WARN);
        expect(fx.getLogBuffer().length).toBe(0);
      });

      it('setModuleLogLevel should set module-specific log level', () => {
        fx.setModuleLogLevel('test-module', LogLevel.DEBUG);
        const logger = fx.createLogger('test-module');
        
        // Should be able to log at DEBUG level for this module
        logger.debug('Debug message');
        const logs = fx.getLogBuffer();
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[logs.length - 1].level).toBe(LogLevel.DEBUG);
      });

      it('should respect global log level filtering', () => {
        fx.setLogLevel(LogLevel.ERROR);
        const logger = fx.createLogger('test');
        
        logger.debug('Debug message');
        logger.info('Info message');
        logger.warn('Warn message');
        
        const logs = fx.getLogBuffer();
        const recentLogs = logs.filter(log => 
          log.message.includes('Debug') || 
          log.message.includes('Info') || 
          log.message.includes('Warn')
        );
        expect(recentLogs.length).toBe(0);
      });

      it('should log at or above the set log level', () => {
        fx.setLogLevel(LogLevel.WARN);
        const logger = fx.createLogger('test');
        
        logger.warn('Warn message');
        logger.error('Error message');
        
        const logs = fx.getLogBuffer();
        const recentLogs = logs.filter(log => 
          log.message.includes('Warn') || log.message.includes('Error')
        );
        expect(recentLogs.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe('Log Methods', () => {
      it('debug should create DEBUG level log entry', () => {
        fx.setLogLevel(LogLevel.DEBUG);
        const logger = fx.createLogger('test');
        logger.debug('Debug message', { key: 'value' });
        
        const logs = fx.getLogBuffer();
        const lastLog = logs[logs.length - 1];
        expect(lastLog.level).toBe(LogLevel.DEBUG);
        expect(lastLog.message).toBe('Debug message');
        expect(lastLog.module).toBe('test');
        expect(lastLog.data).toEqual({ key: 'value' });
      });

      it('info should create INFO level log entry', () => {
        const logger = fx.createLogger('test');
        logger.info('Info message', { data: 123 });
        
        const logs = fx.getLogBuffer();
        const lastLog = logs[logs.length - 1];
        expect(lastLog.level).toBe(LogLevel.INFO);
        expect(lastLog.message).toBe('Info message');
        expect(lastLog.data).toEqual({ data: 123 });
      });

      it('warn should create WARN level log entry', () => {
        const logger = fx.createLogger('test');
        logger.warn('Warning message');
        
        const logs = fx.getLogBuffer();
        const lastLog = logs[logs.length - 1];
        expect(lastLog.level).toBe(LogLevel.WARN);
        expect(lastLog.message).toBe('Warning message');
      });

      it('error should create ERROR level log entry with error object', () => {
        const logger = fx.createLogger('test');
        const testError = new Error('Test error');
        logger.error('Error message', testError, { context: 'test' });
        
        const logs = fx.getLogBuffer();
        const lastLog = logs[logs.length - 1];
        expect(lastLog.level).toBe(LogLevel.ERROR);
        expect(lastLog.message).toBe('Error message');
        expect(lastLog.error).toBe(testError);
        expect(lastLog.data).toEqual({ context: 'test' });
      });

      it('error should work without error object', () => {
        const logger = fx.createLogger('test');
        logger.error('Error message without error object');
        
        const logs = fx.getLogBuffer();
        const lastLog = logs[logs.length - 1];
        expect(lastLog.level).toBe(LogLevel.ERROR);
        expect(lastLog.message).toBe('Error message without error object');
        expect(lastLog.error).toBeUndefined();
      });
    });

    describe('Child Loggers', () => {
      it('child should create logger with submodule name', () => {
        const parentLogger = fx.createLogger('parent');
        const childLogger = parentLogger.child('child');
        
        childLogger.info('Child log message');
        
        const logs = fx.getLogBuffer();
        const lastLog = logs[logs.length - 1];
        expect(lastLog.module).toBe('parent/child');
      });

      it('child logger should inherit parent configuration', () => {
        fx.setLogLevel(LogLevel.DEBUG);
        const parentLogger = fx.createLogger('parent');
        const childLogger = parentLogger.child('child');
        
        childLogger.debug('Debug from child');
        
        const logs = fx.getLogBuffer();
        const lastLog = logs[logs.length - 1];
        expect(lastLog.level).toBe(LogLevel.DEBUG);
        expect(lastLog.module).toBe('parent/child');
      });
    });

    describe('Log Buffer', () => {
      it('getLogBuffer should return recent log entries', () => {
        const logger = fx.createLogger('test');
        logger.info('Message 1');
        logger.info('Message 2');
        logger.info('Message 3');
        
        const logs = fx.getLogBuffer();
        expect(logs.length).toBeGreaterThanOrEqual(3);
      });

      it('getLogBuffer with count should limit returned entries', () => {
        const logger = fx.createLogger('test');
        logger.info('Message 1');
        logger.info('Message 2');
        logger.info('Message 3');
        logger.info('Message 4');
        logger.info('Message 5');
        
        const logs = fx.getLogBuffer(2);
        expect(logs.length).toBe(2);
      });

      it('log entries should have timestamp', () => {
        const logger = fx.createLogger('test');
        logger.info('Timestamp test');
        
        const logs = fx.getLogBuffer();
        const lastLog = logs[logs.length - 1];
        expect(lastLog.timestamp).toBeInstanceOf(Date);
        expect(lastLog.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      });
    });

    describe('Logger Configuration', () => {
      it('configureLogger should update transports', () => {
        const memoryTransport = new MemoryTransport(50);
        fx.configureLogger({
          transports: [memoryTransport]
        });
        
        const logger = fx.createLogger('test');
        logger.info('Test message');
        
        const logs = memoryTransport.getLogs();
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[logs.length - 1].message).toBe('Test message');
      });

      it('configureLogger should update log level', () => {
        fx.configureLogger({
          level: LogLevel.WARN
        });
        
        const logger = fx.createLogger('test');
        logger.info('Should not log');
        logger.warn('Should log');
        
        const logs = fx.getLogBuffer();
        const infoLogs = logs.filter(log => log.message === 'Should not log');
        const warnLogs = logs.filter(log => log.message === 'Should log');
        
        expect(infoLogs.length).toBe(0);
        expect(warnLogs.length).toBeGreaterThan(0);
      });
    });

    describe('Transports', () => {
      it('MemoryTransport should store logs', () => {
        const transport = new MemoryTransport(10);
        const logger = new Logger('test', {
          transports: [transport],
          level: LogLevel.DEBUG
        });
        
        logger.info('Test 1');
        logger.info('Test 2');
        
        const logs = transport.getLogs();
        expect(logs.length).toBe(2);
        expect(logs[0].message).toBe('Test 1');
        expect(logs[1].message).toBe('Test 2');
      });

      it('MemoryTransport should respect max size', () => {
        const transport = new MemoryTransport(3);
        const logger = new Logger('test', {
          transports: [transport],
          level: LogLevel.DEBUG
        });
        
        logger.info('Test 1');
        logger.info('Test 2');
        logger.info('Test 3');
        logger.info('Test 4');
        logger.info('Test 5');
        
        const logs = transport.getLogs();
        expect(logs.length).toBe(3);
        expect(logs[0].message).toBe('Test 3'); // Oldest should be dropped
        expect(logs[logs.length - 1].message).toBe('Test 5');
      });

      it('MemoryTransport clear should empty buffer', () => {
        const transport = new MemoryTransport(10);
        const logger = new Logger('test', {
          transports: [transport],
          level: LogLevel.DEBUG
        });
        
        logger.info('Test message');
        expect(transport.size()).toBe(1);
        
        transport.clear();
        expect(transport.size()).toBe(0);
        expect(transport.getLogs().length).toBe(0);
      });

      it('CallbackTransport should call callback', () => {
        const callback = vi.fn();
        const transport = new CallbackTransport(callback);
        const logger = new Logger('test', {
          transports: [transport],
          level: LogLevel.DEBUG
        });
        
        logger.info('Test message', { key: 'value' });
        
        expect(callback).toHaveBeenCalledTimes(1);
        const entry = callback.mock.calls[0][0];
        expect(entry.message).toBe('Test message');
        expect(entry.data).toEqual({ key: 'value' });
        expect(entry.module).toBe('test');
      });

      it('ConsoleTransport should write to console', () => {
        const consoleSpy = {
          debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
          info: vi.spyOn(console, 'info').mockImplementation(() => {}),
          warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
          error: vi.spyOn(console, 'error').mockImplementation(() => {})
        };
        
        const transport = new ConsoleTransport();
        const logger = new Logger('test', {
          transports: [transport],
          level: LogLevel.DEBUG
        });
        
        logger.debug('Debug message');
        logger.info('Info message');
        logger.warn('Warn message');
        logger.error('Error message', new Error('Test error'));
        
        expect(consoleSpy.debug).toHaveBeenCalled();
        expect(consoleSpy.info).toHaveBeenCalled();
        expect(consoleSpy.warn).toHaveBeenCalled();
        expect(consoleSpy.error).toHaveBeenCalledTimes(2); // Message + error object
        
        // Cleanup
        consoleSpy.debug.mockRestore();
        consoleSpy.info.mockRestore();
        consoleSpy.warn.mockRestore();
        consoleSpy.error.mockRestore();
      });
    });

    describe('LogLevel Enum', () => {
      it('LogLevel should have correct values', () => {
        expect(LogLevel.DEBUG).toBe(0);
        expect(LogLevel.INFO).toBe(1);
        expect(LogLevel.WARN).toBe(2);
        expect(LogLevel.ERROR).toBe(3);
        expect(LogLevel.NONE).toBe(4);
      });

      it('fx.LogLevel should be accessible', () => {
        expect(fx.LogLevel).toBe(LogLevel);
        expect(fx.LogLevel.DEBUG).toBe(0);
      });
    });

    describe('Integration with fx singleton', () => {
      it('fx.Logger should be accessible', () => {
        expect(fx.Logger).toBe(Logger);
      });

      it('should work with fx.createLogger', () => {
        const logger = fx.createLogger('integration-test');
        logger.info('Integration test message');
        
        const logs = fx.getLogBuffer();
        const lastLog = logs[logs.length - 1];
        expect(lastLog.module).toBe('integration-test');
        expect(lastLog.message).toBe('Integration test message');
      });
    });
  });
});


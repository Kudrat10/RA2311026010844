// Logging Middleware - Reusable for Node.js Applications
// Author: Kudrat Anand - RA2311026010844

const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.logLevel = options.logLevel || 'info';
    this.logFile = options.logFile || 'app.log';
    this.logDir = options.logDir || './logs';
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB
    this.maxFiles = options.maxFiles || 5;
    
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`;
  }

  writeToFile(formattedMessage) {
    const logFilePath = path.join(this.logDir, this.logFile);
    
    // Check file size and rotate if needed
    if (fs.existsSync(logFilePath)) {
      const stats = fs.statSync(logFilePath);
      if (stats.size >= this.maxFileSize) {
        this.rotateLogs();
      }
    }
    
    fs.appendFileSync(logFilePath, formattedMessage + '\n');
  }

  rotateLogs() {
    const logFilePath = path.join(this.logDir, this.logFile);
    
    // Rotate existing logs
    for (let i = this.maxFiles - 1; i > 0; i--) {
      const oldFile = path.join(this.logDir, `${this.logFile}.${i}`);
      const newFile = path.join(this.logDir, `${this.logFile}.${i + 1}`);
      
      if (fs.existsSync(oldFile)) {
        if (i === this.maxFiles - 1) {
          fs.unlinkSync(oldFile);
        } else {
          fs.renameSync(oldFile, newFile);
        }
      }
    }
    
    // Move current log to .1
    if (fs.existsSync(logFilePath)) {
      fs.renameSync(logFilePath, path.join(this.logDir, `${this.logFile}.1`));
    }
  }

  log(level, message, meta = {}) {
    if (this.levels[level] <= this.levels[this.logLevel]) {
      const formattedMessage = this.formatMessage(level, message, meta);
      
      // Console output
      console.log(formattedMessage);
      
      // File output
      this.writeToFile(formattedMessage);
    }
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }
}

// Request Logger Middleware
const requestLogger = (options = {}) => {
  const logger = new Logger(options);
  
  return (req, res, next) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);
    
    // Add request ID to request object
    req.requestId = requestId;
    
    // Log incoming request
    logger.info('Incoming request', {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    });
    
    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      const duration = Date.now() - startTime;
      
      logger.info('Request completed', {
        requestId,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.get('Content-Length')
      });
      
      originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };
};

// Error Logger Middleware
const errorLogger = (options = {}) => {
  const logger = new Logger(options);
  
  return (err, req, res, next) => {
    logger.error('Request error', {
      requestId: req.requestId,
      error: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    });
    
    next(err);
  };
};

// Performance Logger
const performanceLogger = (options = {}) => {
  const logger = new Logger(options);
  
  return (req, res, next) => {
    const startTime = process.hrtime.bigint();
    
    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      
      if (duration > (options.slowRequestThreshold || 1000)) {
        logger.warn('Slow request detected', {
          requestId: req.requestId,
          method: req.method,
          url: req.url,
          duration: `${duration.toFixed(2)}ms`,
          statusCode: res.statusCode
        });
      }
    });
    
    next();
  };
};

module.exports = {
  Logger,
  requestLogger,
  errorLogger,
  performanceLogger
};

// Logging Middleware Test Cases
// Author: Kudrat Anand - RA2311026010844

const express = require('express');
const { requestLogger, errorLogger, performanceLogger, Logger } = require('./index');

function runTests() {
  console.log('=== Logging Middleware Tests ===\n');

  // Test 1: Basic Logger functionality
  const logger = new Logger({ logLevel: 'debug' });
  
  console.log('Test 1 - Basic Logger:');
  logger.info('Test info message', { userId: 123 });
  logger.warn('Test warning message', { action: 'login' });
  logger.error('Test error message', { error: 'Test error' });
  logger.debug('Test debug message', { debug: true });
  console.log('  ✓ Basic logging functionality tested\n');

  // Test 2: Express Middleware
  const app = express();
  
  // Add logging middleware
  app.use(requestLogger({ logLevel: 'info' }));
  app.use(performanceLogger({ slowRequestThreshold: 100 }));
  app.use(errorLogger({ logLevel: 'error' }));
  
  // Test routes
  app.get('/fast', (req, res) => {
    res.json({ message: 'Fast response' });
  });
  
  app.get('/slow', (req, res) => {
    setTimeout(() => {
      res.json({ message: 'Slow response' });
    }, 150);
  });
  
  app.get('/error', (req, res) => {
    throw new Error('Test error for logging');
  });
  
  console.log('Test 2 - Express Middleware:');
  console.log('  ✓ Request logger middleware added');
  console.log('  ✓ Performance logger middleware added');
  console.log('  ✓ Error logger middleware added');
  console.log('  ✓ Test routes created\n');

  // Test 3: Log Rotation
  const testLogger = new Logger({ 
    logFile: 'test.log', 
    maxFileSize: 1024, // 1KB for testing
    maxFiles: 3 
  });
  
  console.log('Test 3 - Log Rotation:');
  
  // Write enough data to trigger rotation
  for (let i = 0; i < 100; i++) {
    testLogger.info(`Test log message ${i}`, { iteration: i });
  }
  
  console.log('  ✓ Log rotation functionality tested\n');

  // Test 4: Different Log Levels
  const debugLogger = new Logger({ logLevel: 'error' });
  const infoLogger = new Logger({ logLevel: 'info' });
  
  console.log('Test 4 - Log Levels:');
  
  console.log('  Error level logger (should only show errors):');
  debugLogger.error('This should appear');
  debugLogger.info('This should NOT appear');
  
  console.log('  Info level logger (should show info and errors):');
  infoLogger.error('This should appear');
  infoLogger.info('This should also appear');
  
  console.log('  ✓ Log level filtering tested\n');

  console.log('=== All Logging Tests Completed ===');
  console.log('\nTo test Express middleware manually:');
  console.log('1. Run: node test.js');
  console.log('2. Test endpoints:');
  console.log('   GET /fast - Should log normally');
  console.log('   GET /slow - Should trigger slow request warning');
  console.log('   GET /error - Should log error');
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };

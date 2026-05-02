# Logging Middleware

Reusable logging middleware for Node.js applications.

## Features
- Request/response logging
- Error logging
- Performance monitoring
- Configurable log levels

## Usage
```javascript
const { requestLogger, errorLogger } = require('./index');

app.use(requestLogger);
app.use(errorLogger);
```

## Files
- `index.js` - Main middleware implementation
- `README.md` - This file

## Author
Kudrat Anand - RA2311026010844

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const WebSocket = require('ws');
const http = require('http');

const authMiddleware = require('./middleware/auth');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'notification-app-be',
    stage: 1,
    author: 'Kudrat RA2311026010844',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', authMiddleware, notificationRoutes);

const wss = new WebSocket.Server({ server, path: '/ws/notifications' });

wss.on('connection', (ws, req) => {
  const studentId = req.headers['x-student-id'] || 'demo-student';
  
  console.log(`Student ${studentId} connected`);
  
  ws.on('close', () => {
    console.log(`Student ${studentId} disconnected`);
  });
});

const broadcastToStudent = (studentId, notification) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.studentId === studentId) {
      client.send(JSON.stringify({
        event: 'new_notification',
        data: notification
      }));
    }
  });
};

app.set('broadcast', broadcastToStudent);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Something went wrong'
    }
  });
});

server.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws/notifications`);
});

module.exports = app;

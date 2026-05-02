const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifications');

// GET /api/notifications - Fetch paginated notifications
router.get('/', notificationController.getNotifications);

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// GET /api/notifications/priority - Get top priority notifications
router.get('/priority', notificationController.getPriorityNotifications);

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', notificationController.markAsRead);

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', notificationController.markAllAsRead);

module.exports = router;

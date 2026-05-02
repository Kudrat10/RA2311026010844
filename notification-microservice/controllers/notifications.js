const notificationStore = require('../data/store');

const getNotifications = (req, res) => {
  const studentId = req.studentId;
  const { page = 1, limit = 20, type, isRead } = req.query;
  
  const filters = {};
  if (type) filters.type = type;
  if (isRead !== undefined) filters.isRead = isRead === 'true';
  
  const allNotifications = notificationStore.getNotificationsByStudent(studentId, filters);
  const total = allNotifications.length;
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedNotifications = allNotifications.slice(startIndex, endIndex);
  
  const unreadCount = notificationStore.countUnread(studentId);
  
  res.json({
    success: true,
    data: {
      notifications: paginatedNotifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        hasNext: endIndex < total
      },
      unreadCount
    }
  });
};

const getUnreadCount = (req, res) => {
  const studentId = req.studentId;
  const unreadCount = notificationStore.countUnread(studentId);
  
  res.json({
    success: true,
    data: { unreadCount }
  });
};

const getPriorityNotifications = (req, res) => {
  const studentId = req.studentId;
  const { limit = 10 } = req.query;
  
  const allNotifications = notificationStore.getNotificationsByStudent(studentId, { isRead: false });
  
  const scoredNotifications = allNotifications.map(n => {
    const hoursAgo = (Date.now() - new Date(n.timestamp)) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 24 - hoursAgo);
    const typeWeight = { 'Placement': 100, 'Result': 50, 'Event': 25 }[n.type] || 10;
    
    return {
      ...n,
      score: Math.round(typeWeight + recencyScore)
    };
  });
  
  scoredNotifications.sort((a, b) => b.score - a.score);
  
  res.json({
    success: true,
    data: {
      notifications: scoredNotifications.slice(0, parseInt(limit))
    }
  });
};

const markAsRead = (req, res) => {
  const { id } = req.params;
  const studentId = req.studentId;
  
  const notification = notificationStore.getNotificationById(id);
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Notification not found' }
    });
  }
  
  if (notification.studentId !== studentId) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Access denied' }
    });
  }
  
  notificationStore.updateNotification(id, { isRead: true });
  
  res.json({
    success: true,
    message: 'Notification marked as read'
  });
};

const markAllAsRead = (req, res) => {
  const studentId = req.studentId;
  const updatedCount = notificationStore.markAllAsRead(studentId);
  
  res.json({
    success: true,
    message: 'All notifications marked as read',
    updatedCount
  });
};

module.exports = {
  getNotifications,
  getUnreadCount,
  getPriorityNotifications,
  markAsRead,
  markAllAsRead
};

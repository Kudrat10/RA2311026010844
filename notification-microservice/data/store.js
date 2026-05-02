
const notifications = [
  {
    id: "d146095a-0d86-4a34-9e69-3900a14576bc",
    studentId: "demo-student",
    type: "Result",
    message: "mid-sem",
    timestamp: "2026-04-22T17:51:30Z",
    isRead: false,
    priority: 2
  },
  {
    id: "b28321bf-ea5a-4b7c-9339-1f2f24bd64b0",
    studentId: "demo-student",
    type: "Placement",
    message: "CSX Corporation hiring",
    timestamp: "2026-04-22T17:51:18Z",
    isRead: false,
    priority: 1
  },
  {
    id: "81589ada-0ad3-4f77-9554-f52fb558ea9d",
    studentId: "demo-student",
    type: "Event",
    message: "farewell",
    timestamp: "2026-04-22T17:51:06Z",
    isRead: true,
    priority: 3
  },
  {
    id: "0005513a-142b-4bbc-8678-eefec65e1ede",
    studentId: "demo-student",
    type: "Result",
    message: "mid-sem",
    timestamp: "2026-04-22T17:50:54Z",
    isRead: false,
    priority: 2
  },
  {
    id: "ea836726-c25e-4f21-a72f-544a6af8a37f",
    studentId: "demo-student",
    type: "Result",
    message: "project-review",
    timestamp: "2026-04-22T17:50:42Z",
    isRead: false,
    priority: 2
  }
];

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getNotificationsByStudent = (studentId, filters = {}) => {
  let result = notifications.filter(n => n.studentId === studentId);
  
  if (filters.type) {
    result = result.filter(n => n.type === filters.type);
  }
  
  if (filters.isRead !== undefined) {
    result = result.filter(n => n.isRead === filters.isRead);
  }
  
  result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return result;
};

const getNotificationById = (id) => {
  return notifications.find(n => n.id === id);
};

// Update notification
const updateNotification = (id, updates) => {
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications[index] = { ...notifications[index], ...updates };
    return notifications[index];
  }
  return null;
};

// Add new notification
const addNotification = (notification) => {
  const newNotification = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    isRead: false,
    ...notification
  };
  notifications.push(newNotification);
  return newNotification;
};

// Count unread notifications
const countUnread = (studentId) => {
  return notifications.filter(n => n.studentId === studentId && !n.isRead).length;
};

// Mark all as read
const markAllAsRead = (studentId) => {
  let count = 0;
  notifications.forEach(n => {
    if (n.studentId === studentId && !n.isRead) {
      n.isRead = true;
      count++;
    }
  });
  return count;
};

module.exports = {
  notifications,
  getNotificationsByStudent,
  getNotificationById,
  updateNotification,
  addNotification,
  countUnread,
  markAllAsRead
};

import axios from 'axios';

// Create axios instance with base URL
// Prefer explicit env URL; in development, fall back to localhost:5000
const resolvedBaseURL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
};

// Workspaces API calls
export const workspacesAPI = {
  getAll: () => api.get('/workspaces'),
  getById: (id) => api.get(`/workspaces/${id}`),
  create: (workspaceData) => api.post('/workspaces', workspaceData),
  update: (id, workspaceData) => api.put(`/workspaces/${id}`, workspaceData),
  delete: (id) => api.delete(`/workspaces/${id}`),
  addMember: (id, memberData) => api.post(`/workspaces/${id}/members`, memberData),
  removeMember: (id, memberId) => api.delete(`/workspaces/${id}/members/${memberId}`),
  updateMemberRole: (id, memberId, role) => api.put(`/workspaces/${id}/members/${memberId}`, { role }),
  getPublic: () => api.get('/workspaces/public'),
};

// Tasks API calls
export const tasksAPI = {
  getAll: (filters = {}) => api.get('/tasks', { params: filters }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`),
  addComment: (id, comment) => api.post(`/tasks/${id}/comments`, { content: comment }),
  addSubtask: (id, subtask) => api.post(`/tasks/${id}/subtasks`, subtask),
  completeSubtask: (id, subtaskId) => api.put(`/tasks/${id}/subtasks/${subtaskId}/complete`),
  updateProgress: (id, progress) => api.put(`/tasks/${id}/progress`, { progress }),
  assign: (id, assigneeId) => api.put(`/tasks/${id}/assign`, { assigneeId }),
  getByWorkspace: (workspaceId) => api.get(`/tasks/workspace/${workspaceId}`),
};

// Roadmaps API calls
export const roadmapsAPI = {
  getAll: () => api.get('/roadmaps'),
  getFeatured: () => api.get('/roadmaps/featured'),
  getByDomain: (domain) => api.get(`/roadmaps/domain/${domain}`),
  getById: (id) => api.get(`/roadmaps/${id}`),
  create: (roadmapData) => api.post('/roadmaps', roadmapData),
  update: (id, roadmapData) => api.put(`/roadmaps/${id}`, roadmapData),
  delete: (id) => api.delete(`/roadmaps/${id}`),
  start: (id) => api.post(`/roadmaps/${id}/start`),
  completeMilestone: (id, milestoneId) => api.put(`/roadmaps/${id}/milestones/${milestoneId}/complete`),
  addMilestone: (id, milestone) => api.post(`/roadmaps/${id}/milestones`, milestone),
  updateMilestone: (id, milestoneId, milestone) => api.put(`/roadmaps/${id}/milestones/${milestoneId}`, milestone),
  getProgress: () => api.get('/roadmaps/progress'),
  getDomains: () => api.get('/roadmaps/domains'),
};

// Chat API calls
export const chatAPI = {
  getMessages: (workspaceId, page = 1) => api.get(`/chat/${workspaceId}/messages`, { params: { page } }),
  sendMessage: (workspaceId, messageData) => api.post(`/chat/${workspaceId}/messages`, messageData),
  getMessage: (messageId) => api.get(`/chat/messages/${messageId}`),
  editMessage: (messageId, content) => api.put(`/chat/messages/${messageId}`, { content }),
  deleteMessage: (messageId) => api.delete(`/chat/messages/${messageId}`),
  markAsRead: (messageId) => api.put(`/chat/messages/${messageId}/read`),
  addReaction: (messageId, reaction) => api.post(`/chat/messages/${messageId}/reactions`, { reaction }),
  removeReaction: (messageId, reaction) => api.delete(`/chat/messages/${messageId}/reactions/${reaction}`),
  getUnreadCount: (workspaceId) => api.get(`/chat/${workspaceId}/unread-count`),
  searchMessages: (workspaceId, query) => api.get(`/chat/${workspaceId}/search`, { params: { q: query } }),
};

// Gamification API calls
export const gamificationAPI = {
  getProfile: () => api.get('/gamification/profile'),
  getLeaderboard: (category = 'overall') => api.get(`/gamification/leaderboard/${category}`),
  getPosition: () => api.get('/gamification/position'),
  getBadges: () => api.get('/gamification/badges'),
  getEarnedBadges: () => api.get('/gamification/badges/earned'),
  getBadgeDetails: (badgeId) => api.get(`/gamification/badges/${badgeId}`),
  checkNewBadges: () => api.get('/gamification/badges/check'),
  getAchievements: () => api.get('/gamification/achievements'),
  getProgress: () => api.get('/gamification/progress'),
  getStreakStats: () => api.get('/gamification/streak'),
  getXPHistory: () => api.get('/gamification/xp-history'),
};

// Time Capsule API calls
export const timeCapsuleAPI = {
  getAll: () => api.get('/timecapsules'),
  getById: (id) => api.get(`/timecapsules/${id}`),
  create: (capsuleData) => api.post('/timecapsules', capsuleData),
  update: (id, capsuleData) => api.put(`/timecapsules/${id}`, capsuleData),
  delete: (id) => api.delete(`/timecapsules/${id}`),
  getReadyForDelivery: () => api.get('/timecapsules/ready'),
  getSharedWithUser: () => api.get('/timecapsules/shared'),
  addReflectionQuestion: (id, question) => api.post(`/timecapsules/${id}/reflections`, { question }),
  addGoal: (id, goal) => api.post(`/timecapsules/${id}/goals`, goal),
  completeGoal: (id, goalId) => api.put(`/timecapsules/${id}/goals/${goalId}/complete`),
  addHabit: (id, habit) => api.post(`/timecapsules/${id}/habits`, habit),
  addRecipient: (id, recipientData) => api.post(`/timecapsules/${id}/recipients`, recipientData),
};

// Careers API calls
export const careersAPI = {
  getAllRoles: () => api.get('/careers/roles'),
  getRoleById: (id) => api.get(`/careers/roles/${id}`),
  getDomains: () => api.get('/careers/domains'),
  searchRoles: (query) => api.get('/careers/roles', { params: { search: query } }),
  filterByDomain: (domain) => api.get('/careers/roles', { params: { domain } }),
};

// Learning Paths API calls
export const learningPathsAPI = {
  getAll: () => api.get('/learning-paths'),
  getById: (id) => api.get(`/learning-paths/${id}`),
  getDomains: () => api.get('/learning-paths/domains'),
  startPath: (id) => api.post(`/learning-paths/${id}/start`),
  takeAssessment: (id, data) => api.post(`/learning-paths/${id}/assessment`, data),
  getProgress: (id) => api.get(`/learning-paths/${id}/progress`),
  updateProgress: (id, data) => api.put(`/learning-paths/${id}/progress`, data),
  searchPaths: (query) => api.get('/learning-paths', { params: { search: query } }),
  filterByDomain: (domain) => api.get('/learning-paths', { params: { domain } }),
  filterByDifficulty: (difficulty) => api.get('/learning-paths', { params: { difficulty } }),
};

// AI API calls
export const aiAPI = {
  enhanceMessage: (payload) => api.post('/ai/enhance-message', payload),
  analyzeSentiment: (payload) => api.post('/ai/analyze-sentiment', payload),
  generateAvatar: (payload) => api.post('/ai/generate-avatar', payload),
};

export default api;

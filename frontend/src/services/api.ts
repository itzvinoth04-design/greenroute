import axios from 'axios';
import { RoutePlanResult, ScoredRouteOption, TrafficLevel } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('greenroute_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  auth: {
    register: (data: any) => apiClient.post('/auth/register', data),
    login: (data: any) => apiClient.post('/auth/login', data),
    googleLogin: (data: any) => apiClient.post('/auth/google-login', data),
    forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (data: any) => apiClient.put('/auth/profile', data),
  },

  routes: {
    calculate: (source: string, destination: string, trafficDensity: TrafficLevel = 'Moderate') =>
      apiClient.post<{ success: boolean; data: RoutePlanResult }>('/routes/calculate', {
        source,
        destination,
        trafficDensity,
      }),
  },

  trips: {
    record: (tripData: any) =>
      apiClient.post('/trips', tripData),
    getMyTrips: () => apiClient.get('/trips/my-trips'),
    getInsights: () => apiClient.get('/trips/insights'),
  },

  rewards: {
    getCatalog: () => apiClient.get('/rewards/catalog'),
    redeem: (rewardItemId: string) => apiClient.post('/rewards/redeem', { rewardItemId }),
    getMyRewards: () => apiClient.get('/rewards/my-rewards'),
    getLeaderboard: () => apiClient.get('/rewards/leaderboard'),
  },

  reports: {
    getReports: () => apiClient.get('/reports'),
    generate: (month?: string) => apiClient.post('/reports/generate', { month }),
    getCSVUrl: (reportId?: string) =>
      `${API_BASE_URL}/reports/export/csv${reportId ? `?reportId=${reportId}` : ''}`,
    getPDFUrl: (reportId?: string) =>
      `${API_BASE_URL}/reports/export/pdf${reportId ? `?reportId=${reportId}` : ''}`,
  },

  ai: {
    chat: (message: string, context?: any) => apiClient.post('/ai/chat', { message, context }),
  },

  admin: {
    getMetrics: () => apiClient.get('/admin/metrics'),
    getUsers: () => apiClient.get('/admin/users'),
    updateUserRole: (userId: string, role: string) => apiClient.patch(`/admin/users/${userId}/role`, { role }),
    deleteUser: (userId: string) => apiClient.delete(`/admin/users/${userId}`),
    getRewards: () => apiClient.get('/admin/rewards'),
    createReward: (data: any) => apiClient.post('/admin/rewards', data),
    toggleRewardStatus: (itemId: string, available: boolean) =>
      apiClient.patch(`/admin/rewards/${itemId}/status`, { available }),
    getReports: () => apiClient.get('/admin/reports'),
  },
};

export default apiClient;

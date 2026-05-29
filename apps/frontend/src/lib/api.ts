import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Auth
export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    api.post('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),

  me: () => api.get('/auth/me').then((r) => r.data),
};

// Todos
export const todosApi = {
  list: () => api.get('/todos').then((r) => r.data),

  create: (data: { title: string; description?: string; status?: string }) =>
    api.post('/todos', data).then((r) => r.data),

  update: (id: string, data: { title?: string; description?: string; status?: string }) =>
    api.put(`/todos/${id}`, data).then((r) => r.data),

  remove: (id: string) => api.delete(`/todos/${id}`).then((r) => r.data),
};

// History
export const historyApi = {
  list: () => api.get('/history').then((r) => r.data),
  reopen: (id: string) => api.post(`/history/${id}/reopen`).then((r) => r.data),
};

// Users
export const usersApi = {
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put('/users/me', data).then((r) => r.data),
};

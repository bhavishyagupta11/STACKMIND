import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const api = axios.create({
  baseURL,
  timeout: 45000, // 45s timeout for AI calls
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Global response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const hasStoredToken = Boolean(localStorage.getItem('token'));

    // Auto-logout only for authenticated requests, not login/signup failures.
    if (err.response?.status === 401 && hasStoredToken && !err.config?.skipAuthRedirect) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

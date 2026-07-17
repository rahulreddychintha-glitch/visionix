import axios from 'axios';
import { getToken, clearAuthStorage } from '../utils/storage';
import { ROUTES } from '../constants/auth.constants';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to append Authorization Header
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle authentication failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns 401 Unauthorized, automatically log out
    if (error.response?.status === 401) {
      clearAuthStorage();
      // Redirect to login if user is not already on login/signup/landing
      const path = window.location.pathname;
      if (path !== ROUTES.LOGIN && path !== ROUTES.SIGNUP && path !== ROUTES.HOME) {
        window.location.href = ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

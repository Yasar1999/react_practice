import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // Base URL for the API

const api = axios.create({ baseURL: BASE_URL });

// Function to get the access token
const getAuthToken = () => localStorage.getItem('access');

// Request Interceptor for adding Authorization
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for handling 401 errors and refreshing tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // const tokenPayload = JSON.parse(atob(getAuthToken().split('.')[1]));
    // const currentTime = Math.floor(Date.now() / 1000);
  
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh');
        const response = await axios.post(`${BASE_URL}/api-token-refresh/`, { refresh: refreshToken });

        if (response.status === 200) {
          const newAccessToken = response.data.access;
          localStorage.setItem('access', newAccessToken); // Store the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Retry original request with new token
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        return Promise.reject(refreshError); // Reject if refresh fails
      }
    }
    return Promise.reject(error);
  }
);

export default api;

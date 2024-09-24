import axios from 'axios';
import { getToken, storeToken } from '@/utils/storage';
import { apiHost } from '@/utils/constants';

const api = axios.create({
  baseURL: `${apiHost}`,
});

// Attach access token to every request
api.interceptors.request.use(async (config) => {
  const token = await getToken('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const refreshToken = async () => {
  const refreshToken = await getToken('refresh_token');
  const { data } = await axios.post('/auth/refresh', { token: refreshToken });
  await storeToken(data.access_token, refreshToken);
  return data.access_token;
};

// Handle token expiration and refreshing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
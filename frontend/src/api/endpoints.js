import { apiRequest } from './httpClient';

export const healthcheck = () =>
  apiRequest({ endpoint: '/api/v1/healthcheck' });

export const login = (credentials) =>
  apiRequest({
    endpoint: '/api/v1/users/login',
    method: 'POST',
    body: credentials,
  });

export const register = (formData) =>
  apiRequest({
    endpoint: '/api/v1/users/register',
    method: 'POST',
    body: formData,
  });

export const logout = (token) =>
  apiRequest({
    endpoint: '/api/v1/users/logout',
    method: 'POST',
    token,
  });

export const refreshSession = (refreshToken) =>
  apiRequest({
    endpoint: '/api/v1/users/refresh-token',
    method: 'POST',
    body: { refreshToken },
  });

export const getCurrentUser = (token) =>
  apiRequest({
    endpoint: '/api/v1/users/current-user',
    token,
  });

export const getVideos = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      search.set(key, value);
    }
  });

  const query = search.toString();
  return apiRequest({
    endpoint: `/api/v1/video${query ? `?${query}` : ''}`,
  });
};

export const getDashboardStats = (token) =>
  apiRequest({
    endpoint: '/api/v1/dashboard/stats',
    token,
  });

export const getChannelVideos = (token) =>
  apiRequest({
    endpoint: '/api/v1/dashboard/videos',
    token,
  });

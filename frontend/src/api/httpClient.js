const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const buildHeaders = (token, isFormData) => {
  const headers = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async ({ endpoint, method = 'GET', body, token }) => {
  const isFormData = body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: 'include',
    headers: buildHeaders(token, isFormData),
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const payload = await response.json().catch(() => ({
    message: 'Unable to parse server response.',
  }));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
};

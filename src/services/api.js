const API_BASE = '/api';

function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('secult-auth-token-v1');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Erro na requisição.';
    throw new Error(message);
  }

  return data;
}

export const api = {
  get(path) {
    return request(path, { method: 'GET' });
  },
  post(path, body) {
    return request(path, { method: 'POST', body: JSON.stringify(body || {}) });
  },
  patch(path, body) {
    return request(path, { method: 'PATCH', body: JSON.stringify(body || {}) });
  }
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null;

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = payload?.msg || payload?.message || 'Request failed';
    throw new Error(msg);
  }

  return payload?.data ?? payload;
}

export const PostsAPI = {
  list: () => api('/posts'),
  get: (id) => api(`/posts/${id}`),
  create: (data) =>
    api('/posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    api(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => api(`/posts/${id}`, { method: 'DELETE' }),
};

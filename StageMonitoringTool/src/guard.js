let cachedUser = null;

export async function requireAuth() {
  const loginPaths = ['/', '/login', '/set-password'];
  if (loginPaths.includes(window.location.pathname)) return null;
  if (cachedUser) return cachedUser;
  try {
    const res = await fetch('/me', { credentials: 'include' });
    const data = await res.json();
    if (data.loggedIn && data.user) {
      cachedUser = data.user;
      return data.user;
    }
  } catch {}
  cachedUser = null;
  window.location.href = '/login';
  return null;
}

export function clearAuthCache() {
  cachedUser = null;
}

export async function apiFetch(url, options = {}) {
  const user = await requireAuth();
  if (!user) throw new Error('Niet geautoriseerd');
  const res = await fetch(url, { ...options, credentials: 'include' });
  if (res.status === 401) {
    clearAuthCache();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return res;
}

export function wrapFetch() {
  const origFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url === '/me' || url.startsWith('/me?')) {
      return origFetch(input, init);
    }
    const loginPaths = ['/', '/login', '/set-password'];
    const currentPath = window.location.pathname;
    if (!loginPaths.includes(currentPath)) {
      try {
        const meRes = await origFetch('/me', { credentials: 'include' });
        const meData = await meRes.json();
        if (!meData.loggedIn) {
          clearAuthCache();
          window.location.href = '/login';
          throw new Error('Niet geautoriseerd');
        }
        cachedUser = meData.user;
      } catch (err) {
        if (err.message === 'Niet geautoriseerd') throw err;
        clearAuthCache();
        window.location.href = '/login';
        throw new Error('Niet geautoriseerd');
      }
    }
    return origFetch(input, { ...init, credentials: 'include' });
  };
}

/**
 * API helper
 * - setToken/getToken/clearToken: client-side (localStorage)
 * - apiFetch: inclui Authorization automaticamente (quando houver token)
 */

const TOKEN_KEY = 'geofiber_token';

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

type ApiFetchOptions = RequestInit & {
  json?: any;
};

export async function apiFetch(path: string, opts: ApiFetchOptions = {}) {
  const headers = new Headers(opts.headers || {});
  headers.set('Accept', 'application/json');

  let body = opts.body;

  if (opts.json !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(opts.json);
  }

  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(path, { ...opts, headers, body });

  const text = await res.text();
  let data: any = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

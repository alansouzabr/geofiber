const TOKEN_KEY = 'gf_token';

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

export type ApiFetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  json?: unknown;
  body?: BodyInit | null;
  signal?: AbortSignal;
};

function resolveBaseUrl(): string {
  const v = process.env.NEXT_PUBLIC_API_URL;
  return v && v.trim().length ? v : 'http://127.0.0.1:3000';
}

export async function apiFetch<T = unknown>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  const base = resolveBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | null | undefined = opts.body;

  if (opts.json !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    body = JSON.stringify(opts.json);
  }

  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers,
    body,
    signal: opts.signal,
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const data: unknown = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '');

  if (!res.ok) {
    const msg =
      (typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof (data as { error: unknown }).error === 'string'
          ? (data as { error: string }).error
          : `HTTP ${res.status}`);

    throw new Error(msg);
  }

  return data as T;
}

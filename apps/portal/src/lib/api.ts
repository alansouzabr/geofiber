const API_URL = "https://api.geofibers.com.br";

export async function apiFetch(
  path: string,
  options: any = {}
) {

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  console.log(
    "TOKEN:",
    token ? "OK" : "NULL"
  );

  const isExternal =
    path.startsWith("http://") ||
    path.startsWith("https://");

  const finalUrl =
    isExternal
      ? path
      : API_URL + path;

  const res = await fetch(finalUrl, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization:
              `Bearer ${token}`
          }
        : {}),

      ...(options.headers || {})
    }
  });

  if (!res.ok) {

    console.error(
      "API ERROR:",
      res.status,
      finalUrl
    );

    const text =
      await res.text();

    console.error(text);

    throw new Error(
      `API ${res.status}`
    );
  }

  return res.json();
}

export function setToken(
  token: string
) {
  localStorage.setItem(
    "token",
    token
  );
}

export function getToken() {
  return localStorage.getItem(
    "token"
  );
}

export function clearToken() {
  localStorage.removeItem(
    "token"
  );
}

const api = {

  get: (path: string) =>
    apiFetch(path),

  post: (
    path: string,
    body: any
  ) =>
    apiFetch(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export default api;

export type CurrentUser = {
  id?: string;
  name?: string;
  email?: string;
  companyId?: string;
  role?: string;
  permissions?: string[];
};

export function getCurrentUser(): CurrentUser {

  if (typeof window === "undefined") {
    return {};
  }

  try {

    const raw = localStorage.getItem("user");

    if (!raw) {
      return {};
    }

    return JSON.parse(raw);

  } catch {

    return {};

  }

}

export function getCurrentRole() {

  return getCurrentUser().role || "TECNICO";

}

export function getToken() {

  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");

}

export function setToken(token: string) {

  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("token", token);

}

export function clearToken() {

  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");

}

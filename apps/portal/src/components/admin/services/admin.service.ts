const API =
  "https://api.geofibers.com.br";

function getToken() {
  return localStorage.getItem("token");
}

async function request(
  endpoint: string,
  options?: RequestInit
) {

  const res = await fetch(
    `${API}${endpoint}?_=${Date.now()}`,
    {
      cache: "no-store",

      ...options,

      headers: {
        "Content-Type":
          "application/json",

        "Cache-Control":
          "no-cache, no-store, must-revalidate",

        Pragma:
          "no-cache",

        Expires:
          "0",

        Authorization:
          `Bearer ${getToken()}`,

        ...(options?.headers || {})
      }
    }
  );

  if (!res.ok) {

    const text =
      await res.text();

    throw new Error(text);
  }

  return res.json();
}

export async function getAdminStats() {
  return request("/admin/stats");
}

export async function getCompanies() {
  return request("/admin/companies");
}

export async function activateCompany(
  id: string
) {

  return request(
    `/admin/company/${id}/activate`,
    {
      method: "PATCH"
    }
  );
}

export async function deactivateCompany(
  id: string
) {

  return request(
    `/admin/company/${id}/deactivate`,
    {
      method: "PATCH"
    }
  );
}

export async function deleteCompany(
  id: string
) {

  return request(
    `/admin/company/${id}`,
    {
      method: "DELETE"
    }
  );
}


export async function getPlans() {

  return request(
    "/admin/plans"
  );
}

export async function updateCompany(
  id: string,
  body: any
) {

  return request(
    `/company-management/${id}`,
    {

      method: "PATCH",

      body: JSON.stringify(body)
    }
  );
}

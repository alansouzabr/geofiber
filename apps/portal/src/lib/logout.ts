import { apiFetch } from "@/lib/api";
export async function logoutPortal() {
  try {
    await apiFetch("/auth/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
  } catch {}

  try {
    localStorage.removeItem("gf_token");
    localStorage.removeItem("gf_company_id");
    localStorage.removeItem("geofiber_companyId");
    sessionStorage.clear();
  } catch {}

  try {
    document.cookie.split(";").forEach((c) => {
      const eq = c.indexOf("=");
      const name = eq > -1 ? c.slice(0, eq).trim() : c.trim();
      if (!name) return;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.geofibers.com.br`;
    });
  } catch {}

  window.location.replace("/login");
}

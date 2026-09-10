import { apiFetch } from "@/lib/api";

export type MeResponse = {
  id?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email?: string;
  companyId?: string;
  company?: {
    id?: string;
    name?: string;
  };
};

export async function getMe() {
  return apiFetch("/auth/me", {
    method: "GET",
  });
}

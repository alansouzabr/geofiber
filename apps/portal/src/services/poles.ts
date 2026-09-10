import { apiFetch } from "@/lib/api";
const API = "";

export type ApiPole = {
  id: string;
  company_id: string | null;
  user_id: string | null;
  folder_id: string | null;
  name: string | null;
  lat: number;
  lng: number;
  address: string | null;
  notes: string | null;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export async function getPoles(token: string) {
  const res = await apiFetch(`/api/poles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Erro ao buscar postes");

  return res.json() as Promise<ApiPole[]>;
}

export async function createPole(token: string, pole: any) {
  const res = await apiFetch(`/api/poles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pole),
  });

  if (!res.ok) throw new Error("Erro ao criar poste");

  return res.json() as Promise<ApiPole>;
}

export async function updatePole(token: string, id: string, pole: any) {
  const res = await apiFetch(`${API}/poles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pole),
  });

  if (!res.ok) throw new Error("Erro ao atualizar poste");

  return res.json() as Promise<ApiPole>;
}

export async function deletePole(token: string, id: string) {
  const res = await apiFetch(`${API}/poles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao excluir poste");

  return true;
}

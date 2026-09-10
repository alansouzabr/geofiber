import { apiFetch, getToken } from "@/lib/api";

export type ProjectFolderDto = {
  id: string;
  name: string;
  parentId: string | null;
};

export type CreateProjectFolderInput = {
  name: string;
  parentId?: string | null;
};

export type UpdateProjectFolderInput = {
  name?: string;
};

function authHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("Token não encontrado");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function listProjectFolders() {
  return apiFetch("/project-folders", {
    method: "GET",
    headers: authHeaders(),
  });
}

export async function createProjectFolder(input: CreateProjectFolderInput) {
  return apiFetch("/project-folders", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      name: input.name,
      parentId: input.parentId ?? null,
    }),
  });
}

export async function renameProjectFolder(
  id: string,
  input: UpdateProjectFolderInput
) {
  return apiFetch(`/project-folders/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      name: input.name,
    }),
  });
}

export async function deleteProjectFolder(id: string) {
  return apiFetch(`/project-folders/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

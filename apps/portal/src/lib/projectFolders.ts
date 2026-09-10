import { apiFetch } from "./api";

export async function listProjectFolders() {
  return apiFetch("/project-folders");
}

export async function createProjectFolder(data:any) {
  return apiFetch("/project-folders", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

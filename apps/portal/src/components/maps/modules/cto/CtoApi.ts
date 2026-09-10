import type { Cto } from "./types";

export async function listCtos(
  poleId: string
): Promise<Cto[]> {
  return [];
}

export async function createCto(
  data: Partial<Cto>
): Promise<Cto> {
  throw new Error("createCto não implementado");
}

export async function updateCto(
  id: string,
  data: Partial<Cto>
): Promise<Cto> {
  throw new Error("updateCto não implementado");
}

export async function deleteCto(
  id: string
): Promise<void> {
  throw new Error("deleteCto não implementado");
}

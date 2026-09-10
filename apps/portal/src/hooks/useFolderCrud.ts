"use client";

import { apiFetch, getToken } from "@/lib/api";
import { useCallback, useState } from "react";

export type FolderItem = {
  id: string;
  name: string;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type UseFolderCrudOptions = {
  onError?: (error: unknown) => void;
};

async function request<T>(
  url: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
  } = {}
): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Token não encontrado");

  const res = await apiFetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export function useFolderCrud({ onError }: UseFolderCrudOptions = {}) {
  const [isFoldersSaving, setIsFoldersSaving] = useState(false);
  const [foldersError, setFoldersError] = useState<string | null>(null);

  const createFolder = useCallback(async (input: { name: string; parentId?: string | null }) => {
    setIsFoldersSaving(true);
    setFoldersError(null);

    try {
      return await request<FolderItem>("/folders", {
        method: "POST",
        body: input,
      });
    } catch (err) {
      setFoldersError("Erro ao criar pasta");
      onError?.(err);
      throw err;
    } finally {
      setIsFoldersSaving(false);
    }
  }, [onError]);

  return {
    isFoldersSaving,
    foldersError,
    createFolder,
  };
}

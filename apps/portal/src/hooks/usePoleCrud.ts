"use client";

import { useCallback, useState } from "react";
import type { Feature } from "@/components/geofiber-map/editor/types";
import { apiFetch, getToken } from "@/lib/api";

export type CreatePoleFeatureInput = {
  name: string;
  lat: number;
  lng: number;
  notes?: string;
  visible?: boolean;
  folderId?: string | null;
  color?: string;
  iconKey?: string;
};

export type UpdatePoleFeaturePatch = Partial<{
  name: string;
  notes: string;
  visible: boolean;
  folderId: string | null;
  color: string;
  iconKey: string;
}>;

export type ApiPole = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  notes?: string;
  visible?: boolean;
  folderId?: string | null;
  color?: string;
  iconKey?: string;
};

export type SetFeaturesFn = (
  value: Feature[] | ((prev: Feature[]) => Feature[])
) => void;

export type UsePoleCrudOptions = {
  setFeatures: SetFeaturesFn;
  onError?: (error: unknown) => void;
};

async function svcGetPoles(token: string): Promise<ApiPole[]> {
  const res = await apiFetch("/poles", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar postes");
  }

  return res.json();
}

function apiPoleToFeature(p: ApiPole): Feature {
  return {
    id: p.id,
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    notes: p.notes || "",
    visible: p.visible ?? true,
    folderId: p.folderId ?? null,
    color: p.color,
    iconKey: p.iconKey,
  } as Feature;
}

function mergeLoadedPoles(prev: Feature[], rows: ApiPole[]): Feature[] {
  const map = new Map(prev.map((f) => [f.id, f]));
  for (const row of rows) {
    map.set(row.id, apiPoleToFeature(row));
  }
  return Array.from(map.values());
}

export function usePoleCrud({ setFeatures, onError }: UsePoleCrudOptions) {
  const [loading, setLoading] = useState(false);

  const loadPoles = useCallback(async () => {
    setLoading(true);

    try {
      const token = getToken();
      if (!token) throw new Error("Token não encontrado");

      const rows = await svcGetPoles(token);

      setFeatures((prev) => mergeLoadedPoles(prev, rows));

      return rows.map(apiPoleToFeature);
    } catch (err) {
      onError?.(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setFeatures, onError]);

  return {
    loading,
    loadPoles,
  };
}

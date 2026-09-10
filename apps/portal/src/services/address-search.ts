import { apiFetch } from "@/lib/api";
export type AddressSearchByCoordsInput = {
  lat: string | number;
  lng: string | number;
};

export type AddressSearchByCepNumberInput = {
  cep?: string;
  number?: string;
  complemento?: string;
};

export type AddressSearchResult = {
  lat: number;
  lng: number;
  label: string;
};

function clean(v: unknown) {
  return String(v ?? "").trim();
}

export function parseCoordsInput(
  input: AddressSearchByCoordsInput
): AddressSearchResult | null {
  const lat = Number(input.lat);
  const lng = Number(input.lng);

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return {
    lat,
    lng,
    label: `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
  };
}

export function buildCepNumberQuery(input: AddressSearchByCepNumberInput) {
  const cep = clean(input.cep);
  const number = clean(input.number);
  const complemento = clean(input.complemento);

  return [cep, number, complemento].filter(Boolean).join(", ");
}

export async function searchAddressByCepNumber(
  input: AddressSearchByCepNumberInput
): Promise<AddressSearchResult | null> {
  const query = buildCepNumberQuery(input);
  if (!query) return null;

  const res = await apiFetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Falha na busca de endereço (${res.status})`);
  }

  const data = await res.json();

  if (!Array.isArray(data) || !data[0]) return null;

  const lat = Number(data[0].lat);
  const lng = Number(data[0].lon);
  const label = String(data[0].display_name || query);

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return {
    lat,
    lng,
    label,
  };
}

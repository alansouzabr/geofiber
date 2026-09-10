"use client";

import { useCallback, useState } from "react";
import {
  parseCoordsInput,
  searchAddressByCepNumber,
  type AddressSearchResult,
} from "@/services/address-search";

type AddressSearchDetail = {
  mode?: "coords" | "cep_numero";
  lat?: string | number;
  lng?: string | number;
  cep?: string;
  number?: string;
  complemento?: string;
};

export function useAddressSearch() {
  const [searchHit, setSearchHit] = useState<AddressSearchResult | null>(null);
  const [searchSaved, setSearchSaved] = useState(false);
  const [searchResultLabel, setSearchResultLabel] = useState("");

  const clearSearch = useCallback(() => {
    setSearchHit(null);
    setSearchSaved(false);
    setSearchResultLabel("");
  }, []);

  const markSearchSaved = useCallback(() => {
    setSearchSaved(true);
  }, []);

  const updateSearchHitPosition = useCallback((lat: number, lng: number) => {
    setSearchSaved(false);
    setSearchHit((prev) =>
      prev
        ? {
            ...prev,
            lat,
            lng,
            label: prev.label.includes("(ajustado manualmente)")
              ? prev.label
              : `${prev.label} (ajustado manualmente)`,
          }
        : prev
    );
  }, []);

  const runAddressSearch = useCallback(
    async (detail: AddressSearchDetail): Promise<AddressSearchResult | null> => {
      setSearchSaved(false);

      if (detail.mode === "coords") {
        const result = parseCoordsInput({
          lat: detail.lat ?? "",
          lng: detail.lng ?? "",
        });

        if (result) {
          setSearchHit(result);
          setSearchResultLabel(result.label);
          return result;
        }

        return null;
      }

      if (detail.mode === "cep_numero") {
        const result = await searchAddressByCepNumber({
          cep: detail.cep,
          number: detail.number,
          complemento: detail.complemento,
        });

        if (result) {
          setSearchHit(result);
          setSearchResultLabel(result.label);
          return result;
        }

        return null;
      }

      return null;
    },
    []
  );

  return {
    searchHit,
    searchSaved,
    searchResultLabel,
    setSearchHit,
    setSearchSaved,
    clearSearch,
    markSearchSaved,
    updateSearchHitPosition,
    runAddressSearch,
  };
}
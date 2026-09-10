"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as pmtiles from "pmtiles";
import * as protomapsL from "protomaps-leaflet";

type Props = {
  pmtilesUrl?: string;
};

export default function ProtomapsLayer({ pmtilesUrl = "/tiles/basemap.pmtiles" }: Props) {
  const map = useMap();

  useEffect(() => {
    const p = new pmtiles.PMTiles(pmtilesUrl);

    // registrar protocolo pmtiles
    // @ts-ignore
    protomapsL.setProtocol("pmtiles", p);

    // criar layer
    // @ts-ignore
    const layer: any = protomapsL.leafletLayer({
      url: `pmtiles://${pmtilesUrl}`,
    });

    layer.addTo(map);

    return () => {
      try {
        map.removeLayer(layer);
      } catch {}
    };
  }, [map, pmtilesUrl]);

  return null;
}
"use client";

import dynamic from "next/dynamic";

const GeoFiberMapClient = dynamic(() => import("./GeoFiberMapClient"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#07141d",
        color: "#d7d7d7",
        fontSize: 14,
      }}
    >
      Carregando GeoFiber Maps...
    </div>
  ),
});

export default function GeoFiberMap() {
  return <GeoFiberMapClient />;
}
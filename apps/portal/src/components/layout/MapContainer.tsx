"use client";

export default function MapContainer({ children }: any) {
  return (
    <div style={{
      width: "100vw",
      height: "calc(100vh - 60px)", // respeita header global
      position: "relative"
    }}>
      {children}
    </div>
  );
}

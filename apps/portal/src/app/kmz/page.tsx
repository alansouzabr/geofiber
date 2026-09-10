"use client";

import { useEffect } from "react";

export default function KMZPage() {

  useEffect(() => {

    const script =
      document.createElement("script");

    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";

    script.async = true;

    document.body.appendChild(script);

  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "#fff",
        padding: "30px"
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "10px"
        }}
      >
        🗺️ Distribuidor KMZ/KML
      </h1>

      <p
        style={{
          opacity: 0.8,
          marginBottom: "30px"
        }}
      >
        Distribuição automática de postes em rotas Google Earth
      </p>

      <iframe
        src="/kmz-enterprise.html"
        style={{
          width: "100%",
          height: "85vh",
          border: "none",
          borderRadius: "12px",
          background: "#fff"
        }}
      />
    </div>
  );
}

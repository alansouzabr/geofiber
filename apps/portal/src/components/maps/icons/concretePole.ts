import L from "leaflet";

export const concretePoleIcon =
  L.divIcon({

    className: "",

    html: `
      <div style="
        width:16px;
        height:16px;
        border-radius:50%;
        background:#9ca3af;
        border:3px solid #d1d5db;
        box-shadow:0 0 8px #000;
      "></div>
    `,

    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

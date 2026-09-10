import L from "leaflet";

export const metalPoleIcon =
  L.divIcon({

    className: "",

    html: `
      <div style="
        width:16px;
        height:16px;
        background:#94a3b8;
        border:3px solid #e2e8f0;
        box-shadow:0 0 8px #000;
      "></div>
    `,

    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

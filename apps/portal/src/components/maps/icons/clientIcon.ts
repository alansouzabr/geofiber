import L from "leaflet";

export const clientIcon =
  L.divIcon({

    className: "",

    html: `
      <div style="
        font-size:20px;
        filter:drop-shadow(0 0 6px black);
      ">
        👤
      </div>
    `,

    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

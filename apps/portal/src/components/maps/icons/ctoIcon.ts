import L from "leaflet";

export function ctoIcon(
  color = "#22c55e"
) {

  return L.divIcon({

    className: "",

    html: `
      <div style="
        width:14px;
        height:28px;
        border-radius:6px;
        background:${color};
        border:2px solid white;
        box-shadow:0 0 10px #000;
      "></div>
    `,

    iconSize: [14, 28],
    iconAnchor: [7, 14]
  });
}

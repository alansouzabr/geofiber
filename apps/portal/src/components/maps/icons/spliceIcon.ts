import L from "leaflet";

export function spliceIcon(
  color = "#f59e0b"
) {

  return L.divIcon({

    className: "",

    html: `
      <div style="
        width:18px;
        height:18px;
        border-radius:50%;
        background:${color};
        border:3px solid white;
        box-shadow:0 0 10px #000;
      "></div>
    `,

    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

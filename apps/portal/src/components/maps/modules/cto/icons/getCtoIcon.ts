import L from "leaflet";

let icon: L.DivIcon | null = null;

export default function getCtoIcon() {

  if (icon) return icon;

  icon = L.divIcon({

    className: "",

    html: `
      <div
        style="
          width:30px;
          height:22px;
          background:#1f2937;
          border:2px solid #06b6d4;
          border-radius:6px;
          color:white;
          font-size:10px;
          font-weight:bold;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 0 8px rgba(6,182,212,.45);
          position:relative;
        "
      >

        CTO

        <div
          style="
            position:absolute;
            right:-5px;
            top:3px;
            display:flex;
            flex-direction:column;
            gap:2px;
          "
        >

          <span style="width:3px;height:3px;background:#06b6d4;border-radius:50%;display:block"></span>
          <span style="width:3px;height:3px;background:#06b6d4;border-radius:50%;display:block"></span>
          <span style="width:3px;height:3px;background:#06b6d4;border-radius:50%;display:block"></span>
          <span style="width:3px;height:3px;background:#06b6d4;border-radius:50%;display:block"></span>

        </div>

      </div>
    `,

    iconSize: [30,22],

    iconAnchor: [15,11]

  });

  return icon;

}

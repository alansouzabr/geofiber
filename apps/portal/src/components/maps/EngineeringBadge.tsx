"use client";

import {
  Cpu,
  RadioTower
} from "lucide-react";

export default function EngineeringBadge() {

  return (

    <div
      className="
        absolute
        bottom-5
        right-5
        z-[9999]
        bg-slate-950/95
        border
        border-slate-800
        rounded-2xl
        px-5
        py-4
        shadow-2xl
        backdrop-blur-xl
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <RadioTower
          className="
            text-cyan-400
          "
          size={22}
        />

        <div>

          <p
            className="
              text-sm
              font-bold
              text-white
            "
          >
            GeoFiber GIS
          </p>

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            FTTH Engineering • AutoSave • AutoSave
          </p>

        </div>

        <Cpu
          className="
            text-emerald-400
          "
          size={18}
        />

      </div>

    </div>
  );
}

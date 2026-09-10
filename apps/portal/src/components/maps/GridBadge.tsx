"use client";

import {
  Grid3X3
} from "lucide-react";

export default function GridBadge() {

  return (

    <div
      className="
        absolute
        bottom-5
        left-[340px]
        z-[9999]
        bg-slate-950/95
        border
        border-slate-800
        rounded-2xl
        px-5
        py-3
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

        <Grid3X3
          className="
            text-cyan-400
          "
          size={18}
        />

        <div>

          <p
            className="
              text-sm
              font-bold
              text-white
            "
          >
            Grid Engineering
          </p>

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            Magnetic Snap Enabled
          </p>

        </div>

      </div>

    </div>
  );
}

"use client";

import {
  MapPinned,
  RadioTower,
  Network,
  Cable
} from "lucide-react";

interface Props {

  selectedElement: any;
}

export default function EngineeringPanel({
  selectedElement
}: Props) {

  if (!selectedElement)
    return null;

  return (

    <div
      className="
        absolute
        top-5
        left-[340px]
        z-[9999]
        w-[320px]
        bg-slate-950/95
        border
        border-slate-800
        rounded-2xl
        p-5
        shadow-2xl
        backdrop-blur-xl
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          mb-5
        "
      >

        <RadioTower
          className="
            text-cyan-400
          "
          size={22}
        />

        <div>

          <h2
            className="
              text-lg
              font-bold
              text-white
            "
          >
            Engenharia FTTH
          </h2>

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            GeoFiber Enterprise
          </p>

        </div>

      </div>

      <div className="space-y-4">

        <div>

          <p
            className="
              text-xs
              text-slate-500
              mb-1
            "
          >
            Tipo
          </p>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              px-3
              py-2
              text-sm
            "
          >
            {selectedElement.type}
          </div>

        </div>

        <div>

          <p
            className="
              text-xs
              text-slate-500
              mb-1
            "
          >
            Latitude
          </p>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              px-3
              py-2
              text-sm
            "
          >
            {selectedElement.position?.[0]}
          </div>

        </div>

        <div>

          <p
            className="
              text-xs
              text-slate-500
              mb-1
            "
          >
            Longitude
          </p>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              px-3
              py-2
              text-sm
            "
          >
            {selectedElement.position?.[1]}
          </div>

        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-3
          "
        >

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              p-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                mb-2
              "
            >

              <Cable
                size={15}
                className="
                  text-cyan-400
                "
              />

              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                STATUS
              </span>

            </div>

            <p
              className="
                text-sm
                font-bold
                text-emerald-400
              "
            >
              ONLINE
            </p>

          </div>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              p-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                mb-2
              "
            >

              <Network
                size={15}
                className="
                  text-cyan-400
                "
              />

              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                ENGINE
              </span>

            </div>

            <p
              className="
                text-sm
                font-bold
                text-cyan-400
              "
            >
              GPON
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

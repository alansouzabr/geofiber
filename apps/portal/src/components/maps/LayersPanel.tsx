"use client";

import {
  Layers3
} from "lucide-react";

import DraggablePanel
from "@/components/maps/floating/DraggablePanel";

interface Props {

  layers: any;

  setLayers: any;
}

export default function LayersPanel({
  layers,
  setLayers
}: Props) {

  const items = [

    {
      key: "postes",
      label: "Postes"
    },

    {
      key: "cto",
      label: "CTOs"
    },

    {
      key: "splitters",
      label: "Splitters"
    },

    {
      key: "splice",
      label: "Caixas Emenda"
    },

    {
      key: "clients",
      label: "Clientes"
    },

    {
      key: "fibers",
      label: "Fibra"
    }
  ];

  return (

    <DraggablePanel

      title="Layers GIS"

      initialX={1320}

      initialY={90}

      initialWidth={220}

      initialHeight={290}
    >

      <div
        className="
          h-full

          bg-slate-950/95

          p-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-1.5

            mb-3
          "
        >

          <Layers3
            size={14}
            className="text-cyan-400"
          />

          <h2
            className="
              font-bold
              text-white
            "
          >
            Layers GIS
          </h2>

        </div>

        <div className="space-y-3">

          {items.map((item) => (

            <label
              key={item.key}

              className="
                flex
                items-center
                justify-between

                text-[12px]
                text-slate-300
              "
            >

              <span>
                {item.label}
              </span>

              <input
                type="checkbox"

                checked={
                  layers[item.key]
                }

                onChange={() =>

                  setLayers(
                    (prev: any) => ({

                      ...prev,

                      [item.key]:
                        !prev[item.key]
                    })
                  )
                }
              />

            </label>

          ))}

        </div>

      </div>

    </DraggablePanel>
  );
}

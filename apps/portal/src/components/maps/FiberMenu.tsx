"use client";

import DraggablePanel
from "@/components/maps/floating/DraggablePanel";

interface Props {

  open: boolean;

  fiberType: string;

  setFiberType: (
    fiber: string
  ) => void;

  tool: string;

  setTool: (
    tool: string
  ) => void;
}

const fibers = [

  {
    name: "12FO",
    color: "#ef4444"
  },

  {
    name: "24FO",
    color: "#f97316"
  },

  {
    name: "36FO",
    color: "#eab308"
  },

  {
    name: "72FO",
    color: "#22c55e"
  },

  {
    name: "144FO",
    color: "#06b6d4"
  }
];

export default function FiberMenu({

  open,

  fiberType,

  setFiberType,

  tool,

  setTool

}: Props) {

  const dockPosition =

    typeof window !== "undefined"

    && (window as any)
      .geoFiberDockPosition

    ? (window as any)
        .geoFiberDockPosition

    : {

        x: 340,

        y: 100
      };

  const dynamicX =
    dockPosition.x + 185;

  const dynamicY =
    dockPosition.y + 165;

  if (!open)
    return null;

  return (

    <DraggablePanel

      title="Cabos FTTH"

      initialX={dynamicX}

      initialY={dynamicY}

      initialWidth={240}

      initialHeight={310}

      dockMode={true}
    >

      <div
        className="
          w-[240px]

          rounded-[26px]

          bg-[#020817]/96
          backdrop-blur-2xl

          border
          border-cyan-500/10

          shadow-[0_0_40px_rgba(0,0,0,0.45)]

          overflow-hidden

          p-2

          flex
          flex-col

          gap-2

          touch-none
          select-none
        "
      >

        <div
          className="
            px-3
            py-2

            text-[11px]
            font-semibold

            text-cyan-400

            border-b
            border-white/10
          "
        >
          CABOS FTTH
        </div>

        {fibers.map((fiber) => (

          <button
            key={fiber.name}

            onClick={() => {

              setFiberType(
                fiber.name
              );

              setTool(
                "fibra"
              );
            }}

            className={`
              w-full

              flex
              items-center

              gap-4

              px-3
              py-4

              rounded-2xl

              transition-all

              border

              ${
                fiberType === fiber.name

                  ? `
                    bg-cyan-500/10
                    border-cyan-400/30
                  `

                  : `
                    bg-[#081121]
                    border-white/5

                    hover:bg-cyan-500/10
                  `
              }
            `}
          >

            <div
              style={{
                width: 26,
                height: 4,
                borderRadius: 999,
                background: fiber.color
              }}
            />

            <span
              className="
                text-white
                font-medium
              "
            >
              {fiber.name}
            </span>

          </button>

        ))}

      </div>

    </DraggablePanel>
  );
}

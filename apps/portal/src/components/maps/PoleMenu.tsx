"use client";

import {
  Circle,
  Square
} from "lucide-react";

import DraggablePanel
from "@/components/maps/floating/DraggablePanel";

interface Props {

  open: boolean;

  tool: string;

  setTool: (
    tool: string
  ) => void;

  setOpen: (
    value: boolean
  ) => void;
}

export default function PoleMenu({

  open,

  tool,

  setTool,

  setOpen

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
    dockPosition.y + 90;


  if (!open)
    return null;

  return (

    <DraggablePanel

      title="Postes"

      initialX={dynamicX}

      initialY={dynamicY}

      initialWidth={250}

      initialHeight={170}

      dockMode={true}
    >

      <div
        className="
          w-[250px]

          rounded-[24px]

          bg-[#020817]/92
          backdrop-blur-xl

          border
          border-cyan-500/10

          shadow-[0_0_18px_rgba(0,0,0,0.28)]

          overflow-hidden

          p-2

          flex
          flex-col

          gap-2

          touch-none
          select-none
        "
      >

        <button

          onClick={() => {

            setTool(
              "poste_concreto"
            );

            setOpen(false);
          }}

          className={`
            w-full

            h-[50px]

            flex
            items-center

            gap-3

            px-4

            rounded-2xl

            transition-all

            border

            ${
              tool ===
              "poste_concreto"

                ? `
                  bg-cyan-500/15
                  border-cyan-400/40
                  text-cyan-300
                `

                : `
                  bg-[#081121]
                  border-white/5
                  text-white

                  hover:bg-cyan-500/20
                  hover:border-cyan-400/50
                  hover:text-cyan-300
                `
            }
          `}
        >

          <Circle size={15} />

          Poste de Concreto

        </button>

        <button

          onClick={() => {

            setTool(
              "poste_metal"
            );

            setOpen(false);
          }}

          className={`
            w-full

            h-[50px]

            flex
            items-center

            gap-3

            px-4

            rounded-2xl

            transition-all

            border

            ${
              tool ===
              "poste_metal"

                ? `
                  bg-cyan-500/15
                  border-cyan-400/40
                  text-cyan-300
                `

                : `
                  bg-[#081121]
                  border-white/5
                  text-white

                  hover:bg-cyan-500/20
                  hover:border-cyan-400/50
                  hover:text-cyan-300
                `
            }
          `}
        >

          <Square size={15} />

          Poste de Metal

        </button>

      </div>

    </DraggablePanel>
  );
}

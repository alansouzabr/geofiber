"use client";

import {
  Circle
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

const ITEMS = [

  {
    tool: "cto",
    label: "CTO"
  },

  {
    tool: "ceo",
    label: "CEO"
  },

  {
    tool: "splitter",
    label: "Splitter"
  },

  {
    tool: "caixa_emenda",
    label: "Caixa de Emenda"
  },

  {
    tool: "reserva_tecnica",
    label: "Reserva Técnica"
  },

  {
    tool: "caixa_atendimento",
    label: "Caixa de Atendimento"
  }

];

export default function AccessoryMenu({

  open,

  tool,

  setTool,

  setOpen

}: Props) {

  const dockPosition =

    typeof window !== "undefined" &&
    (window as any).geoFiberDockPosition

      ? (window as any).geoFiberDockPosition

      : {
          x: 340,
          y: 100
        };

  console.log(
    "ACCESSORY_MENU_OPEN=",
    open
  );

  if (!open)
    return null;

  return (

    <DraggablePanel

      title="Acessórios"

      initialX={dockPosition.x + 185}

      initialY={dockPosition.y + 90}

      initialWidth={260}

      initialHeight={360}

      dockMode={true}

    >

      <div
        className="
          w-[260px]
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
        "
      >

        {

          ITEMS.map(item => (

            <button

              key={item.tool}

              onClick={() => {

                setTool(item.tool);

                setOpen(false);

              }}

              className={`

                w-full

                h-[48px]

                flex

                items-center

                gap-3

                px-4

                rounded-2xl

                border

                transition-all

                ${

                  tool === item.tool

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

              <Circle size={14} />

              {item.label}

            </button>

          ))

        }

      </div>

    </DraggablePanel>

  );

}

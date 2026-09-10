"use client";

import {

  MousePointer2,
  Circle,
  Cable,
  Boxes,
  Building2,
  RadioTower,
  Server,
  Activity,
  Network

} from "lucide-react";

import DraggablePanel
from "@/components/maps/floating/DraggablePanel";

interface Props {

  tool: string;

  setTool: (
    tool: string
  ) => void;

  poleMenuOpen: boolean;

  setPoleMenuOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  fiberMenuOpen: boolean;

  setFiberMenuOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  accessoryMenuOpen: boolean;

  setAccessoryMenuOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  fiberType: string;

  setFiberType: (
    value: string
  ) => void;

    setFiberLaunching: React.Dispatch<
      React.SetStateAction<boolean>
    >;

    setFiberStartPole: React.Dispatch<
      React.SetStateAction<any>
    >;

  sidebarVisible: boolean;

  setSidebarVisible: (
    value: boolean
  ) => void;
}

export default function MapToolbar({

  tool,

  setTool,

  poleMenuOpen,

  setPoleMenuOpen,

  fiberMenuOpen,

  setFiberMenuOpen,

  accessoryMenuOpen,

  setAccessoryMenuOpen,

  fiberType,

  setFiberType,


    setFiberLaunching,

    setFiberStartPole,

  sidebarVisible,

  setSidebarVisible

}: Props) {

  function itemClass(
    active: boolean
  ) {

    return `

      w-[46px]
      h-[46px]

      min-w-[46px]

      rounded-[16px]

      flex
      items-center
      justify-center

      transition-all
      duration-200

      border

      ${
        active

          ? `
            bg-cyan-500/15
            border-cyan-400/50
            text-cyan-300

            shadow-[0_0_20px_rgba(0,255,255,0.18)]
          `

          : `
            bg-[#081121]
            border-white/5
            text-cyan-400

            hover:bg-cyan-500/10
          `
      }
    `;
  }

  function labelClass() {

    return `
      text-white
      font-medium
      text-[15px]
      tracking-[-0.01em]
    `;
  }

  return (

    <DraggablePanel

      title="Dock"

      initialX={318}

      initialY={-35}

      initialWidth={182}

      initialHeight={720}

      dockMode={true}
    >

      <div
        className="
          w-[182px]

          rounded-[30px]

          bg-[#020817]/96
          backdrop-blur-2xl

          border
          border-cyan-500/10

          shadow-[0_0_45px_rgba(0,0,0,0.45)]

          px-3
          py-4

          flex
          flex-col

          gap-2
        "
      >

        {/* SELECIONAR */}

        <button

          id="dock-select"

          onClick={() => {

            setTool("select");

            setPoleMenuOpen(false);

            setAccessoryMenuOpen(false);

            setFiberMenuOpen(false);

            setAccessoryMenuOpen(false);
          }}

          className="
            w-full

            flex
            items-center

            gap-3

            px-2
            py-1.5

            rounded-2xl
          "
        >

          <div
            className={
              itemClass(
                tool === "select"
              )
            }
          >
            <MousePointer2 size={20} />
          </div>

          <span
            className={
              labelClass()
            }
          >
            Selecionar
          </span>

        </button>

        {/* POSTES */}

        <button

          id="dock-poles"

          type="button"

          onClick={() => {

            /*
            =====================
            POSTE MODE
            =====================
            */

            /*
            NÃO FORÇA MAIS
            poste_concreto
            ao abrir menu
            */

            /*
            =====================
            OPEN SUBDOCK
            =====================
            */

            setPoleMenuOpen(
              (prev) => !prev
            );

            /*
            =====================
            CLOSE FIBER MENU
            =====================
            */

            setFiberMenuOpen(
              false
            );

            setAccessoryMenuOpen(
              false
            );
          }}

          className="
            w-full

            flex
            items-center

            gap-3

            px-2
            py-1.5

            rounded-2xl

            cursor-pointer

            select-none
          "
        >

          <div
            className={
              itemClass(
                tool.includes("poste")
              )
            }
          >
            <Circle size={18} />
          </div>

          <span
            className={
              labelClass()
            }
          >
            Postes
          </span>

        </button>

        {/* FIBRA */}

        <button

          id="dock-fiber"

          onClick={() => {

              setFiberLaunching(true);

              setFiberStartPole(null);

            setTool("fibra");

            setFiberMenuOpen(
              !fiberMenuOpen
            );

            setPoleMenuOpen(false);
          }}

          className="
            w-full

            flex
            items-center

            gap-3

            px-2
            py-1.5

            rounded-2xl
          "
        >

          <div
            className={
              itemClass(
                tool === "fibra"
              )
            }
          >
            <Cable size={20} />
          </div>

          <span
            className={
              labelClass()
            }
          >
            Fibra
          </span>

        </button>

        {/* ACESSÓRIOS */}

        <button

          id="dock-accessories"

          onClick={() => {

            console.log(
              "ACCESSORY BUTTON CLICK"
            );

            setTool("cto");

            setAccessoryMenuOpen(
              (prev) => !prev
            );

            setPoleMenuOpen(false);

            setFiberMenuOpen(false);

          }}

          className="
            w-full

            flex
            items-center

            gap-3

            px-2
            py-1.5

            rounded-2xl
          "
        >

          <div
            className={
              itemClass(
                accessoryMenuOpen
              )
            }
          >
            <Boxes size={20} />
          </div>

          <span
            className={
              labelClass()
            }
          >
            Acessórios
          </span>

        </button>

        {/* GRUPOS */}

        <button

          id="dock-groups"
          className="
            w-full

            flex
            items-center

            gap-3

            px-2
            py-1.5

            rounded-2xl
          "
        >

          <div
            className={
              itemClass(false)
            }
          >
            <Building2 size={20} />
          </div>

          <span
            className={
              labelClass()
            }
          >
            Grupos
          </span>

        </button>

        {/* ESTAÇÕES */}

        <button

          id="dock-stations"
          className="
            w-full

            flex
            items-center

            gap-3

            px-2
            py-1.5

            rounded-2xl
          "
        >

          <div
            className={
              itemClass(false)
            }
          >
            <RadioTower size={20} />
          </div>

          <span
            className={
              labelClass()
            }
          >
            Estações
          </span>

        </button>

        {/* RACKS */}

        <button

          id="dock-racks"
          className="
            w-full

            flex
            items-center

            gap-3

            px-2
            py-1.5

            rounded-2xl
          "
        >

          <div
            className={
              itemClass(false)
            }
          >
            <Server size={20} />
          </div>

          <span
            className={
              labelClass()
            }
          >
            Racks
          </span>

        </button>

        {/* PRISMA */}

        <button

          id="dock-prisma"
          className="
            w-full

            flex
            items-center

            gap-3

            px-2
            py-1.5

            rounded-2xl
          "
        >

          <div
            className={
              itemClass(false)
            }
          >
            <Activity size={20} />
          </div>

          <span
            className={
              labelClass()
            }
          >
            Ferramenta Prisma
          </span>

        </button>

        {/* FTTH */}

        <button

          onClick={() =>
            setSidebarVisible(
              !sidebarVisible
            )
          }

          className="
            w-full

            flex
            items-center

            gap-3

            px-2
            py-1.5

            rounded-2xl

            mt-1
          "
        >

          <div
            className={
              itemClass(false)
            }
          >
            <Network size={20} />
          </div>

          <span
            className={
              labelClass()
            }
          >
            FTTH
          </span>

        </button>

      </div>

    </DraggablePanel>
  );
}

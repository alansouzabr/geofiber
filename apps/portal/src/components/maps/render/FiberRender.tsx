"use client";

import {
  Polyline,
  Tooltip
} from "react-leaflet";

import {
  createUrbanRoadCurve
} from "@/components/maps/engine/urbanRoadEngine";

import {
  applyCableOffset
} from "@/components/maps/engine/fiberOffset";

import {
  snapFiberToRoad
} from "@/components/maps/engine/roadSnapEngine";

interface Props {

  fibers: any[];

  fiberDraft?: any;
}

export default function FiberRender({
    fibers,
    fiberDraft
}: Props) {

  console.count('RENDER FiberRender');

  console.log('FIBER_DRAFT=', fiberDraft);

  function getColor(
    fiber: any
  ) {

    if (
      fiber.fibers &&
      fiber.fibers.length
    ) {

      const color =
        fiber.fibers[0].color;

      const palette = {

        "Verde":"#16a34a",

        "Amarelo":"#facc15",

        "Branco":"#ffffff",

        "Azul":"#2563eb",

        "Vermelho":"#dc2626",

        "Violeta":"#9333ea",

        "Marrom":"#7c2d12",

        "Rosa":"#ec4899",

        "Preto":"#111827",

        "Cinza":"#6b7280",

        "Laranja":"#ea580c",

        "Azul Claro":"#06b6d4"

      };

      return palette[color]
        || "#ef4444";
    }

    if (fiber.type==="24FO")
      return "#f97316";

    if (fiber.type==="36FO")
      return "#22c55e";

    if (fiber.type==="72FO")
      return "#3b82f6";

    if (fiber.type==="144FO")
      return "#a855f7";

    return "#ef4444";
}

function getWeight(
    type: string
  ) {

    if (type === "24FO") {
      return 3;
    }

    if (type === "36FO") {
      return 4;
    }

    if (type === "72FO") {
      return 5;
    }

    if (type === "144FO") {
      return 6;
    }

    return 2;
  }

  return (

    <>

      {fibers
  .filter(
    fiber => !fiber.hidden
  )
  .map((fiber, index) => {

        const points =
          fiber.points || [];

        /*
        =======================
        SPLINE TELECOM
        =======================
        */

        let renderPoints =
          points;

        if (
          points.length === 2
        ) {

          renderPoints =
            createUrbanRoadCurve(
              points[0],
              points[1]
            );
        }

        renderPoints =

          applyCableOffset(
            renderPoints,
            index
          );

        /*
        ======================
        ROAD SNAP ENGINE
        ======================
        */

        renderPoints =

          snapFiberToRoad(
            renderPoints
          );

        return (

          <Polyline

            key={fiber.id}

            positions={
              renderPoints
            }

            smoothFactor={1.5}

            pathOptions={{

              color:
                getColor(
                    fiber
                ),

              weight:
                getWeight(
                  fiber.type
                ),

              opacity: 0.92,

              lineCap:
                "round",

              lineJoin:
                "round"
            }}
          >

            <Tooltip>

              <div
                className="
                  text-xs
                  space-y-1
                "
              >

                <div>
                  <b>Cabo:</b> {fiber.type}
                </div>

                <div>
                  <b>Padrão:</b> {fiber.standard || "ABNT"}
                </div>

                <div>
                  <b>Fibras:</b> {fiber.cableSize || "-"}
                </div>

                <div>
                  <b>Núcleos:</b> {
                    fiber.fibers
                      ? fiber.fibers.length
                      : "-"
                  }
                </div>

              </div>

            </Tooltip>

          </Polyline>
        );
      })}


        {
          fiberDraft &&
          fiberDraft.length === 2 && (

            <Polyline
              positions={fiberDraft}
              pathOptions={{
                color: '#22c55e',
                weight: 3,
                dashArray: '8 8',
                opacity: 0.9
              }}
            />

          )
        }

    </>
  );
}

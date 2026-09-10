"use client";

import {
  useState
} from "react";

import {
  connectClientToNearestCTO
} from "@/components/maps/engine/connectClientToCTO";

import {
  snapToNearestMarker
} from "@/components/maps/mapUtils";
import {
  useMapEvents
} from "react-leaflet";

import {
  createTreeAsset
} from "@/components/maps/engine/createTreeAsset";

import {
  getToken,
  apiFetch
} from "@/lib/api";


import { createCable } from "@/components/maps/fiber/fiberCatalog";

interface Props {

  tool: string;

  setMarkers: any;

  markers?: any[];

  fiberDraft?: any[];

  setFiberDraft?: any;

  fibers?: any[];

  setFibers?: any;

  fiberType?: string;

  tree?: any[];

  setTree?: any;

  selectedNodeId?:
      number | null;

    currentFolder?: any;

    loadProjectTree?: () => Promise<void>;
}


export default function MapEvents({



  tool,

  setMarkers,

  markers = [],

  fiberDraft = [],

  setFiberDraft,

  fibers = [],

  setFibers,

  fiberType = "12FO",

  tree = [],

  setTree,

    selectedNodeId,

    currentFolder,

    loadProjectTree

  }: Props) {

  console.count('RENDER MapEvents');


  const [

    fiberStart,

    setFiberStart

  ] = useState<any>(
    null
  );

    const [

      fiberMousePosition,

      setFiberMousePosition

    ] = useState<any>(
      null
    );


  function findNodeById(
    nodes: any[],
    id: number
  ): any {

    for (const node of nodes) {

      if (node.id === id) {
        return node;
      }

      if (node.children) {

        const found =
          findNodeById(
            node.children,
            id
          );

        

        

        if (found) {
          return found;
        }
      }
    }

    return null;
  }


  useMapEvents({


      mousemove(e) {

        if (tool === "fibra") {

          setFiberMousePosition([
            e.latlng.lat,
            e.latlng.lng
          ]);

            if (fiberStart) {

              setFiberDraft((prev:any) => {

                const next = [
                  fiberStart.position,
                  [
                    e.latlng.lat,
                    e.latlng.lng
                  ]
                ];

                if (
                  prev?.length === 2 &&
                  prev[1]?.[0] === next[1][0] &&
                  prev[1]?.[1] === next[1][1]
                ) {
                  return prev;
                }

                return next;

              });

            }

        }
      },

    click(e) {

      const rawPoint:
        [number, number] = [

        e.latlng.lat,

        e.latlng.lng
      ];

      const point =
        snapToNearestMarker(

          rawPoint,

          markers
        );


      
      function getPostesFolderId() {

        return currentFolder?.id || null;

      }

const categoryId =
        getPostesFolderId();



      /*
      ========================
      FTTH POLE DETECTION
      ========================
      */

      const nearestPole =

        markers.find(

          (marker) => {

            if (

              marker.type !==
              "POSTE_CONCRETO" &&

              marker.type !==
              "POSTE_METALICO"
            ) {

              return false;
            }

            const dx =

              marker.position[0] -
              point[0];

            const dy =

              marker.position[1] -
              point[1];

            const distance =

              Math.sqrt(
                dx * dx +
                dy * dy
              );

            return (
              distance <
              0.0002
            );
          }
        );

      /*
      ========================
      POSTES
      ========================
      */

      
if (
        tool ===
        "poste_concreto"
      ) {

        console.log(
          "CREATE_POLE_FOLDER",
          currentFolder?.id,
          currentFolder?.name,
          currentFolder?.nodeType
        );

        const posteName =
          `Poste-${
            markers.filter(
              (m) =>
                m.type ===
                "POSTE_CONCRETO"
            ).length + 1
          }`;

        (async () => {

          try {

            const pole =
              await apiFetch(
                "/poles",
                {
                  method: "POST",
                  body: JSON.stringify({
                    name: posteName,
                    folderId: currentFolder?.id || null,
                    lat: point[0],
                    lng: point[1]
                  })
                }
              );

            setMarkers((prev:any) => {

              if (
                prev.some(
                  (m:any) =>
                    String(m.id) ===
                    String(pole.id)
                )
              ) {
                console.log(
                  "POLE_ALREADY_EXISTS",
                  pole.id
                );
                return prev;
              }

              return [

                ...prev,

                {
                  id: pole.id,
                name: pole.name,
                type: "POSTE_CONCRETO",
                folderId: pole.folderId,
                connections: [],
                position: [
                  pole.lat,
                  pole.lng
                ]
              }
              ];
            });

            await loadProjectTree?.();

          } catch (err) {

            console.error(
              "CREATE POLE ERROR",
              err
            );
          }

        })();

        return;

      }

      
if (
        tool ===
        "poste_metal"
      ) {

        const posteName =
          `Poste-M-${
            markers.filter(
              (m) =>
                m.type ===
                "POSTE_METALICO"
            ).length + 1
          }`;

        (async () => {

          try {

            const pole =
              await apiFetch(
                "/poles",
                {
                  method: "POST",
                  body: JSON.stringify({
                    name: posteName,
                    type: "POSTE_METALICO",
                    folderId: currentFolder?.id || null,
                    lat: point[0],
                    lng: point[1]
                  })
                }
              );

            console.log(
              "METAL_POLE_RESPONSE",
              pole
            );

            setMarkers(
              (prev:any) => [

                ...prev,

                {
                  id: pole.id,
                  name: pole.name,
                  type: pole.type,
                  folderId: pole.folderId,
                  connections: [],
                  position: [
                    pole.lat,
                    pole.lng
                  ]
                }
              ]
            );

            await loadProjectTree?.();

          } catch(err) {

            console.error(
              "CREATE METAL POLE ERROR",
              err
            );
          }

        })();

        return;
      }

      /*
      ========================
      CTO
      ========================
      */

        if (
          tool === "cto"
        ) {

          console.log(
            "CTO_CREATION_MOVED_TO_POLE_MODULE"
          );

          return;
        }

      /*
      ========================
      CEO
      ========================
      */

      if (
        tool ===
        "ceo"
      ) {

        setMarkers((prev: any) => [

          ...prev,

          {

            id:
              Date.now(),

            type:
              "CEO",

            position:
              point
          }
        ]);

        return;
      }

      /*
      ========================
      CLIENTE
      ========================
      */

      if (
        tool ===
        "cliente"
      ) {

        const client = {

          id:
            Date.now(),

          type:
            "CLIENTE",

          connected: false,

          ctoId: null,

          position:
            point
        };

        setMarkers((prev: any) => [

          ...prev,

          client
        ]);

        setTimeout(() => {

          connectClientToNearestCTO(

            client,

            markers,

            setMarkers
          );

        }, 100);

        return;
      }

      /*
      ========================
      FIBRA FTTH
      ========================
      */

      if (

        tool ===
        "fibra"
      ) {

        const nearestMarker =

          markers.find(

            (marker) => {

              const dx =

                marker.position[0] -
                point[0];

              const dy =

                marker.position[1] -
                point[1];

              return (

                Math.sqrt(
                  dx * dx +
                  dy * dy
                ) < 0.00025
              );
            }
          );

        /*
        ====================
        PRECISA CLICAR
        EM UM POSTE
        ====================
        */

        if (
          !nearestMarker
        ) {

          return;
        }

        /*
        ====================
        PRIMEIRO POSTE
        ====================
        */

        if (
          !fiberStart
        ) {

          setFiberStart(
            nearestMarker
          );

            setFiberDraft([
              nearestMarker.position,
              nearestMarker.position
            ]);

          return;
        }

        /*
        ====================
        SEGUNDO POSTE
        ====================
        */


          const cable =
            createCable(12);

        const newFiber = {

          id:
            Date.now(),

          type:
            fiberType,

          dynamic: true,

            ...cable,

          startPoleId:
            fiberStart.id,

          endPoleId:
            nearestMarker.id,

          points: [

            fiberStart.position,

            nearestMarker.position
          ]
        };

        setFibers(
          (prev: any) => [

            ...prev,

            newFiber
          ]
        );

        /*
        ====================
        RESET
        ====================
        */

        setFiberStart(
          null
        );

          setFiberDraft([]);

        return;
      }
    }
  });

  return null;
}

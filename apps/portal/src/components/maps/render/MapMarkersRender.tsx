"use client";

import {
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import {
  memo,
  useEffect,
  useRef,
  useState
} from "react";

import {
  
  getCompositePoleIconDynamic,
  getPoleMetalIcon,
  getCtoIcon,
  getSpliceIcon,
  getClientIcon,
  getDynamicIcon
} from "@/components/maps/mapIcons";

import { getIconScale } from "@/components/maps/modules/assets/IconScale";
import { createDynamicIcon } from "@/components/maps/modules/assets/DynamicLeafletIcon";
import { GeoFiberIconRegistry } from "@/components/maps/modules/assets/GeoFiberIconRegistry";
import StructurePanel from "@/components/maps/panel/StructurePanel";
import { buildPoleStructure } from "@/components/maps/modules/structure/StructureBuilder";
import {

  subscribeSelection,

  getSelectedNode,

  setSelectedNode

} from "@/components/maps/modules/structure/StructureSelection";


interface Props {

  markers: any[];

  setMarkers: any;

  setContextMenu: any;

  selectedNodeId?:
    string | number | null;

  focusedNodeId?:
    string | number | null;

  tool?: string;

  selectedPole?: any;

  setSelectedPole?: any;

  setAccessoryModalOpen?: any;
}

function MapMarkersRender({

  markers,

  setMarkers,

  setContextMenu,

  selectedNodeId,

  focusedNodeId,

  tool,

  selectedPole,

  setSelectedPole

  ,setAccessoryModalOpen

}: Props) {

  console.log("MAP_MARKERS_TOOL=", tool);
  console.log("MAP_MARKERS_SETSELECTED=", typeof setSelectedPole);


  const map = useMap();

  const [zoom,setZoom]=useState(
    map.getZoom()
  );

  
  useEffect(()=>{

    const update=()=>{

      setZoom(
        map.getZoom()
      );

    };

    map.on(
      "zoomend",
      update
    );

    return ()=>{

      map.off(
        "zoomend",
        update
      );

    };

  },[map]);

const markerRefs =
    useRef<any>({});

  const [
    structureOpen,
    setStructureOpen
  ]=useState(false);

  const [
    structureItems,
    setStructureItems
  ]=useState<any[]>([]);

  const [
    structureTitle,
    setStructureTitle
  ]=useState("");


  useEffect(() => {

    if (
      focusedNodeId == null
    ) {
      return;
    }


    const marker =
      markers.find(
        (m:any) =>
          String(m.id) ===
          String(focusedNodeId)
      );


    if (!marker) {
      return;
    }

    map.flyTo(
      marker.position,
      20,
      {
        duration: 1.2
      }
    );

    setTimeout(() => {

      const ref =
        markerRefs.current[
          focusedNodeId
        ];


      if (
        ref &&
        ref.openPopup
      ) {
        ref.openPopup();
      }

      markerRefs.current.__lastFocused =
        focusedNodeId;

    }, 800);

  }, [
    focusedNodeId,
    map
  ]);

  




    useEffect(()=>{

      return subscribeSelection(id=>{

        if(!id){
          return;
        }

        const marker=markers.find(
          (m:any)=>String(m.id)===String(id)
        );

        if(!marker){
          return;
        }

        if(typeof setSelectedPole==="function"){
          setSelectedPole(marker);
        }

        map.flyTo(
          marker.position,
          map.getZoom(),
          {
            duration:0.4
          }
        );

        const ref=markerRefs.current[id];

        if(ref?.openPopup){

          setTimeout(()=>{

            ref.openPopup();

          },150);

        }

      });

    },[
      markers,
      map,
      setSelectedPole
    ]);

  return (


    <>

      {markers
          .filter(
            marker => !marker.hidden
          )
          .map((marker) => {


            return (

        <Marker

            ref={(ref) => {

              if (ref) {

                markerRefs.current[
                  marker.id
                ] = ref;
              }

            }}

          key={marker.id}

          draggable={true}

          eventHandlers={{

            dragend: (e) => {

              const leafletMarker =
                e.target;

              const pos =
                leafletMarker.getLatLng();

              setMarkers(
                (prev: any[]) =>

                  prev.map((m) =>

                    m.id === marker.id

                      ? {

                          ...m,

                          position: [
                            pos.lat,
                            pos.lng
                          ]
                        }

                      : m
                  )
              );
            },

            click: (e) => {

              e.originalEvent.preventDefault();
                console.log("CLICK_TOOL=", tool);
                console.log("CLICK_SETSELECTED=", typeof setSelectedPole);
                console.log("CLICK_MARKER=", marker.name, marker.type);


              if (

                (tool === "cto" ||

                 tool === "ceo") &&

                typeof setSelectedPole === "function"

              ) {

                console.log(
                  "POLE_SELECTED",
                  marker
                );

                setSelectedPole(marker);

                setSelectedNode(
                  String(marker.id)
                );

                  if (
                    typeof setAccessoryModalOpen ===
                    "function"
                  ) {
                    setAccessoryModalOpen(true);
                  }

                return;

              }

              if(

                marker.type==="POSTE_CONCRETO" ||

                marker.type==="POSTE_METALICO"

              ){

                setStructureTitle(
                  marker.name
                );

                setStructureItems(

                  buildPoleStructure(
                    marker
                  )

                );

                setStructureOpen(true);

                return;

              }

              setContextMenu({

                marker,

                x:
                  e.originalEvent.clientX,

                y:
                  e.originalEvent.clientY
              });

            }
          }}

          position={
            marker.position
          }

          icon={

            marker.type ===
            "POSTE_CONCRETO"

              ? getDynamicIcon(

                  GeoFiberIconRegistry.poleConcrete,

                  getIconScale(
                    zoom
                  )

                )

            : marker.type ===
              "POSTE_METALICO"

              ? getDynamicIcon(

                  GeoFiberIconRegistry.poleMetal,

                  getIconScale(
                    zoom
                  )

                )

            : marker.type ===
              "CTO"

              ? getDynamicIcon(

                  GeoFiberIconRegistry.cto,

                  getIconScale(
                    zoom
                  )

                )

            : marker.type ===
              "CEO"

              ? getDynamicIcon(

                    GeoFiberIconRegistry.ceo,

                  getIconScale(
                    zoom
                  )

                )

              : getClientIcon()
          }
        >

          <Popup>

            <div
              className="
                text-black
                text-sm
                min-w-[160px]
              "
            >

              <div
                className="
                  font-semibold
                "
              >
                {

                  marker.name ||

                  marker.type
                }
              </div>

              <div
                className="
                  text-xs
                  mt-1
                "
              >
                Lat:
                {" "}
                {marker.position[0]
                  .toFixed(6)}
              </div>

              <div
                className="
                  text-xs
                "
              >
                Lng:
                {" "}
                {marker.position[1]
                  .toFixed(6)}
              </div>

            </div>

          </Popup>

        </Marker>

            );
          })}

      <StructurePanel

        open={structureOpen}

        title={structureTitle}

        items={structureItems}

        onClose={()=>
          setStructureOpen(false)
        }

      />

    </>
  );
}

export default MapMarkersRender;
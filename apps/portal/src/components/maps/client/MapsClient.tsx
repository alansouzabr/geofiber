"use client";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer
} from "react-leaflet";

import FiberRender from "@/components/maps/render/FiberRender";
import CtoRenderer
from "@/components/maps/modules/cto/render/CtoRenderer";
import MapElementsRender from "@/components/maps/render/MapElementsRender";
import MapMarkersRender from "@/components/maps/render/MapMarkersRender";
import MapEvents from "@/components/maps/MapEvents";

export default function MapsClient(props:any) {

  console.count('RENDER MapsClient');


  return (

    <MapContainer
      center={props.center}
      zoom={13}
      className="absolute inset-0 z-0"
      style={{
        height: "100vh",
        width: "100vw"
      }}
    >

      <MapMarkersRender
        markers={props.markers}
        setMarkers={props.setMarkers}
        setContextMenu={props.setContextMenu}
        selectedNodeId={props.selectedNodeId}

        focusedNodeId={props.focusedNodeId}

          tool={props.tool}

          selectedPole={props.selectedPole}

          setSelectedPole={props.setSelectedPole}

            setAccessoryModalOpen={
              props.setAccessoryModalOpen
            }
      />

        <CtoRenderer
          ctos={props.ctos}
          setCtos={props.setCtos}
        />

      <FiberRender
        fibers={props.liveFibers}
          fiberDraft={props.fiberDraft}
      />

      <MapEvents
        tool={props.tool}
        setMarkers={props.setMarkers}
        markers={props.markers}
        fiberDraft={props.fiberDraft}
        setFiberDraft={props.setFiberDraft}
        fibers={props.fibers}
        setFibers={props.setFibers}
        fiberType={props.fiberType}
        tree={props.tree}
        setTree={props.setTree}
        selectedNodeId={props.selectedNodeId}
        currentFolder={props.currentFolder}
      />

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

    </MapContainer>

  );
}

"use client";

import ContextMenu
from "@/components/maps/ContextMenu";

import {
  Marker,
  Popup
} from "react-leaflet";
import {
  getPoleConcreteIcon,
  getPoleMetalIcon,
  getCtoIcon,
  getSpliceIcon,
  getClientIcon
} from "@/components/maps/mapIcons";

interface Props {

  markers: any[];

  
  setMarkers?: any;

  setSelected?: any;

}

export default function MapElementsRender({

  markers,

  setMarkers

}: Props) {

  function getIcon(
    type: string
  ) {

    if (
      type ===
      "POSTE_METALICO"
    ) {

      return getPoleMetalIcon();
    }

    if (
      type === "CTO"
    ) {

      return getCtoIcon();
    }

    if (
      type === "CEO"
    ) {

      return getSpliceIcon();
    }

    if (
      type === "CLIENTE"
    ) {

      return getClientIcon();
    }

    return getPoleConcreteIcon();
  }

  return (

    <>

      {markers
          .filter(
            marker => !marker.hidden
          )
          .map((marker) => (

        <Marker

          key={marker.id}

          position={
            marker.position
          }

          icon={
            getIcon(
              marker.type
            )
          }

          draggable

          eventHandlers={{

            dragend(e) {

              const latlng =
                e.target.getLatLng();

              setMarkers(
                (prev: any) =>

                  prev.map(
                    (item: any) => {

                      if (
                        item.id ===
                        marker.id
                      ) {

                        return {

                          ...item,

                          position: [

                            latlng.lat,

                            latlng.lng
                          ]
                        };
                      }

                      return item;
                    }
                  )
              );
            }
          }}
          
        >

          <Popup>

            <ContextMenu

              marker={marker}

              setMarkers={
                setMarkers
              }
            />

          </Popup>

        </Marker>
      ))}

    </>
  );
}

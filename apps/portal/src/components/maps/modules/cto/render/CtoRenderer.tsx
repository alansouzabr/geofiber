"use client";

import {
  Marker,
  useMap
} from "react-leaflet";

import {
  useEffect,
  useRef
} from "react";

import {
  subscribeSelection
} from "@/components/maps/modules/structure/StructureSelection";

import { getCtoIcon } from "../icons";

import positionCTO
from "../utils/positionCTO";

interface Props {

  ctos: any[];

  setCtos?: any;

}

export default function CtoRenderer({

  ctos

}: Props) {

  console.log("CTOS=", ctos);

  const map=useMap();

  const markerRefs=
    useRef<any>({});

  useEffect(()=>{

    return subscribeSelection(id=>{

      if(!id){
        return;
      }

      const cto=ctos.find(
        (c:any)=>String(c.id)===String(id)
      );

      if(!cto){
        return;
      }

      map.flyTo(
        positionCTO(cto.position),
        map.getZoom(),
        {
          duration:0.4
        }
      );

      const ref=markerRefs.current[cto.id];

      if(ref?.openPopup){

        setTimeout(()=>{

          ref.openPopup();

        },150);

      }

    });

  },[
    ctos,
    map
  ]);

  return (
    <>
      {ctos.map((cto: any) => (
        <Marker
          ref={(ref)=>{

            if(ref){

              markerRefs.current[cto.id]=ref;

            }

          }}
          key={cto.id}
          position={positionCTO(cto.position)}
          icon={getCtoIcon()}
        />
      ))}
    </>
  );

}
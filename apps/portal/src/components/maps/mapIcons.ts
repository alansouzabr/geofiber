"use client";

import L from "leaflet";
import { GeoFiberIconRegistry } from "@/components/maps/modules/assets/GeoFiberIconRegistry";
import { createDynamicIcon } from "@/components/maps/modules/assets/DynamicLeafletIcon";

function svgIcon(icon:{

  url:string;

  size:readonly[number,number];

  anchor:readonly[number,number];

  popup:readonly[number,number];

}){

  return L.icon({

    iconUrl:icon.url,

    iconSize:[...icon.size],

    iconAnchor:[...icon.anchor],

    popupAnchor:[...icon.popup]

  });

}

let poleConcrete:L.Icon|null=null;
let poleMetal:L.Icon|null=null;
let cto:L.Icon|null=null;
let splice:L.Icon|null=null;
let client:L.DivIcon|null=null;

let poleEmpty:L.Icon|null=null;
let poleWithCTO:L.Icon|null=null;
let poleWithCEO:L.Icon|null=null;
let poleWithCTOCEO:L.Icon|null=null;

const dynamicIconCache =
  new Map<string,L.Icon>();


export function getPoleConcreteIcon(){

  if(!poleConcrete){

    poleConcrete=svgIcon(

      GeoFiberIconRegistry.poleConcrete

    );

  }

  return poleConcrete;

}

export function getPoleMetalIcon(){

  if(!poleMetal){

    poleMetal=svgIcon(

      GeoFiberIconRegistry.poleMetal

    );

  }

  return poleMetal;

}

export function getCtoIcon(){

  if(!cto){

    cto=svgIcon(

      GeoFiberIconRegistry.cto

    );

  }

  return cto;

}

export function getSpliceIcon(){

  if(!splice){

    splice=svgIcon(

      GeoFiberIconRegistry.ceo

    );

  }

  return splice;

}

export function getClientIcon(){

  if(!client){

    client=L.divIcon({

      className:"",

      html:"🏠",

      iconSize:[22,22],

      iconAnchor:[11,11]

    });

  }

  return client;

}

export const getSplitterIcon=getSpliceIcon;


export function getCompositePoleIcon(
  poleType:string,
  hasCTO:boolean,
  hasCEO:boolean
){

  const metal=
    poleType==="POSTE_METALICO";


  if(hasCTO && hasCEO){

    if(!poleWithCTOCEO){

      poleWithCTOCEO=svgIcon(
        metal ? GeoFiberIconRegistry.posteMetalCTOCEO : GeoFiberIconRegistry.posteCTOCEO
      );

    }

    return poleWithCTOCEO;
  }

  if(hasCTO){

    if(!poleWithCTO){

      poleWithCTO=svgIcon(
        metal ? GeoFiberIconRegistry.posteMetalCTO : GeoFiberIconRegistry.posteCTO
      );

    }

    return poleWithCTO;
  }

  if(hasCEO){

    if(!poleWithCEO){

      poleWithCEO=svgIcon(
        metal ? GeoFiberIconRegistry.posteMetalCEO : GeoFiberIconRegistry.posteCEO
      );

    }

    return poleWithCEO;
  }

  if(!poleEmpty){

    poleEmpty=svgIcon(
      metal ? GeoFiberIconRegistry.posteMetalVazio : GeoFiberIconRegistry.posteVazio
    );

  }

  return poleEmpty;
}

export function getCompositePoleIconDynamic(
  poleType:string,
  hasCTO:boolean,
  hasCEO:boolean,
  scale:number
){

  const metal =
    poleType==="POSTE_METALICO";

  let cfg;

  if(hasCTO && hasCEO){

    cfg =
      metal
      ? GeoFiberIconRegistry.posteMetalCTOCEO
      : GeoFiberIconRegistry.posteCTOCEO;

  }else if(hasCTO){

    cfg =
      metal
      ? GeoFiberIconRegistry.posteMetalCTO
      : GeoFiberIconRegistry.posteCTO;

  }else if(hasCEO){

    cfg =
      metal
      ? GeoFiberIconRegistry.posteMetalCEO
      : GeoFiberIconRegistry.posteCEO;

  }else{

    cfg =
      metal
      ? GeoFiberIconRegistry.posteMetalVazio
      : GeoFiberIconRegistry.posteVazio;

  }

  const key=[
    poleType,
    hasCTO,
    hasCEO,
    scale
  ].join("_");

  const cached=
    dynamicIconCache.get(key);

  if(cached){
    return cached;
  }

  const icon=
    createDynamicIcon(
      cfg,
      scale
    );

  dynamicIconCache.set(
    key,
    icon
  );

  return icon;

}

export function getDynamicIcon(
  cfg:any,
  scale:number
){

  const key=[
    cfg.url,
    scale
  ].join("_");

  const cached=
    dynamicIconCache.get(key);

  if(cached){

    return cached;

  }

  const icon=
    createDynamicIcon(
      cfg,
      scale
    );

  dynamicIconCache.set(
    key,
    icon
  );

  return icon;

}

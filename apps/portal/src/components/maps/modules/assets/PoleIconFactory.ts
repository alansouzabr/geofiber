import { GeoFiberIconRegistry } from "./GeoFiberIconRegistry";

export type PoleEquipment = {

  poleType:string;

  hasCTO:boolean;

  hasCEO:boolean;

};

export function getPoleIcon(
  equipment:PoleEquipment
){

  const {
    poleType,
    hasCTO,
    hasCEO
  } = equipment;

  const metal=
    poleType==="POSTE_METALICO";

  if(hasCTO && hasCEO){

    return metal
      ? GeoFiberIconRegistry.posteMetalCTOCEO
      : GeoFiberIconRegistry.posteCTOCEO;

  }

  if(hasCTO){

    return metal
      ? GeoFiberIconRegistry.posteMetalCTO
      : GeoFiberIconRegistry.posteCTO;

  }

  if(hasCEO){

    return metal
      ? GeoFiberIconRegistry.posteMetalCEO
      : GeoFiberIconRegistry.posteCEO;

  }

  return metal
    ? GeoFiberIconRegistry.posteMetalVazio
    : GeoFiberIconRegistry.posteVazio;

}

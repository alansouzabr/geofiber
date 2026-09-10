import {

  getCompositePoleIconDynamic,
  getDynamicIcon

} from "@/components/maps/mapIcons";

import {

  GeoFiberIconRegistry

} from "@/components/maps/modules/assets/GeoFiberIconRegistry";

export function createSymbol(

  marker:any,

  scale:number

){

  switch(marker.type){

    case "POSTE_CONCRETO":

    case "POSTE_METALICO":

      return getCompositePoleIconDynamic(

        marker.type,

        (marker.accessories||[]).some(
          (a:any)=>a.type==="CTO"
        ),

        (marker.accessories||[]).some(
          (a:any)=>a.type==="CEO"
        ),

        scale

      );

    case "CTO":

      return getDynamicIcon(
        GeoFiberIconRegistry.cto,
        scale
      );

    case "CEO":

      return getDynamicIcon(
        GeoFiberIconRegistry.ceo,
        scale
      );

    default:

      return getDynamicIcon(
        GeoFiberIconRegistry.house,
        scale
      );

  }

}

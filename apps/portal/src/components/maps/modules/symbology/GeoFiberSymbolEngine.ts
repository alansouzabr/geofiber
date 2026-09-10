import {

  createSymbol

} from "./SymbolFactory";

import {

  getZoomScale

} from "./ZoomScale";

import {

  isVisible

} from "./VisibilityRules";

export function getMarkerSymbol(

  marker:any,

  zoom:number

){

  if(

    !isVisible(

      marker.type,

      zoom

    )

  ){

    return null;

  }

  return createSymbol(

    marker,

    getZoomScale(

      zoom

    )

  );

}

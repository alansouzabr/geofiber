export function getZoomScale(
  zoom:number
){

  if(zoom<=15) return 0.50;

  if(zoom===16) return 0.60;

  if(zoom===17) return 0.72;

  if(zoom===18) return 0.85;

  if(zoom===19) return 1.00;

  return 1.18;

}

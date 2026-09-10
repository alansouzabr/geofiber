export function getIconScale(zoom:number){

  if(zoom<=15) return 0.60;

  if(zoom===16) return 0.70;

  if(zoom===17) return 0.80;

  if(zoom===18) return 0.90;

  if(zoom===19) return 1.00;

  return 1.15;

}

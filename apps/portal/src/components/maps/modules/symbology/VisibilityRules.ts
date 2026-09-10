export function isVisible(

  type:string,

  zoom:number

){

  switch(type){

    case "CLIENT":

      return zoom>=18;

    case "CEO":

      return zoom>=17;

    case "CTO":

      return zoom>=16;

    default:

      return true;

  }

}

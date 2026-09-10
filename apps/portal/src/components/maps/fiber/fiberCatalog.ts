export const ABNT_12 = [

  "Verde",

  "Amarelo",

  "Branco",

  "Azul",

  "Vermelho",

  "Violeta",

  "Marrom",

  "Rosa",

  "Preto",

  "Cinza",

  "Laranja",

  "Azul Claro"

];

export function createCable(
  cableSize:number
){

  const fibers=[];

  for(
    let i=0;
    i<cableSize;
    i++
  ){

    fibers.push({

      number:i+1,

      color:
        ABNT_12[
          i % ABNT_12.length
        ],

      status:"LIVRE",

      splice:false,

      splitter:false,

      attenuation:0

    });

  }

  return {

    standard:"ABNT",

    cableSize,

    fibers

  };

}

import positionCTO
from "../utils/positionCTO";

export default function createCTO(

  pole:any

){

  return {

    id:

      crypto.randomUUID(),

    poleId:

      pole.id,

    type:

      "CTO",

    name:

      "CTO",

    position:

      positionCTO(

        pole.position

      )

  };

}

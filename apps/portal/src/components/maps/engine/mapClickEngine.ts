export function createMapElement(

  tool: string,

  lat: number,

  lng: number
) {

  if (
    tool === "poste_concreto"
  ) {

    return {

      id:
        crypto.randomUUID(),

      type:
        "POSTE_CONCRETO",

      position: [
        lat,
        lng
      ]
    };
  }

  if (
    tool === "poste_metalico"
  ) {

    return {

      id:
        crypto.randomUUID(),

      type:
        "POSTE_METALICO",

      position: [
        lat,
        lng
      ]
    };
  }

  if (
    tool === "cto"
  ) {

    return {

      id:
        crypto.randomUUID(),

      type:
        "CTO",

      position: [
        lat,
        lng
      ]
    };
  }

  if (
    tool === "ceo"
  ) {

    return {

      id:
        crypto.randomUUID(),

      type:
        "CEO",

      position: [
        lat,
        lng
      ]
    };
  }

  return null;
}

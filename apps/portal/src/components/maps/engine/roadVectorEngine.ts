export function createRoadAlignedCurve(

  start: [number, number],

  end: [number, number]

) {

  const lat1 = start[0];
  const lng1 = start[1];

  const lat2 = end[0];
  const lng2 = end[1];

  /*
  ========================
  DIREÇÃO
  ========================
  */

  const dx =
    lat2 - lat1;

  const dy =
    lng2 - lng1;

  /*
  ========================
  DISTÂNCIA
  ========================
  */

  const distance = Math.sqrt(

    dx * dx +
    dy * dy
  );

  /*
  ========================
  OFFSET FTTH
  ========================
  */

  const offset =
    distance * 0.08;

  /*
  ========================
  ALINHAMENTO
  ========================
  */

  const horizontal =

    Math.abs(dx) >
    Math.abs(dy);

  let points:
    [number, number][] = [];

  /*
  ========================
  HORIZONTAL
  ========================
  */

  if (horizontal) {

    points = [

      start,

      [
        lat1,
        lng1 + dy * 0.35
      ],

      [
        lat1 +
          dx * 0.5,

        lng1 +
          dy * 0.5 +

          offset
      ],

      [
        lat2,
        lng1 + dy * 0.7
      ],

      end
    ];

  } else {

    /*
    ======================
    VERTICAL
    ======================
    */

    points = [

      start,

      [
        lat1 + dx * 0.35,
        lng1
      ],

      [
        lat1 +
          dx * 0.5 +

          offset,

        lng1 +
          dy * 0.5
      ],

      [
        lat1 + dx * 0.7,
        lng2
      ],

      end
    ];
  }

  return points;
}

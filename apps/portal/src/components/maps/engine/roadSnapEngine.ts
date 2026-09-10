export function snapFiberToRoad(

  points: [number, number][]

) {

  /*
  ========================
  SNAP FTTH
  ========================
  */

  return points.map(

    (point, index) => {

      /*
      ====================
      EXTREMIDADES
      ====================
      */

      if (
        index === 0 ||

        index ===
        points.length - 1
      ) {

        return point;
      }

      /*
      ====================
      MICRO AJUSTE URBANO
      ====================
      */

      return [

        point[0] + 0.000005,

        point[1] - 0.000005
      ];
    }
  );
}

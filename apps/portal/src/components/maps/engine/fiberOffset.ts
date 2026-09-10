export function applyCableOffset(

  points: [number, number][],

  index: number

) {

  /*
  ========================
  OFFSET TELECOM
  ========================
  */

  const spacing =
    0.000015;

  const offset =

    (
      index % 5
    ) * spacing;

  return points.map(

    (point, i) => {

      /*
      ====================
      PRIMEIRO E ÚLTIMO
      NÃO ALTERA
      ====================
      */

      if (
        i === 0 ||

        i ===
        points.length - 1
      ) {

        return point;
      }

      return [

        point[0] + offset,

        point[1] - offset
      ];
    }
  );
}

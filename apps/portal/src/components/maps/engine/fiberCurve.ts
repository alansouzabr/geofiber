export function createFiberCurve(

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
    lng2 - lng1;

  const dy =
    lat2 - lat1;

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
  NORMALIZAÇÃO
  ========================
  */

  const length =
    Math.max(
      distance,
      0.00001
    );

  const nx =
    dx / length;

  const ny =
    dy / length;

  /*
  ========================
  VETOR PERPENDICULAR
  ========================
  */

  const px =
    -ny;

  const py =
    nx;

  /*
  ========================
  OFFSET URBANO
  ========================
  */

  const urbanOffset =
    distance * 0.18;

  /*
  ========================
  PONTOS URBANOS
  ========================
  */

  const p1: [number, number] = [

    lat1 +
      dx * 0.22 +

      px * urbanOffset,

    lng1 +
      dy * 0.22 +

      py * urbanOffset
  ];

  const p2: [number, number] = [

    lat1 +
      dx * 0.50 +

      px * urbanOffset * 1.4,

    lng1 +
      dy * 0.50 +

      py * urbanOffset * 1.4
  ];

  const p3: [number, number] = [

    lat1 +
      dx * 0.78 +

      px * urbanOffset,

    lng1 +
      dy * 0.78 +

      py * urbanOffset
  ];

  /*
  ========================
  SPLINE FTTH
  ========================
  */

  return [

    start,

    p1,

    p2,

    p3,

    end
  ];
}

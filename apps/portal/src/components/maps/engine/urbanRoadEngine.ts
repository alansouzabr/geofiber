export function createUrbanRoadCurve(

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
  OFFSET URBANO
  ========================
  */

  const offset =
    distance * 0.12;

  /*
  ========================
  EIXO DIRECIONAL
  ========================
  */

  const p1: [number, number] = [

    lat1 + dx * 0.18,

    lng1 + dy * 0.10
  ];

  const p2: [number, number] = [

    lat1 + dx * 0.35,

    lng1 + dy * 0.30
  ];

  const p3: [number, number] = [

    lat1 + dx * 0.50 +

      offset,

    lng1 + dy * 0.50
  ];

  const p4: [number, number] = [

    lat1 + dx * 0.70,

    lng1 + dy * 0.72
  ];

  const p5: [number, number] = [

    lat1 + dx * 0.88,

    lng1 + dy * 0.92
  ];

  /*
  ========================
  URBAN SPLINE
  ========================
  */

  return [

    start,

    p1,
    p2,
    p3,
    p4,
    p5,

    end
  ];
}

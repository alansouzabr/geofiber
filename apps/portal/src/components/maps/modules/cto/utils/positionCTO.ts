export default function positionCTO(

  polePosition:[number, number]

): [number, number] {

  const lat = polePosition[0];

  const lng = polePosition[1];

  return [

    lat,

    lng + 0.000010

  ];

}

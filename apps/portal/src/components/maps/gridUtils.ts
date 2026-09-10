export function snapToGrid(

  lat: number,

  lng: number,

  size = 0.0001
) {

  const snappedLat =
    Math.round(lat / size)
    * size;

  const snappedLng =
    Math.round(lng / size)
    * size;

  return [
    snappedLat,
    snappedLng
  ];
}

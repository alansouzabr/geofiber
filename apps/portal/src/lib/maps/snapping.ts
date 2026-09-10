export function snapToNearest(
  lat: number,
  lng: number,
  markers: any[]
) {

  let nearest = null;

  let minDistance =
    Infinity;

  for (const marker of markers) {

    const mLat =
      marker.position[0];

    const mLng =
      marker.position[1];

    const dist =
      Math.sqrt(

        Math.pow(
          lat - mLat,
          2
        ) +

        Math.pow(
          lng - mLng,
          2
        )
      );

    if (dist < minDistance) {

      minDistance =
        dist;

      nearest =
        marker;
    }
  }

  if (
    nearest &&
    minDistance < 0.0007
  ) {

    return nearest.position;
  }

  return [lat, lng];
}

export function calculateDistance(

  a: [number, number],

  b: [number, number]
) {

  const R = 6371e3;

  const lat1 =
    a[0] * Math.PI / 180;

  const lat2 =
    b[0] * Math.PI / 180;

  const deltaLat =
    (b[0] - a[0]) *
    Math.PI / 180;

  const deltaLng =
    (b[1] - a[1]) *
    Math.PI / 180;

  const x =
    Math.sin(deltaLat / 2) *
    Math.sin(deltaLat / 2) +

    Math.cos(lat1) *
    Math.cos(lat2) *

    Math.sin(deltaLng / 2) *
    Math.sin(deltaLng / 2);

  const y =
    2 *
    Math.atan2(
      Math.sqrt(x),
      Math.sqrt(1 - x)
    );

  const meters =
    R * y;

  return meters;
}

export function formatMeters(
  meters: number
) {

  if (meters >= 1000) {

    return (
      (meters / 1000)
      .toFixed(2) + " km"
    );
  }

  return (
    meters.toFixed(0) + " m"
  );
}

export function snapToNearestMarker(

  point: [number, number],

  markers: any[],

  radius = 0.00015

) {

  let nearest = point;

  let minDistance = Infinity;

  markers.forEach((marker) => {

    const dx =
      marker.position[0] -
      point[0];

    const dy =
      marker.position[1] -
      point[1];

    const dist =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    if (
      dist < radius &&
      dist < minDistance
    ) {

      minDistance =
        dist;

      nearest =
        marker.position;
    }
  });

  return nearest;
}

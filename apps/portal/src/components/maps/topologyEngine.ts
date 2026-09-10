export function findNearestElement(

  point: [number, number],

  markers: any[]
) {

  let nearest = null;

  let minDistance = Infinity;

  markers.forEach((marker) => {

    const dx =
      marker.position[0] - point[0];

    const dy =
      marker.position[1] - point[1];

    const distance =
      Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) {

      minDistance = distance;

      nearest = marker;
    }
  });

  return nearest;
}

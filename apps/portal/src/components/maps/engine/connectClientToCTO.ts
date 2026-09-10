export function connectClientToNearestCTO(

  client: any,

  markers: any[],

  setMarkers: any

) {

  const ctos =
    markers.filter(
      (m) =>
        m.type === "CTO"
    );

  if (!ctos.length) {

    return;
  }

  let nearest =
    ctos[0];

  let minDist =
    Infinity;

  ctos.forEach((cto) => {

    const dx =
      cto.position[0] -
      client.position[0];

    const dy =
      cto.position[1] -
      client.position[1];

    const dist =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    if (dist < minDist) {

      minDist = dist;

      nearest = cto;
    }
  });

  setMarkers(
    (prev: any) =>

      prev.map(
        (item: any) => {

          if (
            item.id ===
            client.id
          ) {

            return {

              ...item,

              connected: true,

              ctoId:
                nearest.id
            };
          }

          if (
            item.id ===
            nearest.id
          ) {

            return {

              ...item,

              usedPorts:
                (item.usedPorts || 0) + 1
            };
          }

          return item;
        }
      )
  );
}

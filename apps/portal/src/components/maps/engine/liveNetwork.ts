export function updateFiberConnections(

  fibers: any[],

  markers: any[]

) {

  return fibers.map(

    (fiber) => {

      /*
      ========================
      STATIC FIBER
      ========================
      */

      if (
        !fiber.dynamic
      ) {

        return fiber;
      }

      /*
      ========================
      TOPOLOGY GRAPH
      ========================
      */

      const startPole =

        markers.find(

          (marker) =>

            marker.id ===
            fiber.startPoleId
        );

      const endPole =

        markers.find(

          (marker) =>

            marker.id ===
            fiber.endPoleId
        );

      /*
      ========================
      INVALID CONNECTION
      ========================
      */

      if (

        !startPole ||

        !endPole
      ) {

        return fiber;
      }

      /*
      ========================
      REALTIME RECALC
      ========================
      */

      return {

        ...fiber,

        points: [

          startPole.position,

          endPole.position
        ]
      };
    }
  );
}

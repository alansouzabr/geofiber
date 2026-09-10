export function exportProject(

  markers: any[],

  fibers: any[]
) {

  const payload = {

    version:
      "GeoFiber GIS v1",

    exportedAt:
      new Date()
        .toISOString(),

    markers,

    fibers
  };

  const blob =
    new Blob(

      [
        JSON.stringify(
          payload,
          null,
          2
        )
      ],

      {
        type:
          "application/json"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href =
    url;

  a.download =
    `geofiber-project-${
      Date.now()
    }.json`;

  a.click();

  URL.revokeObjectURL(url);
}

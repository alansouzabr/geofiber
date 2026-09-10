export function pushHistory(

  history: any[],

  state: any
) {

  return [

    ...history,

    JSON.parse(
      JSON.stringify(state)
    )
  ];
}

export function undoHistory(

  history: any[]
) {

  if (history.length <= 1)
    return null;

  return history[
    history.length - 2
  ];
}

export function redoHistory(

  future: any[]
) {

  if (!future.length)
    return null;

  return future[0];
}

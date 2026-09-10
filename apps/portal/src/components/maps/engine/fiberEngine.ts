export function getFiberStyle(
  type: string
) {

  if (
    type === "12FO"
  ) {

    return {

      color: "#ef4444",

      weight: 2
    };
  }

  if (
    type === "24FO"
  ) {

    return {

      color: "#f97316",

      weight: 3
    };
  }

  if (
    type === "36FO"
  ) {

    return {

      color: "#22c55e",

      weight: 4
    };
  }

  if (
    type === "72FO"
  ) {

    return {

      color: "#3b82f6",

      weight: 5
    };
  }

  return {

    color: "#22d3ee",

    weight: 2
  };
}

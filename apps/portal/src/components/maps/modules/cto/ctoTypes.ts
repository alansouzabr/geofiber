export const CTO_CAPACITIES = [

  8,

  16,

  24,

  32

] as const;

export type CtoCapacity =
  typeof CTO_CAPACITIES[number];

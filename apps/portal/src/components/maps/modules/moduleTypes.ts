export const NETWORK_MODULES = {

  POLE: "POLE",

  CTO: "CTO",

  CEO: "CEO",

  CLIENT: "CLIENT",

  SPLITTER: "SPLITTER",

  CABLE: "CABLE",

  POP: "POP",

  BACKBONE: "BACKBONE"

} as const;

export type NetworkModuleType =
  typeof NETWORK_MODULES[
    keyof typeof NETWORK_MODULES
  ];

export const ASSET_TYPES = {

  POLE: "POLE",

  FIBER: "FIBER",

  STATION: "STATION",

  RACK: "RACK",

  ACCESSORY: "ACCESSORY",

  OTDR: "OTDR",

  GROUP: "GROUP",

  CTO: "CTO",

  CEO: "CEO",

  CLIENT: "CLIENT",

  SPLITTER: "SPLITTER",

  CABLE: "CABLE",

  DUCT: "DUCT",

  HANDHOLE: "HANDHOLE",

  POP: "POP",

  BACKBONE: "BACKBONE"

} as const;

export type AssetType =
  typeof ASSET_TYPES[keyof typeof ASSET_TYPES];

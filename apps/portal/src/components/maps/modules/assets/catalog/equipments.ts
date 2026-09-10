export const EQUIPMENTS = [

  "POSTE_CONCRETO",
  "POSTE_METALICO",
  "POSTE_MADEIRA",

  "CTO",
  "CTO_8",
  "CTO_16",
  "CTO_32",
  "CTO_64",

  "CEO",

  "SPLITTER_1X2",
  "SPLITTER_1X4",
  "SPLITTER_1X8",
  "SPLITTER_1X16",
  "SPLITTER_1X32",
  "SPLITTER_1X64",

  "CLIENTE_RESIDENCIAL",
  "CLIENTE_EMPRESARIAL",

  "POP",

  "OLT",

  "DIO",

  "RACK",

  "ONU",

  "CABO_DROP",

  "CABO_ADSS",

  "CABO_BACKBONE",

  "CABO_SUBTERRANEO",

  "EMENDA",

  "RESERVA",

  "CAIXA_PASSAGEM",

  "CAIXA_SUBTERRANEA"

] as const;

export type EquipmentType =
typeof EQUIPMENTS[number];

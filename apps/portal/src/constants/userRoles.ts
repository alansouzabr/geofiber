export const USER_ROLES = [

  "ADMIN",

  "ENGENHEIRO",


  "ANALISTA",
  "SUPERVISOR",

  "TECNICO",

  "AJUDANTE",

  "PROJETISTA",

  "RH",

  "FINANCEIRO",

  "COMERCIAL",

  "ATENDENTE"

] as const;

export type UserRole =
  typeof USER_ROLES[number];

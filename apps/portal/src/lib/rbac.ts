export type Role =
  | 'ROOT'
  | 'MASTER'
  | 'ADMIN'
  | 'ENGENHEIRO'
  | 'ANALISTA'
  | 'SUPERVISOR'
  | 'PROJETISTA'
  | 'TECNICO'
  | 'AJUDANTE'
  | 'RH'
  | 'FINANCEIRO'
  | 'COMERCIAL'
  | 'ATENDENTE';

export type Permission = string;

export function hasPermission(
  permissions: string[] | undefined,
  perm: Permission
): boolean {
  return Array.isArray(permissions)
    && permissions.includes(perm);
}

export function hasAnyPermission(
  permissions: string[] | undefined,
  required: Permission[]
): boolean {
  if (!Array.isArray(permissions)) {
    return false;
  }

  return required.some(
    permission => permissions.includes(permission)
  );
}

export function hasAllPermissions(
  permissions: string[] | undefined,
  required: Permission[]
): boolean {
  if (!Array.isArray(permissions)) {
    return false;
  }

  return required.every(
    permission => permissions.includes(permission)
  );
}

export type MenuItem = {
  label: string;
  href: string;
  perm: Permission;
  icon?: string;
};

export function canCreateUsers(role?: string){

  return [

    "ROOT",

    "MASTER",

    "ADMIN"

  ].includes(role || "");

}

export function canEditUsers(role?: string){

  return [

    "ROOT",

    "MASTER",

    "ADMIN"

  ].includes(role || "");

}

export function canDeleteUsers(role?: string){

  return [

    "ROOT",

    "MASTER",

    "ADMIN"

  ].includes(role || "");

}

export function canManageCompany(role?: string){

  return [

    "ROOT",

    "MASTER",

    "ADMIN"

  ].includes(role || "");

}

export function canManageProjects(role?: string){

  return [

    "ROOT",

    "MASTER",

    "ADMIN",

    "ENGENHEIRO",

    "SUPERVISOR",

    "PROJETISTA"

  ].includes(role || "");

}

export function canAccessGED(role?: string){

  return [

    "ROOT",

    "MASTER",

    "ADMIN",

    "ENGENHEIRO",

    "SUPERVISOR",

    "PROJETISTA",

    "TECNICO",

    "AJUDANTE",

    "RH",

    "FINANCEIRO",

    "COMERCIAL",

    "ATENDENTE"

  ].includes(role || "");

}

export function canAccessFinanceiro(role?: string){

  return [

    "ROOT",

    "MASTER",

    "ADMIN",

    "FINANCEIRO"

  ].includes(role || "");

}

export type Role = 'ROOT' | 'OWNER' | 'ADMIN' | 'NOC' | 'TECH' | 'VIEWER';

export type Permission =
  | 'dashboard.view'
  | 'projects.view'
  | 'stations.view'
  | 'racks.view'
  | 'companies.manage'
  | 'plans.manage'
  | 'users.manage';

export const rolePermissions: Record<Role, Permission[]> = {
  ROOT: [
    'dashboard.view',
    'projects.view',
    'stations.view',
    'racks.view',
    'companies.manage',
    'plans.manage',
    'users.manage',
  ],
  OWNER: [
    'dashboard.view',
    'projects.view',
    'stations.view',
    'racks.view',
    'users.manage',
    'plans.manage',
  ],
  ADMIN: ['dashboard.view', 'projects.view', 'stations.view', 'racks.view', 'users.manage'],
  NOC: ['dashboard.view', 'projects.view', 'stations.view', 'racks.view'],
  TECH: ['stations.view', 'racks.view'],
  VIEWER: ['dashboard.view', 'projects.view', 'stations.view', 'racks.view'],
};

export function hasPermission(role: Role, perm: Permission) {
  return rolePermissions[role]?.includes(perm) ?? false;
}

export type MenuItem = {
  label: string;
  href: string;
  perm: Permission;
  icon?: string;
};

export const menu: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', perm: 'dashboard.view', icon: '📊' },
  { label: 'Projects', href: '/projects', perm: 'projects.view', icon: '📁' },
  { label: 'Stations', href: '/stations', perm: 'stations.view', icon: '📡' },
  { label: 'Racks', href: '/racks', perm: 'racks.view', icon: '🧱' },
  { label: 'Empresas', href: '/companies', perm: 'companies.manage', icon: '🏢' },
  { label: 'Planos (SaaS)', href: '/plans', perm: 'plans.manage', icon: '💳' },
  { label: 'Usuários', href: '/users', perm: 'users.manage', icon: '👥' },
];

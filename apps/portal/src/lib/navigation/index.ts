import {
  hasPermission,
  type Permission,
} from '@/lib/rbac';

import {
  menu,
  type MenuItem,
} from './menu';

export function getNavigation(
  permissions: string[] | undefined,
): MenuItem[] {
  return menu.filter(item =>
    hasPermission(
      permissions,
      item.perm as Permission,
    )
  );
}

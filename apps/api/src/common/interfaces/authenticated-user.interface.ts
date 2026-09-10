import { RoleName } from '../../modules/roles/roles.constants';

export interface AuthenticatedUser {
  id: string;
  email: string;
  companyId: string | null;
  role: RoleName;
}

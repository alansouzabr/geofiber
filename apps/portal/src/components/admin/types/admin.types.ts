export type CompanyUser = {

  id: string;

  name: string;

  email: string;

  whatsapp?: string;

  role?: string;

  isActive?: boolean;

  UserRole?: Array<{
    Role?: {
      name?: string;
    };
  }>;

  FieldTechnicianProfile?: {
    whatsapp?: string;
  };
};

export type CompanyPlan = {

  id: string;

  name: string;
};

export type Company = {

  id: string;

  name: string;

  isActive: boolean;

  createdAt?: string;

  users?: CompanyUser[];
  User?: CompanyUser[];

  plan?: CompanyPlan;
};

export type DashboardStats = {

  companies: number;

  users: number;

  trts: number;

  pendingTrts: number;
};
